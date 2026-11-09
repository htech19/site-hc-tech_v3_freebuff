
import { useTheme } from '../theme/ThemeProvider';
import { Sun, Moon, Menu, X, LayoutDashboard, Wrench, FileText, Package, Users, LogOut } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/os', label: 'Ordens de Serviço', icon: Wrench },
  { path: '/orcamentos', label: 'Orçamentos', icon: FileText },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/clientes', label: 'Clientes', icon: Users },
];

export function Layout({ children }: { children: import('react').ReactNode }) {
  const { toggleTheme } = useTheme();
  const { theme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L22 6V12L12 18L2 12V6L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
                </svg>
              </div>
              <span className="font-semibold text-lg">HC TECH</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {user && (
              <div className="flex items-center gap-2 ml-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-background">
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/' ? window.location.pathname === '/' : window.location.pathname.startsWith(item.path);
                
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <div className="text-xs text-gray-400 dark:text-gray-500">
              HC Tech Infocell<br />
              São Bernardo do Campo - SP
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative flex flex-col w-64 bg-background p-4">
              <button
                className="absolute top-4 right-4 p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
              
              <nav className="mt-14">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    
                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            item.path === '/' && window.location.pathname === '/'
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon size={18} />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
