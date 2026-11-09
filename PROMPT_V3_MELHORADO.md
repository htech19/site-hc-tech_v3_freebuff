# PROMPT OTIMIZADO - Reescrita do Sistema HC TECH V3 com Geração de App Android

## 🎯 OBJETIVO PRINCIPAL
Atue como um **Engenheiro de Software Sênior** especialista em arquitetura fullstack e desenvolvimento mobile. Sua tarefa é **reescrever completo** o sistema da loja "HC TECH" (site-hc-tech_v3), partindo do sistema atual e criando uma versão nova, moderna e preparada para gerar **App Android** do módulo "Sistema".

---

## 📂 CONTEXTO DO PROJETO

### Repositório Atual (Referência)
- **URL:** https://github.com/htech19/site-hc-tech
- **Stack atual:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Estado:** Zustand + TanStack Query
- **Deploy:** Cloudflare Pages / Vercel

### Novo Projeto (Destino)
- **Caminho:** `C:\Users\hunlock\Documents\LOJA_HC\Site\site-hc-tech_v3`
- **Arquivo de especificação:** `HC TECH SISTEMA.MD` (já lido - contém a documentação completa do sistema atual)

---

## 📋 O QUE O SISTEMA ATUAL JÁ TEM (BASE PARA MIGRAÇÃO)

### Módulos Implementados:
1. **🔐 Autenticação** - OAuth (Google, GitHub) + Email/Senha
2. **🏠 Dashboard** - Faturamento, clientes, OS, estoque com tema claro/escuro
3. **🛠️ Ordens de Serviço (OS)** - CRUD completo, status, WhatsApp, e-mail
4. **📦 Estoque** - Gestão de produtos, categories, ajustes em massa
5. **💰 Orçamentos** - Wizard 4 etapas (Cliente → Equipamento → Detalhes → Financeiro)
6. **👥 Clientes** - CADASTRO completo, busca, importação CSV
7. **📇 Contatos** - Gestão com prioridade e vencimento

### Cálculos Financeiros Implementados:
```
Custo total = Peças + Frete + Outros custos
Valor final = Peças + Mão de obra + Serviços - Descontos
Lucro bruto = Valor final - Custo total
Margem bruta = (Lucro bruto / Valor final) × 100%
```

### Serviços Catalogados:
- Troca de Tela (Celular/Notebook)
- Troca de Vidro, Bateria, Câmera
- Formatação, Reballing, Limpeza
- Troca de Conector, Motherboard, Teclado
- Oxidação e Proteção

---

## 🚀 REQUISITOS PARA A VERSÃO V3

### 1. ARQUITETURA DO SISTEMA (Web)
- [ ] Reescrever todo o frontend com **codebase limpa e modular**
- [ ] Manter React + TypeScript + Vite + Tailwind CSS (ou migrar para Next.js se benefício claro)
- [ ] Organizar em **módulos claros**: Auth, Dashboard, OS, Orçamentos, Estoque, Clientes, Financeiro
- [ ] Implementar **보행** (types/interfaces em arquivo único ou well-organized)
- [ ] Melhorar UX/UI mantendo consistência profissional
- [ ] Dark mode nativo com persistência

### 2. NOVO BACKEND / BANCO DE DADOS
- [ ] Projeto novo no Supabase ou migração do existente
- [ ] Schema completo com **tabelas normalizadas**
- [ ] RLS (Row Level Security) configurado
- [ ] Storage para fotos de entradas/saídas
- [ ] Realtime para atualizações em tempo real

### 3. APP ANDROID (CRITICAL)
**O módulo "Sistema" deve ser transformável em App Android.**

Opções a avaliar e recomendar:
- **Opção A:** WebView wrapper com Capacitor/Cordova
- **Opção B:** React Native com código compartilhado
- **Opção C:** PWA com service workers + instalação nativa
- **Opção D:** Expo (React Native) compartilhando lógica com web

**Requisitos mínimos do App:**
- [ ] Funcional offline (cache/local storage)
- [ ] Notificações push para OS/Orçamentos
- [ ] Acesso a câmera para fotos de serviço
- [ ] Scrap access (se necessário)
- [ ] Build APK/AAB gerável

### 4. IMPROVEMENTS SOBRE O ATUAL
- [ ] Performance: lazy loading, code splitting
- [ ] PWA: manifest, service worker, offline
- [ ] Testes: unitários + integration (Vitest/Jest)
- [ ] CI/CD: GitHub Actions para deploy automático
- [ ] Log de auditoria para OS e orçamentos
- [ ] Relatórios exportáveis (PDF, CSV)
- [ ] API pública para integrações futuras (whatsapp, e-mail)

