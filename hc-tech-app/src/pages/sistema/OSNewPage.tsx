import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatCurrency, maskPhone } from '../../lib/utils';
import { ArrowLeft, ArrowRight, Check, Wrench, Phone } from 'lucide-react';

const statusOptions = [
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'entregue', label: 'Entregue' },
];

const equipamentTypes = [
  { value: 'celular', label: 'Celular' },
  { value: 'notebook', label: 'Notebook' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'outro', label: 'Outro' },
];

export function OSNewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dados da OS
  const [osData, setOsData] = useState({
    cliente_nome: '',
    cliente_email: '',
    cliente_telefone: '',
    equipamento: '',
    marca: '',
    modelo: '',
    defeito: '',
    servico_solicitado: '',
    status: 'aguardando' as any,
    valor_orcamento: 0,
    valor_final: 0,
    tecnico: '',
    observacoes: '',
  });

  const updateField = (field: string, value: string | number) => {
    setOsData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !osData.cliente_nome) {
      alert('Preencha o nome do cliente');
      return;
    }
    if (step === 2 && !osData.defeito) {
      alert('Descreva o defeito');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/os');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/os')} className="-ml-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nova Ordem de Serviço</h1>
          <p className="text-gray-500 dark:text-gray-400">Preencha os dados abaixo</p>
        </div>
      </div>

      {/* Progresso */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {step > s ? <Check size={16} /> : s}
            </div>
            <div className={`h-0.5 flex-1 ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* STEP 1: Cliente */}
            {step === 1 && (
              <div className="animate-fade-in space-y-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Dados do Cliente
                  </CardTitle>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome Completo *
                    </label>
                    <Input
                      value={osData.cliente_nome}
                      onChange={(e) => updateField('cliente_nome', e.target.value)}
                      placeholder="Ex: Harrison"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={osData.cliente_email}
                      onChange={(e) => updateField('cliente_email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        value={osData.cliente_telefone}
                        onChange={(e) => updateField('cliente_telefone', maskPhone(e.target.value))}
                        placeholder="(11) 94056-2933"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Equipamento e Defeito */}
            {step === 2 && (
              <div className="animate-fade-in space-y-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench size={18} />
                    Equipamento e Defeito
                  </CardTitle>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Equipamento *
                    </label>
                    <select
                      value={osData.equipamento}
                      onChange={(e) => updateField('equipamento', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    >
                      <option value="">Selecione...</option>
                      {equipamentTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Marca
                    </label>
                    <Input
                      value={osData.marca}
                      onChange={(e) => updateField('marca', e.target.value)}
                      placeholder="Ex: Samsung"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Modelo
                    </label>
                    <Input
                      value={osData.modelo}
                      onChange={(e) => updateField('modelo', e.target.value)}
                      placeholder="Ex: M54 C/A"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Defeito Relatado *
                    </label>
                    <textarea
                      value={osData.defeito}
                      onChange={(e) => updateField('defeito', e.target.value)}
                      placeholder="Descreva o problema em detalhes..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Serviço Solicitado
                    </label>
                    <Input
                      value={osData.servico_solicitado}
                      onChange={(e) => updateField('servico_solicitado', e.target.value)}
                      placeholder="Ex: Troca de tela completa"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Finalizar */}
            {step === 3 && (
              <div className="animate-fade-in space-y-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check size={18} />
                    Finalizar OS
                  </CardTitle>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={osData.status}
                      onChange={(e) => updateField('status', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    >
                      {statusOptions.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor Final (R$)
                    </label>
                    <Input
                      type="number"
                      value={osData.valor_final || ''}
                      onChange={(e) => updateField('valor_final', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Técnico Responsável
                    </label>
                    <Input
                      value={osData.tecnico}
                      onChange={(e) => updateField('tecnico', e.target.value)}
                      placeholder="Nome do técnico"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={osData.observacoes}
                      onChange={(e) => updateField('observacoes', e.target.value)}
                      placeholder="Observações adicionais..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Resumo */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Resumo</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Cliente</p>
                      <p className="font-medium">{osData.cliente_nome}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Equipamento</p>
                      <p className="font-medium">{osData.equipamento} {osData.marca && osData.marca + ' '}{osData.modelo}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Defeito</p>
                      <p className="font-medium">{osData.defeito}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Valor</p>
                      <p className="font-medium text-primary">{formatCurrency(osData.valor_final || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => navigate('/os') : prevStep}
                disabled={step === 1}
              >
                {step === 1 ? 'Cancelar' : 'Voltar'}
              </Button>
              
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar OS'}
                </Button>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
