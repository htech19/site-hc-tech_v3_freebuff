import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

import { formatCurrency, maskPhone, calculateBudget } from '../../lib/utils';
import { ArrowLeft, ArrowRight, Check, Calculator, User, Smartphone, FileText, DollarSign, Percent } from 'lucide-react';

const equipamentCategories = [
  { value: 'celular', label: 'Celular' },
  { value: 'notebook', label: 'Notebook' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'outro', label: 'Outro' },
];

const servicesByCategory: Record<string, any[]> = {
  celular: [
    { id: '1', nome: 'Troca de Tela Completa', preco_padrao: 350 },
    { id: '2', nome: 'Troca de Vidro', preco_padrao: 150 },
    { id: '3', nome: 'Troca de Bateria', preco_padrao: 100 },
    { id: '4', nome: 'Troca de Câmera', preco_padrao: 120 },
    { id: '5', nome: 'Formatação de Software', preco_padrao: 80 },
    { id: '6', nome: 'Troca de Conector de Carregamento', preco_padrao: 60 },
    { id: '7', nome: 'Reballing', preco_padrao: 200 },
    { id: '8', nome: 'Limpeza Completa', preco_padrao: 50 },
    { id: '9', nome: 'Oxidação e Proteção', preco_padrao: 70 },
  ],
  notebook: [
    { id: '10', nome: 'Troca de Vidro (Notebook)', preco_padrao: 180 },
    { id: '11', nome: 'Troca de Tela (Notebook)', preco_padrao: 250 },
    { id: '12', nome: 'Troca de Motherboard', preco_padrao: 0 },
    { id: '13', nome: 'Troca de Bateria (Notebook)', preco_padrao: 120 },
    { id: '14', nome: 'Troca de Teclado/Mouse', preco_padrao: 80 },
    { id: '15', nome: 'Limpeza de Notebook', preco_padrao: 60 },
  ],
  desktop: [],
  outro: [],
};

