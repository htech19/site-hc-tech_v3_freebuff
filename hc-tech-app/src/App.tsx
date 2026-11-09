import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { OSPage } from './pages/sistema/OSPage';
import { OSNewPage } from './pages/sistema/OSNewPage';
import { OrcamentosPage } from './pages/sistema/OrcamentosPage';
import { OrcamentoNewPage } from './pages/sistema/OrcamentoNewPage';
import { EstoquePage } from './pages/estoque/EstoquePage';
import { ClientesPage } from './pages/clientes/ClientesPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/os" element={<OSPage />} />
                      <Route path="/os/novo" element={<OSNewPage />} />
                      <Route path="/orcamentos" element={<OrcamentosPage />} />
                      <Route path="/orcamentos/novo" element={<OrcamentoNewPage />} />
                      <Route path="/estoque" element={<EstoquePage />} />
                      <Route path="/clientes" element={<ClientesPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
