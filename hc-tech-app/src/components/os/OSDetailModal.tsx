import { useState } from 'react';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';import { X, Wrench, User, Phone, Calendar, DollarSign, Send, Mail, CheckCircle } from 'lucide-react';

interface OSDetailModalProps {
  os: any;
  onClose: () => void;
}

type StatusType = 'aguardando' | 'em_andamento' | 'concluido' | 'entregue';

const statusConfig: Record<StatusType, { label: string; color: string }> = {
  aguardando: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800 border-green-300' },
  entregue: { label: 'Entregue', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

export function OSDetailModal({ os, onClose }: OSDetailModalProps) {
  const [whatsappSent, setWhatsappSent] = useState(false);

  const sendWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá, sou da HC Tech Infocell.\n\n*ORDEM DE SERVIÇO #${os.numero.replace('OS-', '')}*\n\n` +
      `Cliente: ${os.cliente_nome}\n` +
      `Telefone: ${os.cliente_telefone || 'N/A'}\n` +
      `Aparelho: ${os.equipamento || 'N/A'} ${os.marca ? '• ' + os.marca : ''} ${os.modelo ? os.modelo : ''}\n` +
      `Defeito relatado: ${os.defeito}\n` +
      `Status: ${statusConfig[os.status as keyof typeof statusConfig].label}\n` +
      `Valor: ${formatCurrency(os.valor_final || 0)}\n\n` +
      `Se precisar de mais informações, entre em contato!\n\n` +
      `HC Tech Infocell\n📍 São Bernardo do Campo - SP\n📞 (11) 97793-4634`
    );
    
    window.open(`https://wa.me/5511977934634?text=${message}`, '_blank');
    setWhatsappSent(true);
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`OS #${os.numero.replace('OS-', '')} - ${os.cliente_nome}`);
    const body = encodeURIComponent(
      `Olá ${os.cliente_nome},\n\n` +
      `Segue os detalhes da sua Ordem de Serviço #${os.numero.replace('OS-', '')}.\n\n` +
      `Aparelho: ${os.equipamento || 'N/A'} ${os.marca ? os.marca + ' ' : ''}${os.modelo || ''}\n` +
      `Defeito: ${os.defeito}\n` +
      `Status: ${statusConfig[os.status as keyof typeof statusConfig].label}\n` +
      `Valor: ${formatCurrency(os.valor_final || 0)}\n\n` +
      `Atenciosamente,\nHC Tech Infocell`
    );
    
    window.location.href = `mailto:${os.cliente_email || 'contato@hctech.com.br'}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Wrench size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Ordem de Serviço</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{os.numero}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Status badge */}
          <div className="flex justify-center">
            <Badge className={`${statusConfig[os.status as keyof typeof statusConfig].color} border px-3 py-1 text-sm`}>
              {statusConfig[os.status as keyof typeof statusConfig].label}
            </Badge>
          </div>

          {/* Informações do cliente */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Cliente
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-400" />
                <span className="font-medium">{os.cliente_nome}</span>
              </div>
              {os.cliente_telefone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span>{os.cliente_telefone}</span>
                </div>
              )}
              {os.cliente_email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm">{os.cliente_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Equipamento */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Equipamento
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Tipo</p>
                <p className="font-medium">{os.equipamento || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Marca</p>
                <p className="font-medium">{os.marca || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Modelo</p>
                <p className="font-medium">{os.modelo || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Defeito e Serviço */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Defeito Relatado</p>
              <p className="font-medium">{os.defeito}</p>
            </div>
            {os.servico_solicitado && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Serviço Solicitado</p>
                <p className="font-medium">{os.servico_solicitado}</p>
              </div>
            )}
          </div>

          {/* Financeiro */}
          {os.valor_final !== undefined && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <DollarSign size={14} />
                Valor do Serviço
              </h3>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(os.valor_final)}
              </p>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span>Entrada: {formatDateTime(os.data_entrada)}</span>
            </div>
            {os.data_saida && (
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-success" />
                <span>Saída: {formatDateTime(os.data_saida)}</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={sendWhatsApp}
            >
              <Send size={16} className="mr-2" />
              {whatsappSent ? 'Enviado!' : 'WhatsApp'}
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={sendEmail}
            >
              <Mail size={16} className="mr-2" />
              E-mail
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
