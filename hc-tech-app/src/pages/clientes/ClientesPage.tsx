import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

import { Users, Search, Plus, Edit, Trash2, Mail, Phone, Download, Upload, X, Calendar } from 'lucide-react';
import { formatCurrency, formatPhone } from '../../lib/utils';

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
  created_at: string;
  total_os?: number;
  valor_total?: number;
}



export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const loadClientes = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClientes([
        {
          id: '1',
          nome: 'Harrison',
          email: 'harrison@hctech.com',
          telefone: '(11) 94056-2933',
          observacoes: 'Cliente preferencial',
          created_at: '2026-09-01T10:00:00Z',
          total_os: 5,
          valor_total: 1750,
        },
        {
          id: '2',
          nome: 'Maria Silva',
          email: 'maria@exemplo.com',
          telefone: '(11) 99999-9999',
          created_at: '2026-10-15T14:30:00Z',
          total_os: 2,
          valor_total: 800,
        },
        {
          id: '3',
          nome: 'João Pereira',
          telefone: '(11) 98888-7777',
          created_at: '2026-11-01T09:00:00Z',
          total_os: 1,
          valor_total: 280,
        },
        {
          id: '4',
          nome: 'Ana Costa',
          email: 'ana@email.com',
          telefone: '(11) 97766-5555',
          created_at: '2026-08-20T16:00:00Z',
          total_os: 3,
          valor_total: 1200,
        },
      ]);
      setLoading(false);
    };
    
    loadClientes();
  }, []);

  const filteredClientes = clientes.filter(client => 
    client.nome.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.telefone?.includes(search)
  );

  const exportCSV = () => {
    const headers = ['nome', 'email', 'telefone'];
    const rows = clientes.map(c => [
      `"${c.nome}"`,
      c.email ? `"${c.email}"` : '""',
      c.telefone || '""',
    ].join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_hctech_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
    const text = event.target?.result as string;
    const lines = text.split('\n').filter(line => line.trim());
    const newClients: Cliente[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const [nome, email, telefone] = lines[i].split(',').map(s => s.replace(/"/g, '').trim());
        if (nome) {
          newClients.push({
            id: `import-${Date.now()}-${i}`,
            nome,
            email: email || undefined,
            telefone: telefone || undefined,
            created_at: new Date().toISOString(),
          });
        }
      }
      
      setClientes(prev => [...newClients, ...prev]);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie clientes e contatos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download size={18} className="mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload size={18} className="mr-2" />
            Importar
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} className="mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{clientes.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total de clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{clientes.filter(c => c.telefone).length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Com telefone</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{clientes.filter(c => c.email).length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Com e-mail</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{clientes.filter(c => {
                  const d = new Date(c.created_at);
                  const now = new Date();
                  const diffMs = now.getTime() - d.getTime();
                  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  return diffDays <= 30;
                }).length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Novos (30 dias)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"> cliente </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell"> Contato </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell"> Total OS </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell"> Valor Total </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400 w-20"> Ações </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Nenhum cliente encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {client.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{client.nome}</p>
                            {client.observacoes && (
                              <div className="text-xs px-2 py-1 rounded-full border bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mt-1">
                                {client.observacoes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="space-y-1">
                          {client.telefone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone size={14} className="text-gray-400" />
                              <span>{formatPhone(client.telefone.replace(/\D/g, '').slice(0, 11))}</span>
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-primary">
                              <Mail size={14} />
                              <a href={`mailto:${client.email}`} className="hover:underline">
                                {client.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className="font-medium">{client.total_os || 0} OS</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="font-medium text-primary">
                          {formatCurrency(client.valor_total || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:bg-danger/10">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Adicionar */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <Card className="relative w-full max-w-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={18} />
                  Novo Cliente
                </CardTitle>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Completo *
                </label>
                <Input
                  placeholder="Ex: Harrison"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">(11)</span>
                  <Input
                    placeholder="94056-2933"
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Observações
                </label>
                <textarea
                  placeholder="Observações sobre o cliente..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                <Button onClick={() => setShowAddModal(false)}>Adicionar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Importar */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowImportModal(false)} />
          <Card className="relative w-full max-w-md animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload size={18} />
                Importar Clientes (CSV)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                O CSV deve ter as colunas: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">nome</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">email</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">telefone</code>
              </p>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Clique ou arraste um arquivo CSV aqui
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={importCSV}
                  className="hidden"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


