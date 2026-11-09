export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'chamado' | 'tecnico' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoria_id?: string;
  descricao?: string;
  custo: number;
  preco_venda: number;
  quantidade: number;
  unidade: string;
  created_at: string;
  updated_at: string;
}

export type OSStatusType = 'aguardando' | 'em_andamento' | 'concluido' | 'entregue';

export interface OSStatus {
  id: string;
  nome: string;
  cor: string;
  created_at: string;
}

export interface OS {
  id: string;
  numero: string;
  cliente_id?: string;
  cliente?: Cliente;
  status_id?: string;
  status?: OSStatus;
  equipamento?: string;
  marca?: string;
  modelo?: string;
  defeito: string;
  servico_solicitado?: string;
  tecnico_id?: string;
  tecnico?: Profile;
  observacoes?: string;
  data_entrada: string;
  data_saida?: string;
  valor_orcamento?: number;
  valor_final?: number;
  desconto?: number;
  created_at: string;
  updated_at: string;
  itens?: OSItem[];
}

export interface OSItem {
  id: string;
  os_id: string;
  produto_id?: string;
  nome: string;
  quantidade: number;
  custo: number;
}

export interface Orcamento {
  id: string;
  numero: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  equipamento?: string;
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

export interface Contato {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  prioridade: 'normal' | 'alta' | 'urgente';
  data_vencimento?: string;
  notas?: string;
  created_at: string;
}

export interface ServiceItem {
  id: string;
  nome: string;
  categoria: 'celular' | 'notebook' | 'desktop' | 'outro';
  preco_padrao?: number;
  descricao?: string;
}

export const SERVICOS_PADRAO: ServiceItem[] = [
  { id: '1', nome: 'Troca de Tela Completa', categoria: 'celular', preco_padrao: 350, descricao: 'Troca completa da tela do celular' },
  { id: '2', nome: 'Troca de Vidro', categoria: 'celular', preco_padrao: 150, descricao: 'Troca do vidro protetor da tela' },
  { id: '3', nome: 'Troca de Bateria', categoria: 'celular', preco_padrao: 100, descricao: 'Substituição da bateria' },
  { id: '4', nome: 'Troca de Câmera', categoria: 'celular', preco_padrao: 120, descricao: 'Substituição da câmera' },
  { id: '5', nome: 'Formatação de Software', categoria: 'celular', preco_padrao: 80, descricao: 'Limpeza e formatação do sistema' },
  { id: '6', nome: 'Troca de Conector de Carregamento', categoria: 'celular', preco_padrao: 60, descricao: 'Substituição do conector USB' },
  { id: '7', nome: 'Reballing', categoria: 'celular', preco_padrao: 200, descricao: 'Reparo de conexões da placa' },
  { id: '8', nome: 'Limpeza Completa', categoria: 'celular', preco_padrao: 50, descricao: 'Limpeza interna e externa' },
  { id: '9', nome: 'Oxidação e Proteção', categoria: 'celular', preco_padrao: 70, descricao: 'Tratamento contra oxidação' },
  { id: '10', nome: 'Troca de Vidro (Notebook)', categoria: 'notebook', preco_padrao: 180, descricao: 'Troca do painel de vidro' },
  { id: '11', nome: 'Troca de Tela (Notebook)', categoria: 'notebook', preco_padrao: 250, descricao: 'Substituição da tela LCD/OLED' },
  { id: '12', nome: 'Troca de Motherboard', categoria: 'notebook', preco_padrao: 0, descricao: 'Substituição da placa mãe (custo da peça)' },
  { id: '13', nome: 'Troca de Bateria (Notebook)', categoria: 'notebook', preco_padrao: 120, descricao: 'Substituição da bateria do notebook' },
  { id: '14', nome: 'Troca de Teclado/Mouse', categoria: 'notebook', preco_padrao: 80, descricao: 'Substituição de periféricos' },
  { id: '15', nome: 'Limpeza de Notebook', categoria: 'notebook', preco_padrao: 60, descricao: 'Limpeza interna do notebook' },
];
