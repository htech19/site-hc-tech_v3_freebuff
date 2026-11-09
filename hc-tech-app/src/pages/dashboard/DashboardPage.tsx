import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BarChart3, Users, Wrench, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface DashboardStats {
  faturamentoMes: number;
  faturamentoAnterior: number;
  clientesCadastrados: number;
  osAbertas: number;
  osConcluidas: number;
  estoqueTotal: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    faturamentoMes: 0,
    faturamentoAnterior: 0,
    clientesCadastrados: 0,
    osAbertas: 0,
    osConcluidas: 0,
    estoqueTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats({
        faturamentoMes: 12580.50,
        faturamentoAnterior: 9800.00,
        clientesCadastrados: 156,
        osAbertas: 23,
        osConcluidas: 18,
        estoqueTotal: 342,
      });
      setLoading(false);
    };
    
    loadStats();
  }, []);

  const calcFaturamentoVariation = () => {
    if (!stats.faturamentoAnterior) return { value: 0, isPositive: true };
    const variation = ((stats.faturamentoMes - stats.faturamentoAnterior) / stats.faturamentoAnterior) * 100;
    return { value: variation, isPositive: variation >= 0 };
  };

  const variation = calcFaturamentoVariation();

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visão geral do sistema</p>
      </div>

      {/* Faturamento destacado */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-0">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp size={18} />
            Faturamento de {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">{formatCurrency(stats.faturamentoMes)}</p>
              <p className={`text-sm flex items-center gap-1 mt-1 ${
                variation.isPositive ? 'text-success' : 'text-danger'
              }`}>
                {variation.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(variation.value).toFixed(1)}% vs mês anterior
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Faturamento Mês"
          value={formatCurrency(stats.faturamentoMes)}
          subtext={`vs ${formatCurrency(stats.faturamentoAnterior)} anterior`}
          trend={variation.isPositive ? 'up' : 'down'}
        />
        <StatCard
          icon={<Users size={20} />}
          label="Clientes Cadastrados"
          value={stats.clientesCadastrados.toString()}
          subtext="+12 este mês"
          trend="up"
        />
        <StatCard
          icon={<Wrench size={20} />}
          label="OS Em Andamento"
          value={stats.osAbertas.toString()}
          subtext={`${stats.osConcluidas} concluídas`}
          trend="neutral"
        />
        <StatCard
          icon={<Package size={20} />}
          label="Itens em Estoque"
          value={stats.estoqueTotal.toString()}
          subtext="produtos cadastrados"
          trend="up"
        />
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickActionButton
              label="Nova OS"
              icon={<Wrench size={18} />}
              href="/os/novo"
            />
            <QuickActionButton
              label="Novo Orçamento"
              icon={<BarChart3 size={18} />}
              href="/orcamentos/novo"
            />
            <QuickActionButton
              label="Estoque"
              icon={<Package size={18} />}
              href="/estoque"
            />
            <QuickActionButton
              label="Clientes"
              icon={<Users size={18} />}
              href="/clientes"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, trend }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            {icon}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-success/10 text-success' :
            trend === 'down' ? 'bg-danger/10 text-danger' :
            'bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
          </span>
        </div>
        <p className="text-2xl font-bold mt-4">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{subtext}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({ label, icon, href }: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <button
      onClick={() => window.location.href = href}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer"
    >
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
