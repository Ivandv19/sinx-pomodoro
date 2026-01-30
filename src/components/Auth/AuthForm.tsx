import { useState } from 'preact/hooks';

interface Props {
  translations: {
    loginTitle: string;
    signupTitle: string;
    loginSubtitle: string;
    signupSubtitle: string;
    toggleLogin: string;
    toggleSignup: string;
    btnLogin: string;
    btnSignup: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    genericError: string;
    loading: string;
  };
  redirectPath: string;
}

export default function AuthForm({ translations, redirectPath }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const endpoint = isLogin ? '/api/login' : '/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || translations.genericError);
      }

      // Success
      window.location.href = redirectPath;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md w-full space-y-8 bg-base-200/50 backdrop-blur-lg border border-base-200 p-8 rounded-2xl shadow-xl animate-fade-in-up">
      <div class="text-center">
        <h2 class="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white font-[Outfit]">
          {isLogin ? translations.loginTitle : translations.signupTitle}
        </h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {isLogin ? translations.loginSubtitle : translations.signupSubtitle}{' '}
          <button
            onClick={toggleMode}
            type="button"
            class="font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
          >
            {isLogin ? translations.toggleSignup : translations.toggleLogin}
          </button>
        </p>
      </div>

      <form class="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label htmlFor="email-address" class="sr-only">
              {translations.emailLabel}
            </label>
            <div class="relative">
                <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                class="appearance-none rounded-lg relative block w-full px-12 py-3 border border-input-border dark:border-input-border-dark bg-input-bg dark:bg-input-bg-dark placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all"
                placeholder={translations.emailPlaceholder}
                />
                <span class="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    {/* Mail Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </span>
            </div>
          </div>
          <div>
            <label htmlFor="password" class="sr-only">
              {translations.passwordLabel}
            </label>
            <div class="relative">
                <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                class="appearance-none rounded-lg relative block w-full px-12 py-3 border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all"
                placeholder={translations.passwordPlaceholder}
                />
                 <span class="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    {/* Lock Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </span>
            </div>
          </div>
        </div>

        {error && (
          <div class="text-red-500 text-sm text-center animate-pulse bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform active:scale-95 shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {translations.loading}
              </span>
            ) : (
                <>
                 <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                 <svg class="h-5 w-5 text-primary-500 group-hover:text-primary-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
				</svg>
                 </span>
                 {isLogin ? translations.btnLogin : translations.btnSignup}
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
