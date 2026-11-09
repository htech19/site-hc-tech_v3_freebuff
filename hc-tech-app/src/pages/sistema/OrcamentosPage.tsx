import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { FileText, Search, Plus, Calendar, Clock, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, calculateBudget } from '../../lib/utils';

interface OrcamentoItem {
  id: string;
  numero: string;
  cliente_nome: string;
  cliente_telefone?: string;
  equipamento: string;
  marca?: string;
  modelo?: string;
  defeito: string;
  servico_solicitado?: string;
  data_solicitacao: string;
  data_validade?: string;
  custo_pecas: number;
  frete: number;
  outros_custos: number;
  valor_venda_pecas: number;
  mao_de_obra: number;
  desconto: number;
  garantia: number;
  created_at: string;
}

export function OrcamentosPage() {
  const navigate = useNavigate();
  const [orcamentos, setOrcamentos] = useState<OrcamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'valid' | 'expired'>('all');

  useEffect(() => {
    const loadOrcamentos = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrcamentos([
        {
          id: '1',
          numero: 'ORC-0001',
          cliente_nome: 'Harrison',
          cliente_telefone: '(11) 94056-2933',
          equipamento: 'Celular',
          marca: 'Samsung',
          modelo: 'M54 C/A',
          defeito: 'Tela quebrada',
          servico_solicitado: 'Troca de tela completa',
          data_solicitacao: '2026-10-15',
          data_validade: '2026-11-14',
          custo_pecas: 280,
          frete: 20,
          outros_custos: 10,
          valor_venda_pecas: 320,
          mao_de_obra: 100,
          desconto: 10,
          garantia: 90,
          created_at: '2026-10-15T10:00:00Z',
        },
        {
          id: '2',
          numero: 'ORC-0002',
          cliente_nome: 'Maria Silva',
          equipamento: 'Notebook',
          marca: 'Dell',
          modelo: 'Inspiron 15',
          defeito: 'Notebook não liga',
          data_solicitacao: '2026-11-01',
          data_validade: '2026-11-30',
          custo_pecas: 0,
          frete: 0,
          outros_custos: 0,
          valor_venda_pecas: 0,
          mao_de_obra: 150,
          desconto: 0,
          garantia: 30,
          created_at: '2026-11-01T14:30:00Z',
        },
        {
          id: '3',
          numero: 'ORC-0003',
          cliente_nome: 'João Pereira',
          equipamento: 'Celular',
          marca: 'iPhone',
          modelo: '13 Pro',
          defeito: 'Bateria dura pouco',
          data_solicitacao: '2026-10-20',
          data_validade: '2026-11-19',
          custo_pecas: 120,
          frete: 15,
          outros_custos: 0,
          valor_venda_pecas: 150,
          mao_de_obra: 80,
          desconto: 20,
          garantia: 30,
          created_at: '2026-10-20T09:15:00Z',
        },
      ]);
      setLoading(false);
    };
    
    loadOrcamentos();
  }, []);

  const filteredOrcamentos = orcamentos.filter(orc => {
    const matchesSearch = orc.cliente_nome.toLowerCase().includes(search.toLowerCase()) ||
                         orc.numero.toLowerCase().includes(search.toLowerCase()) ||
                         orc.defeito.toLowerCase().includes(search.toLowerCase());
    
    const validityDate = new Date(orc.data_validade || new Date().toISOString());
    const isExpired = validityDate < new Date();
    
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'valid' && !isExpired) || 
                         (filter === 'expired' && isExpired);
    
    return matchesSearch && matchesFilter;
  });

  const getBudgetSummary = (orc: OrcamentoItem) => {
    const { custoTotal, valorFinal, lucroBruto, margemBruta } = calculateBudget(
      orc.custo_pecas || 0,
      orc.frete || 0,
      orc.outros_custos || 0,
      orc.valor_venda_pecas || 0,
      orc.mao_de_obra || 0,
      orc.desconto || 0
    );
    
    return { custoTotal, valorFinal, lucroBruto, margemBruta };
  };

  const getStatusBadge = (orc: OrcamentoItem) => {
    const now = new Date();
    const validityDate = new Date(orc.data_validade || now.toISOString());
    const diffDays = Math.ceil((validityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
    }
    if (diffDays <= 7) {
      return <Badge className="bg-orange-100 text-orange-800">{diffDays} dias</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Válido</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os orçamentos do sistema</p>
        </div>
        <Button onClick={() => navigate('/orcamentos/novo')}>
          <Plus size={18} className="mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por número, cliente ou defeito..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
          >
            <option value="all">Todos</option>
            <option value="valid">Válidos</option>
            <option value="expired">Vencidos</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredOrcamentos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Nenhum orçamento encontrado</p>
            <Button className="mt-4" onClick={() => navigate('/orcamentos/novo')}>
              <Plus size={18} className="mr-2" />
              Criar primeiro orçamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrcamentos.map((orc) => {
            const summary = getBudgetSummary(orc);
            
            return (
              <Card
                key={orc.id}
                className="hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => {/* Editar - futuramente */}}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-gray-400">{orc.numero}</span>
                          {getStatusBadge(orc)}
                        </div>
                        <h3 className="font-semibold mt-1">{orc.cliente_nome}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {orc.marca} {orc.modelo} - {orc.defeito}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-400">
                            <Calendar size={14} />
                            Solicitação: {formatDate(orc.data_solicitacao)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Clock size={14} />
                            Válido até: {formatDate(orc.data_validade || '')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(summary.valorFinal)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Lucro: {formatCurrency(summary.lucroBruto)} ({summary.margemBruta.toFixed(1)}%)
                      </div>
                    </div>
                    
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
