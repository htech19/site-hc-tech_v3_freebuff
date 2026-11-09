import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Package, Search, Plus, Edit, Trash2, RefreshCw, X, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface Produto {
  id: string;
  nome: string;
  categoria?: string;
  descricao?: string;
  custo: number;
  preco_venda: number;
  quantidade: number;
  unidade: string;
}

const categorias = ['Peças', 'Acessórios', 'Componentes', 'Miscelâneos'];

export function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const loadProdutos = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProdutos([
        { id: '1', nome: 'Tela Samsung M54', categoria: 'Peças', custo: 180, preco_venda: 280, quantidade: 5, unidade: 'un' },
        { id: '2', nome: 'Bateria iPhone 13', categoria: 'Peças', custo: 90, preco_venda: 150, quantidade: 3, unidade: 'un' },
        { id: '3', nome: 'Vidro Protetor Universal', categoria: 'Acessórios', custo: 15, preco_venda: 45, quantidade: 50, unidade: 'un' },
        { id: '4', nome: 'Conector USB-C', categoria: 'Componentes', custo: 25, preco_venda: 60, quantidade: 12, unidade: 'un' },
        { id: '5', nome: 'Filmes de Limpeza', categoria: 'Acessórios', custo: 5, preco_venda: 20, quantidade: 100, unidade: 'un' },
        { id: '6', nome: 'Painel LCD Dell 15"', categoria: 'Componentes', custo: 320, preco_venda: 450, quantidade: 2, unidade: 'un' },
        { id: '7', nome: 'Teclado Gamer', categoria: 'Acessórios', custo: 80, preco_venda: 150, quantidade: 4, unidade: 'un' },
        { id: '8', nome: 'Mouse Wireless', categoria: 'Acessórios', custo: 35, preco_venda: 80, quantidade: 8, unidade: 'un' },
      ]);
      setLoading(false);
    };
    
    loadProdutos();
  }, []);

  const filteredProdutos = produtos.filter(prod => {
    const matchesSearch = prod.nome.toLowerCase().includes(search.toLowerCase()) ||
                         prod.categoria?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoriaFilter === 'all' || prod.categoria === categoriaFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = produtos.reduce((sum, p) => sum + (p.custo * p.quantidade), 0);
  const totalItems = produtos.reduce((sum, p) => sum + p.quantidade, 0);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAllFiltered = () => {
    const allFilteredIds = new Set(filteredProdutos.map(p => p.id));
    setSelectedItems(allFilteredIds);
  };

  const handleBulkCategoryChange = (newCategory: string) => {
    setProdutos(prev => prev.map(p => 
      selectedItems.has(p.id) ? { ...p, categoria: newCategory } : p
    ));
    setShowBulkActions(false);
    setSelectedItems(new Set());
  };

  const handleBulkPriceAdjust = (percent: number) => {
    setProdutos(prev => prev.map(p => {
      if (selectedItems.has(p.id)) {
        const newPrice = p.preco_venda * (1 + percent / 100);
        return { ...p, preco_venda: Math.round(newPrice * 100) / 100 };
      }
      return p;
    }));
    setShowBulkActions(false);
    setSelectedItems(new Set());
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estoque</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {totalItems} itens • valor total: {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkActions(true)} disabled={selectedItems.size === 0}>
            {selectedItems.size > 0 ? `${selectedItems.size} selecionados` : 'Selecionar'}
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} className="mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Package size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{produtos.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Produtos cadastrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <RefreshCw size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Itens em estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valor total do estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
        >
          <option value="all">Todas as categorias</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredProdutos.length && filteredProdutos.length > 0}
                      onChange={selectAllFiltered}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"> produto </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"> Categoria </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"> Qtd </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"> Custo </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"> Preço Venda </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"> Lucro Unit. </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"> Ações </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProdutos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filteredProdutos.map(prod => {
                    const selected = selectedItems.has(prod.id);
                    const preco = prod.preco_venda || 0;
                    const custo = prod.custo || 0;
                    const profit = Number(preco) - Number(custo);
                    const profitMargin = Number(preco) > 0 ? ((profit / Number(preco)) * 100).toFixed(1) : 0;
                    
                    return (
                      <tr
                        key={prod.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                          selected ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect(prod.id)}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${
                              prod.quantidade <= 3 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : prod.quantidade <= 10
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                  : 'bg-green-100 dark:bg-green-dark:bg-green-900/30'
                            } flex items-center justify-center`}>
                              {prod.quantidade <= 3 ? (
                                <AlertCircle size={16} />
                              ) : (
                                <Package size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{prod.nome}</p>
                              {prod.descricao && (
                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{prod.descricao}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={prod.categoria || ''}
                            onChange={(e) => setProdutos(prev => prev.map(p => 
                              p.id === prod.id ? { ...p, categoria: e.target.value } : p
                            ))}
                            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 py-1"
                          >
                            <option value="">Sem categoria</option>
                            {categorias.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge className={
                            prod.quantidade <= 3 ? 'bg-red-100 text-red-800' :
                            prod.quantidade <= 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {prod.quantidade} {prod.unidade}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {formatCurrency(prod.custo)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-medium text-primary">
                          {formatCurrency(prod.preco_venda)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm ${
                            Number(profitMargin) >= 30 ? 'text-success' :
                            Number(profitMargin) >= 15 ? 'text-warning' :
                            'text-danger'
                          }`}>
                            {formatCurrency(profit)} ({profitMargin}%)
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:bg-danger/10">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Adicionar Produto */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <Card className="relative w-full max-w-lg animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package size={18} />
                  Novo Produto
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
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                  <Input placeholder="Ex: Tela Samsung M54" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background outline-none">
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidade</label>
                  <Input value="un" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custo (R$)</label>
                  <Input type="number" placeholder="0,00" step="0.01" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço de Venda (R$)</label>
                  <Input type="number" placeholder="0,00" step="0.01" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade</label>
                  <Input type="number" placeholder="0" min="0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                <Button onClick={() => setShowAddModal(false)}>Adicionar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ações em Massa */}
      {showBulkActions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBulkActions(false)} />
          <Card className="relative w-full max-w-md animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search size={18} />
                Ações em Massa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedItems.size} produto(s) selecionado(s)
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alterar Categoria</label>
                <div className="flex gap-2">
                  {categorias.map(cat => (
                    <Button
                      key={cat}
                      variant={categoriaFilter === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleBulkCategoryChange(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ajustar Preço em %</label>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleBulkPriceAdjust(-10)}>-10%</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkPriceAdjust(-5)}>-5%</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkPriceAdjust(0)}>Sem alteração</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkPriceAdjust(5)}>+5%</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkPriceAdjust(10)}>+10%</Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button variant="destructive" onClick={() => {
                  setShowBulkActions(false);
                  setSelectedItems(new Set());
                }}>
                  <Trash2 size={16} className="mr-2" />
                  Excluir Selecionados
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function DollarSign({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