export function OrcamentoNewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Etapa 1 - Cliente
    cliente_nome: '',
    cliente_email: '',
    cliente_telefone: '',
    // Etapa 2 - Equipamento
    equipamento: '',
    marca: '',
    modelo: '',
    servico: '',
    // Etapa 3 - Detalhes
    defeito: '',
    data_solicitacao: new Date().toISOString().split('T')[0],
    // Etapa 4 - Financeiro
    custo_pecas: 0,
    frete: 0,
    outros_custos: 0,
    valor_venda_pecas: 0,
    mao_de_obra: 0,
    desconto: 0,
    garantia: 30,
  });

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedService = servicesByCategory[formData.equipamento]?.find(s => s.id === formData.servico);



  const financialSummary = calculateBudget(
    formData.custo_pecas,
    formData.frete,
    formData.outros_custos,
    formData.valor_venda_pecas,
    formData.mao_de_obra,
    formData.desconto
  );

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/orcamentos');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/orcamentos')} className="-ml-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Novo Orçamento</h1>
          <p className="text-gray-500 dark:text-gray-400">Wizard de 4 etapas</p>
        </div>
      </div>

      {/* Progresso */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { num: 1, label: 'Cliente' },
          { num: 2, label: 'Equipamento' },
          { num: 3, label: 'Detalhes' },
          { num: 4, label: 'Financeiro' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s.num 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`text-sm ${step >= s.num ? 'text-primary font-medium' : 'text-gray-400'}`}>
              {s.label}
            </span>
            {s.num < 4 && (
              <div className={`h-0.5 flex-1 ${step > s.num ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* ETAPA 1 - Cliente */}
            {step === 1 && (
              <div className="animate-fade-in space-y-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User size={18} />
                    Dados do Cliente
                  </CardTitle>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do Cliente (ou nome decontacto)
                    </label>
                    <Input
                      value={formData.cliente_nome}
                      onChange={(e) => updateField('cliente_nome', e.target.value)}
                      placeholder="Ex: Harrison ou Cliente Avulso"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={formData.cliente_email}
                      onChange={(e) => updateField('cliente_email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">(11)</span>
                      <Input
                        value={formData.cliente_telefone}
                        onChange={(e) => updateField('cliente_telefone', maskPhone(e.target.value.replace(/\D/g, '').replace(/^11/, '')))}
                        placeholder="94056-2933"
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Você pode buscar um cliente cadastrado no sistema ou criar um contato avulso.
                  </p>
                </div>
              </div>
            )}

            {/* ETAPA 2 - Equipamento */}
            {step === 2 && (
              <div className="animate-fade-in space-y-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone size={18} />
                    Equipamento
                  </CardTitle>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Equipamento *
                    </label>
                    <select
                      value={formData.equipamento}
                      onChange={(e) => {
                        updateField('equipamento', e.target.value);
                        updateField('servico', '');
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    >
                      <option value="">Selecione...</option>
                      {equipamentCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Marca
                    </label>
                    <Input
                      value={formData.marca}
                      onChange={(e) => updateField('marca', e.target.value)}
                      placeholder="Ex: Samsung"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Modelo
                    </label>
                    <Input
                      value={formData.modelo}
                      onChange={(e) => updateField('modelo', e.target.value)}
                      placeholder="Ex: M54 C/A"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Serviço *
                    </label>
                    <select
                      value={formData.servico}
                      onChange={(e) => updateField('servico', e.target.value)}
                      disabled={!formData.equipamento}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        !formData.equipamento 
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50' 
                          : 'border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary'
                      } outline-none`}
                    >
                      <option value="">Selecione o serviço...</option>
                      {servicesByCategory[formData.equipamento]?.map(svc => (
                        <option key={svc.id} value={svc.id}>
                          {svc.nome} - {svc.preco_padrao > 0 ? formatCurrency(svc.preco_padrao) : 'Sob consulta'}
                        </option>
                      )) || <option value="">Sem serviços disponíveis para esta categoria</option>}
                    </select>
                  </div>
                </div>

                {selectedService && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex items-center gap-3">
                    <FileText size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">{selectedService.nome}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Preço padrão: {selectedService.preco_padrao > 0 ? formatCurrency(selectedService.preco_padrao) : 'Sob consulta de peça'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 3 - Detalhes */}
            {step === 3 && (
              <div className="animate-fade-in space-y-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText size={18} />
                    Detalhes do Serviço
                  </CardTitle>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Defeito Relatado *
                    </label>
                    <textarea
                      value={formData.defeito}
                      onChange={(e) => updateField('defeito', e.target.value)}
                      placeholder="Descreva o problema em detalhes..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data da Solicitação
                      </label>
                      <Input
                        type="date"
                        value={formData.data_solicitacao}
                        onChange={(e) => updateField('data_solicitacao', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Garantia (dias)
                      </label>
                      <Input
                        type="number"
                        value={formData.garantia}
                        onChange={(e) => updateField('garantia', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 4 - Financeiro */}
            {step === 4 && (
              <div className="animate-fade-in space-y-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign size={18} />
                    Cálculo Financeiro
                  </CardTitle>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Custos</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Custo das Peças (R$)</label>
                        <Input
                          type="number"
                          value={formData.custo_pecas || ''}
                          onChange={(e) => updateField('custo_pecas', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Frete (R$)</label>
                        <Input
                          type="number"
                          value={formData.frete || ''}
                          onChange={(e) => updateField('frete', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Outros Custos (R$)</label>
                        <Input
                          type="number"
                          value={formData.outros_custos || ''}
                          onChange={(e) => updateField('outros_custos', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Venda</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Valor de Venda das Peças (R$)</label>
                        <Input
                          type="number"
                          value={formData.valor_venda_pecas || ''}
                          onChange={(e) => updateField('valor_venda_pecas', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Mão de Obra (R$)</label>
                        <Input
                          type="number"
                          value={formData.mao_de_obra || ''}
                          onChange={(e) => updateField('mao_de_obra', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Desconto (R$)</label>
                        <Input
                          type="number"
                          value={formData.desconto || ''}
                          onChange={(e) => updateField('desconto', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resultados */}
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <Calculator size={16} />
                    Resultados do Orçamento
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Custo total da operação</span>
                      <span className="font-medium">{formatCurrency(financialSummary.custoTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valor final do orçamento</span>
                      <span className="font-bold text-lg text-primary">{formatCurrency(financialSummary.valorFinal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lucro bruto estimado</span>
                      <span className="font-medium text-success">{formatCurrency(financialSummary.lucroBruto)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Percent size={14} />
                        Margem bruta estimada
                      </span>
                      <span className={`font-medium ${financialSummary.margemBruta >= 20 ? 'text-success' : 'text-warning'}`}>
                        {financialSummary.margemBruta.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nota */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong className="font-semibold">⚠️ Atenção:</strong> Serviços de "Troca de Tela" estão disponíveis apenas para celulares.
                    Para notebooks, utilize o preço padrão de R$ 50,00.
                  </p>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => navigate('/orcamentos') : prevStep}
                disabled={step === 1}
              >
                {step === 1 ? 'Cancelar' : 'Voltar'}
              </Button>
              
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Orçamento'}
                </Button>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
