import { useGoogleLogin } from '@react-oauth/google';

interface LoginPageProps {
  onLoginSuccess: (tokenResponse: any) => void;
  isLoading?: boolean;
}

export function LoginPage({ onLoginSuccess, isLoading = false }: LoginPageProps) {
  const login = useGoogleLogin({
    onSuccess: onLoginSuccess,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
    flow: 'implicit'
  });

  return (
    <div className="min-h-screen bg-enfp-light dark:bg-enfp-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 dark:bg-enfp-dark/50 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-md text-center space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-enfp-primary to-enfp-accent bg-clip-text text-transparent tracking-tight">
            Sparkle Habits
          </h1>
          <p className="text-enfp-muted dark:text-enfp-muted/80 mt-2 font-bold tracking-widest text-xs uppercase">
            Your Happy Path to Growth
          </p>
        </div>

        <div className="py-4">
          <div className="w-20 h-20 bg-gradient-to-br from-enfp-secondary/20 to-enfp-primary/20 rounded-full mx-auto flex items-center justify-center mb-6 text-4xl shadow-inner animate-bounce-fast">
            💖
          </div>
          <p className="text-enfp-text dark:text-enfp-text-dark font-medium leading-relaxed">
            Welcome! Let's track your journey with joy. <br/>
            Sign in to sync your sparkle across devices.
          </p>
        </div>

        <button
          onClick={() => login()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/10 text-enfp-text dark:text-white border-2 border-enfp-muted/20 dark:border-white/10 hover:border-enfp-primary hover:text-enfp-primary dark:hover:border-enfp-primary dark:hover:text-enfp-primary font-bold py-4 px-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
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

        <p className="text-xs text-enfp-muted/60 dark:text-enfp-muted/40">
          We only access the specific spreadsheet we create for you. Your data is yours.
        </p>
      </div>
    </div>
  );
}