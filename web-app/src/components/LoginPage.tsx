import { useGoogleLogin } from '@react-oauth/google';

interface LoginPageProps {
  onLoginSuccess: (tokenResponse: any) => void;
  isLoading?: boolean;
}

export function LoginPage({ onLoginSuccess, isLoading = false }: LoginPageProps) {
  const login = useGoogleLogin({
    onSuccess: onLoginSuccess,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
    flow: 'implicit' // or 'auth-code' if we had a backend, but 'implicit' gives us the access_token directly for client-side usage
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Polymath Protocol
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-mono text-sm">
            Restricted Access
          </p>
        </div>

        <div className="py-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4 text-2xl">
            🔒
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Sign in with Google to access your habit data stored in your personal Cloud.
          </p>
        </div>

        <button
          onClick={() => login()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="animate-pulse">Connecting...</span>
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          This app requires access to manage a specific spreadsheet in your Google Drive.
        </p>
      </div>
    </div>
  );
}