---

## 📁 ESTRUTURA DE ARQUIVOS SUGERIDA (V3)

```
site-hc-tech_v3/
├── public/
├── src/
│   ├── app/                    # Routes + layouts (React Router ou Next.js)
│   │   ├── (auth)/            # Login, register, callback
│   │   ├── (dashboard)/       # Dashboard protegido
│   │   ├── sistema/           # Módulo principal (OS, Orçamentos, etc)
│   │   ├── estoque/           # Módulo estoque
│   │   └── clientes/          # Módulo clientes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── sistema/          # Components específicos do sistema
│   │   ├── orcamento/        # Wizard, calculadoras
│   │   └── shared/           # Components reutilizáveis
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities, supabase client, helpers
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript interfaces
│   ├── styles/                # Global CSS, themes
│   └── config/                # Config files
├── supabase/
│   ├── migrations/            # SQL migrations
│   ├── seed.sql               # Dados iniciais
│   └── config.toml
├── android/                   # App Android (se opção B/D)
├── capacitor/                 # Se opção A
├── tests/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── HC_TECH_SISTEMA_V3.md      # Nova documentação
```

---

## 🎨 DIRETRIZES DE DESIGN

### Paleta de Cores HC TECH:
- **Primário:** Azul tecnológico (#1E3A8A ou similar)
- **Secundário:** Cinza escuro/preto para contrastes
- **Acentos:** Verde para sucesso, Vermelho para alertas
- **Dark mode:** Fundo escuro com texto claro

### Principios:
- Clean e profissional
- Mobile-first responsive
- Acessível (ARIA labels, contraste)
- Dark mode nativo

---

## ✅ ENTREGÁVEIS ESPERADOS

### Fase 1 - Planejamento (ENTREGÁVEL: documento markdown)
1. Análise completa do sistema atual vs. necessidades V3
2. Decisão de stack para app Android com justificativa
3. Novo schema do banco de dados (SQL ou diagrama)
4. Lista de melhorias prioritárias

### Fase 2 - Implementação (ENTREGÁVEIS: código fonte)
1. **Sistema Web V3 completo** rodando em `site-hc-tech_v3/`
2. **App Android** (APK gerável ou instruções claras)
3. Documentação atualizada (HC_TECH_SISTEMA_V3.md)

### Fase 3 - Otimização (ENTREGÁVEIS: melhorias)
1. PerformanceOtimizations
2. PWA configurado
3. Testes implementados
4. CI/CD configurado

---

## 🔧 REGRAS DE NEGÓCIO CRÍTICAS (MANTER/REFORMULAR)

### OS (Ordens de Serviço):
- Número único gerado automaticamente
- Status: Aguardando → Em Andamento → Concluído → Entregue
- WhatsApp com template profissional (exemplo no documento)
- E-mail de notificação

### Orçamentos:
- Wizard guiado passo a passo
- Cálculo automático de lucro/margem
- Serviços com preços configuráveis
- Descontos e acréscimos

### Estoque:
- Ajustes em massa (categoria, local, preço)
- Seleção multi-página
- Histórico de movimentações

### Clientes:
- Telefone com máscara: (11) 94056-2933
- Importação CSV
- Histórico de OS por cliente

---

## ⚠️ INSTRUÇÕES ESPECÍFICAS

1. **NÃO copie-paste** do sistema atual sem reescrever/melhorar
2. **Documente** decisões técnicas no código (comentários) e em markdown
3. **App Android** deve ser abordagem pragmática (WebView simples é aceitável se bem implementado)
4. **Offline-first** para o app é diferencial importante
5. Mantenha compatibilidade com dados existentes do Supabase (ou migre explicitamente)
6. **Segurança:** RLS, validações no frontend E backend

---

## 📞 CONTATO HC TECH
- **Nome:** HC Tech Infocell
- **Telefone:** (11) 97793-4634
- **Localização:** São Bernardo do Campo - SP
- **Site:** hctechinfocell.com.br

---

## 🤖 COMO RESPONDER A ESTE PROMPT

1. **Confirme** que leu e entendeu o repositório atual e a documentação
2. **Peça esclarecimentos** se algo estiver ambíguo (não assuma)
3. **Comece pela Fase 1** (planejamento) antes de codar
4. **Para App Android:** avalie 2-3 opções e recomende a melhor para o caso
5. **Entregue incrementalmente** - não espere ter tudo pronto para mostrar progresso
