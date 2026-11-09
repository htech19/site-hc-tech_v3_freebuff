import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Lock, Loader2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [oAuthLoading, setOAuthLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!email || !password) {
      setError('Preencha todos os campos');
      setLocalLoading(false);
      return;
    }
    
    const mockUser: any = {
      id: 'user-1',
      email,
      full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setLocalLoading(false);
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setOAuthLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: any = {
      id: 'google-user-1',
      email: 'harrison@hctech.com',
      full_name: 'Harrison',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setOAuthLoading(false);
    navigate('/');
  };

  const handleGitHubLogin = async () => {
    setOAuthLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: any = {
      id: 'github-user-1',
      email: 'dev@hctech.com',
      full_name: 'Desenvolvedor HC',
      role: 'tecnico',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setOAuthLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L22 6V12L12 18L2 12V6L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary">HC TECH</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sistema de Gestão</p>
        </div>

        {/* Card */}
        <div className="bg-background rounded-2xl shadow-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Entrar na sua conta</h2>

          <div className="space-y-4">
            {/* Botões OAuth */}
            <button
              onClick={handleGoogleLogin}
              disabled={oAuthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {oAuthLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                </>
              )}
              {oAuthLoading ? 'Conectando...' : 'Continuar com Google'}
            </button>

            <button
              onClick={handleGitHubLogin}
              disabled={oAuthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {oAuthLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.403 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653 2.144 2.573 3.296 2.291 1.96-.265 2.983-.398 3.003-.403 2.018.078 3.301 1.23 3.301 1.23 3.401 1.654 3.495 3.176.116 1.651.622 3.176 1.006 3.176 1.21 0 2.381-.473 3.221-1.237 2.029 5.026 6.388 1.91 6.388 6.304 0 1.311-.469 2.381-1.236 3.221.103.303.533 1.524-.117 3.176 0 0 1.008.322 3.301-1.23-1.012.267-1.993.399-3.003.404-1.02-.005-2.047-.138-3.006-.403-2.292 1.552-3.297 1.23-3.297 1.23-.653-1.653-2.145-2.573-3.297-2.291 1.96.265 2.983.398 3.003.403 2.018-.078 3.301-1.23 3.301-1.23 3.401-1.653 3.496-3.175.116-1.652.622-3.176 1.006-3.176z"/>
                </svg>
              )}
              {oAuthLoading ? 'Conectando...' : 'Continuar com GitHub'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-gray-500 dark:text-gray-400">ou</span>
              </div>
            </div>

            {/* Form email/senha */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-danger">{error}</p>
              )}

              <button
                type="submit"
                disabled={localLoading || oAuthLoading}
                className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {localLoading || oAuthLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Acesso rápido para teste: qualquer e-mail funciona
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          HC Tech Infocell - São Bernardo do Campo - SP
        </p>
      </div>
    </div>
  );
}
