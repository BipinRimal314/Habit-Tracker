
const SPREADSHEET_TITLE = 'Polymath Protocol Data';

export const GoogleSheetsService = {
  
  async findOrCreateSpreadsheet(accessToken: string): Promise<string> {
    // 1. Search for existing file
    const q = `name='${SPREADSHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}`;
    
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!searchRes.ok) {
        console.error('Drive API Search Error:', searchRes.status, searchRes.statusText);
        // Continue to try creating if search fails? No, better to throw.
        const text = await searchRes.text();
        throw new Error(`Drive API Error: ${text}`);
    }

    const searchData = await searchRes.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // 2. Create new if not found
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title: SPREADSHEET_TITLE },
        sheets: [{
          properties: { title: 'Logs' }
        }]
      })
    });

    if (!createRes.ok) {
        const text = await createRes.text();
        throw new Error(`Sheets API Create Error: ${text}`);
    }

    const createData = await createRes.json();
    
    // Initialize headers
    await this.appendRow(accessToken, createData.spreadsheetId, ['Date', 'HabitID', 'Value', 'Timestamp']);
    
    return createData.spreadsheetId;
  },

  async appendRow(accessToken: string, spreadsheetId: string, values: string[]) {
    const range = encodeURIComponent('Logs!A:A:append');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [values]
      })
    });

    if (!res.ok) {
        console.error('Append Error:', await res.text());
    }
  },

  async loadData(accessToken: string): Promise<Record<string, Record<string, boolean>>> {
    const spreadsheetId = await this.findOrCreateSpreadsheet(accessToken);
    
    // Cache ID for future writes
    localStorage.setItem('google_spreadsheet_id', spreadsheetId);

    const range = encodeURIComponent('Logs!A2:C');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!response.ok) {
        throw new Error(`Load Data Error: ${await response.text()}`);
    }

    const data = await response.json();
    
    const rows = data.values || [];
    const completions: Record<string, Record<string, boolean>> = {};

    // Replay log to build state
    // Row format: [Date, HabitID, Value]
    rows.forEach((row: string[]) => {
      const [date, habitId, valueStr] = row;
      if (!date || !habitId) return;

      const isComplete = valueStr === 'TRUE';
      
      if (!completions[date]) {
        completions[date] = {};
      }
      completions[date][habitId] = isComplete;
    });

    return completions;
  },

  async syncHabit(accessToken: string, date: string, habitId: string, isComplete: boolean) {
    const spreadsheetId = localStorage.getItem('google_spreadsheet_id');
    if (!spreadsheetId) throw new Error("Spreadsheet ID not found");

    const timestamp = new Date().toISOString();
    await this.appendRow(accessToken, spreadsheetId, [date, habitId, isComplete ? 'TRUE' : 'FALSE', timestamp]);
  }
};
