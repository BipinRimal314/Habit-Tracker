
const SPREADSHEET_TITLE = 'Polymath Protocol Data';

export const GoogleSheetsService = {
  
  async findOrCreateSpreadsheet(accessToken: string): Promise<string> {
    // 1. Search for existing file
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${SPREADSHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const searchData = await searchRes.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // 2. Create new if not found
    const createRes = await fetch('https://www.googleapis.com/sheets/v4/spreadsheets', {
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
    const createData = await createRes.json();
    
    // Initialize headers
    await this.appendRow(accessToken, createData.spreadsheetId, ['Date', 'HabitID', 'Value', 'Timestamp']);
    
    return createData.spreadsheetId;
  },

  async appendRow(accessToken: string, spreadsheetId: string, values: string[]) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Logs!A:A:append?valueInputOption=USER_ENTERED`;
    await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [values]
      })
    });
  },

  async loadData(accessToken: string): Promise<Record<string, Record<string, boolean>>> {
    const spreadsheetId = await this.findOrCreateSpreadsheet(accessToken);
    
    // Cache ID for future writes
    localStorage.setItem('google_spreadsheet_id', spreadsheetId);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Logs!A2:C`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
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
