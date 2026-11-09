import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { OSDetailModal } from '../../components/os/OSDetailModal';
import { Wrench, Search, Plus, ChevronRight, Calendar, Phone } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

// Helper SVG icons
function Clock({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );
}

function CheckCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22,4 12,14.01 9,11.01"></polyline>
    </svg>
  );
}

function PackageIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24"></path>
      <path d="M21 16.22v-1.25a3 3 0 0 0-3-3H13a3 3 0 0 0-3 3v1.78"></path>
      <path d="M11 21.98h6.5a1.5 1.5 0 0 0 1.5-1.5V3.5a1.5 1.5 0 0 0-1.5-1.5H11A1.5 1.5 0 0 0 9.5 3.5v17.52a1.5 1.5 0 0 0 1.5 1.5Z"></path>
    </svg>
  );
}

interface OSItem {
  id: string;
  numero: string;
  cliente_nome: string;
  cliente_telefone?: string;
  equipamento: string;
  marca?: string;
  modelo?: string;
  defeito: string;
  status: 'aguardando' | 'em_andamento' | 'concluido' | 'entregue';
  valor_final?: number;
  data_entrada: string;
  tecnico?: string;
}

const statusConfig = {
  aguardando: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800', icon: Clock as React.ComponentType<{ size?: number }> },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800', icon: Wrench as React.ComponentType<{ size?: number }> },
  concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircle as React.ComponentType<{ size?: number }> },
  entregue: { label: 'Entregue', color: 'bg-gray-100 text-gray-800', icon: PackageIcon as React.ComponentType<{ size?: number }> },
};

export function OSPage() {
  const navigate = useNavigate();
  const [osList, setOsList] = useState<OSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOS, setSelectedOS] = useState<OSItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadOS = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOsList([
        {
          id: '1',
          numero: 'OS-0001',
          cliente_nome: 'Harrison',
          cliente_telefone: '(11) 94056-2933',
          equipamento: 'Celular',
          marca: 'Samsung',
          modelo: 'M54 C/A',
          defeito: 'Tela quebrada',
          status: 'concluido',
          valor_final: 350,
          data_entrada: '2026-10-15T10:00:00Z',
        },
        {
          id: '2',
          numero: 'OS-0002',
          cliente_nome: 'Maria Silva',
          cliente_telefone: '(11) 99999-9999',
          equipamento: 'Notebook',
          marca: 'Dell',
          modelo: 'Inspiron 15',
          defeito: 'Notebook não liga',
          status: 'em_andamento',
          valor_final: 450,
          data_entrada: '2026-11-01T14:30:00Z',
        },
        {
          id: '3',
          numero: 'OS-0003',
          cliente_nome: 'João Pereira',
          equipamento: 'Celular',
          marca: 'iPhone',
          modelo: '13 Pro',
          defeito: 'Bateria dura pouco',
          status: 'aguardando',
          valor_final: 280,
          data_entrada: '2026-11-08T09:15:00Z',
        },
      ]);
      setLoading(false);
    };
    
    loadOS();
  }, []);

  const filteredOS = osList.filter(os => {
    const matchesSearch = os.cliente_nome.toLowerCase().includes(search.toLowerCase()) ||
                         os.numero.toLowerCase().includes(search.toLowerCase()) ||
                         os.defeito.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || os.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: string) => 
    osList.filter(os => os.status === status).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie todas as OS</p>
        </div>
        <Button onClick={() => navigate('/os/novo')}>
          <Plus size={18} className="mr-2" />
          Nova OS
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Aguardando</p>
          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{getStatusCount('aguardando')}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">Em Andamento</p>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{getStatusCount('em_andamento')}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">Concluídos</p>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">{getStatusCount('concluido')}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">Entregues</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{getStatusCount('entregue')}</p>
        </div>
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
          >
            <option value="all">Todos os status</option>
            <option value="aguardando">Aguardando</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredOS.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Nenhuma OS encontrada</p>
            <Button className="mt-4" onClick={() => navigate('/os/novo')}>
              <Plus size={18} className="mr-2" />
              Criar primeira OS
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOS.map((os) => {
            const StatusIcon = statusConfig[os.status].icon;
            
            return (
              <Card
                key={os.id}
                className="hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedOS(os);
                  setDetailModalOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Wrench size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-400">{os.numero}</span>
                          <Badge className={statusConfig[os.status as keyof typeof statusConfig].color}>
                            <StatusIcon size={12} />
                            {statusConfig[os.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mt-1">{os.cliente_nome}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {os.marca} {os.modelo} - {os.defeito}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          {os.cliente_telefone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {os.cliente_telefone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(os.data_entrada)}
                          </span>
                          {os.valor_final && (
                            <span className="font-medium text-primary">
                              {formatCurrency(os.valor_final)}
                            </span>
                          )}
                        </div>
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

      {/* Modal de detalhes */}
      {detailModalOpen && selectedOS && (
        <OSDetailModal
          os={selectedOS}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedOS(null);
          }}
        />
      )}
    </div>
  );
}
