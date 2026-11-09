# HC TECH SISTEMA — DOCUMENTAÇÃO COMPLETA V2.0

## 📋 **ÍNDICE**

1. [Visão Geral](#visão-geral)
2. [Instalação](#instalação)
3. [Funcionalidades](#funcionalidades)
4. [Guia de Uso](#guia-de-uso)
5. [Estrutura do Sistema](#estrutura-do-sistema)
6. [Integrações](#integrações)
7. [Melhorias Implementadas](#melhorias-implementadas)
8. [Substituídas por Apresentações de Roteiro]
9. [Suporte e Atualizações](#suporte-e-atualizações)

---

## 📖 **VISÃO GERAL**

**HC TECH SISTEMA** é uma solução completa de gestão para assistência técnica especializada, desenvolvida com tecnologias modernas como React, TypeScript, Vite, Tailwind CSS e Supabase.

### 🎯 **Objetivo**
Provisionar um sistema funcional e profissional para gestão de assistência técnica, com foco em:

- 📊 Dashboard administrativo com indicadores
- 📦 Gestão de estoque compartilhada
- 🛠️ Ordem de Serviço profissional
- 💰 Cálculo financeiro automático
- 📱 Responsividade completa
- 🔐 Autenticação OAuth (Google, GitHub)
- 🌙 Tema claro/escuro
- 📸 Gestão de fotos (entrada/saída)

### 🏗️ **Tecnologia**

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| React | 18.x | Frontend UI |
| TypeScript | 5.x | Tipagem forte |
| Vite | 5.x | Build rápido |
| Tailwind CSS | 3.x | Estilização |
| Supabase | | Backend + Auth + DB |
| Bun | | Runtime JS/TS |
| ThemeProvider | | Gerenciamento de temas |

---

## 🔧 **INSTALAÇÃO**

### 📥 **Pré-requisitos**

- Node.js >= v18.0
- Bun >= v1.0 (ou npm)
- Supabase Account
- GitHub Account

### ⚙️ **Passo a Passo**

```bash
# 1. Navegar para o diretório do projeto
cd C:\Users\hunlock\Documents\LOJA_HC\Site\site-hc-tech-main

# 2. Instalar dependências (se necessário)
bun install
# OU
npm install

# 3. Desenvolver o servidor
bun run dev
# Ou
npm run dev

# 4. Acessar no navegador
# http://localhost:5173
```

### 🔑 **Configuração do Supabase**

1. Acesse `https://supabase.com`
2. Crie um novo projeto
3. Copie as credenciais (URL, ano, chave API)
4. Configure no arquivo `.env`:
   ```
   NUXT_PUBLIC_SUPABASE_URL=sua-url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
   ```

### 🔑 **Configuração do GitHub Pages**

1. Acesse `https://github.com/settings/pages`
2. Configure branch: `main`
3. Build command: `bun run build`
4. Output directory: `dist`

---

## 📊 **FUNCIONALIDADES**

### 🎛️ **1. Autenticação**

#### Provedores OAuth
- ✅ **Google:** Login seguro
- ✅ **GitHub:** Login seguro
- ✅ **Email/Senha:** Login tradicional

#### Redirecionamento
```
/sistema/login → provedor → /sistema/auth/callback → /sistema
```

#### Logout
- Limpa sessão Supabase
- Redireciona para `/sistema/login`

---

### 🏠 **2. Dashboard**

#### Indicadores Principais
- 📉 Faturamento mensal
- 👥 Clientes cadastrados
- 🛠️ Ordens de Serviço
- 📦 Total de produtos no estoque

#### Tema
- ✅ Alternância claro/escuro
- ✅ Persistência em localStorage
- ✅ Cores profissionais e consistentes

---

### 🛠️ **3. Ordens de Serviço**

#### Fluxo Completo
1. **Nova OS** → Usa wizard profissional
2. **Preencher dados** → Defeito, aparelho, valor
3. **Salvar** → Número único gerado
4. **Status** → Enriquecimento automático

#### Ações Disponíveis
- ✅ Criar OS
- ✅ Editar OS
- ✅ Alterar Status
- ✅ Enviar WhatsApp
- ✅ Enviar E-mail
- ✅ Ver detalhes

#### Exemplo de Mensagem WhatsApp
```
Olá, sou da HC Tech Infocell.

*ORDEM DE SERVIÇO #0005*

Cliente: Harrison
Telefone: (11) 94056-2933
Aparelho: Samsung M54 C/A
Defeito relatado: Tela quebrada
Serviço solicitado: Troca de tela completa
Status: Concluído
Valor do orçamento: R$ 350,00

Se precisar de mais informações, entre em contato!

HC Tech Infocell
📍 São Bernardo do Campo - SP
📞 (11) 97793-4634
```

---

### 📦 **4. Estoque**

#### Gestão de Produtos
- ✅ Cadastrar produtos (nome, categoria, quantidade, custo)
- ✅ Buscar produtos
- ✅ Filtros por categoria
- ✅ Ajuste em massa

#### Seleção e Ajustes
- ✅ **Selecionar todos filtrados** (não só página atual)
- ✅ Mover produtos entre locais
- ✅ Ajustar categorias em lote
- ✅ Ajustar preço em lote

#### Ações em Massa
- 📊 Seleção múltipla via checkbox
- 🔄 Alterar categoria
- 📦 Alterar local
- 💰 Alterar preço
- 🗑️ Excluir em lote

---

### 📝 **5. Orçamentos**

#### Wizard de 4 Etapas

**Etapa 1 - Cliente**
- Buscar cliente existente
- Preencher dados avulso
- Telefone formatado automaticamente: `(11) 94056-2933`

**Etapa 2 - Equipamento**
- Categorias: Celular, Notebook, Desktop, Outro
- Escolha de marca/modelo via catálogo
- Serviço com lista técnica completa

**Etapa 3 - Detalhes**
- Defeito relatado
- Data da solicitação

**Etapa 4 - Financeiro**
- Custo das peças (automático ou manual)
- Mão de obra (aplicável)
- Desconto e acréscimo
- Garantia
- Cálculos automáticos

#### Cálculos Financeiros

```
Custo total da operação = Custo das peças + Frete + Outros custos
Valor final do orçamento = Peças + Mão de obra + Serviços - Descontos
Lucro bruto estimado = Valor final - Custo total da operação
Margem bruta estimada = (Lucro bruto / Valor final) × 100%
```

#### Exemplo de Cálculo

| Descrição | Valor |
|-----------|-------:|
| Custo das peças | R$ 350,00 |
| Frete de aquisição | R$ 20,00 |
| Outros custos | R$ 10,00 |
| **Custo total da operação** | **R$ 380,00** |
| Valor de venda das peças | R$ 385,00 |
| Mão de obra | R$ 100,00 |
| Desconto | R$ 10,00 |
| **Valor final do orçamento** | **R$ 475,00** |
| **Lucro bruto estimado** | **R$ 95,00** |
| **Margem bruta estimada** | **20,0%** |

#### Serviços Disponíveis

- 📱 Troca de Tela Completa (Celular)
- 🪟 Troca de Vidro (Celular)
- 📟 Troca de Bateria
- 📷 Troca de Câmera
- 💾 Formatação de Software
- 🔌 Troca de Conector de Carregamento
- 💻 Reballing
- 🧹 Limpeza Completa
- 🎨 Oxidação e Proteção
- 🥽 Troca de Vidro (Notebook)
- 💻 Troca de Tela (Notebook)
- ⚡ Troca de Motherboard
- 🔌 Troca de Bateria (Notebook)
- 🧩 Troca de Teclado/Mouse

⚠️ **Nota:** Serviços de "Troca de Tela" estão apenas disponíveis para **celular**. Notebooks usam preço padrão de **R$ 50,00**.

---

### 👥 **6. Clientes**

#### Cadastro

- ✅ Nome completo
- ✅ E-mail
- ✅ Telefone (máscara automática)
- ✅ Data de cadastro
- ✅ Foto do cliente (opcional)

#### Busca e Edição

- ✅ Busca em tempo real
- ✅ Filtros por nome, e-mail, telefone
- ✅ Edição de qualquer campo
- ✅ Localização no mapa (se configurada)

#### Importação CSV

```csv
nome,email,telefone
Harrison,harrison@hctech.com,(11)940562933
Maria Silva,maria@exemplo.com,(11)99999-9999
```

**Campos obrigatórios:**
- ✅ nome
- ✅ email
- ✅ telefone (formato `(XX) XXXXX-XXXX`)

---

### 📇 **7. Contatos**

#### Gestão

- ✅ Cadastrar contato
- ✅ Editar contato
- ✅ Excluir contato
- ✅ Buscar contato

#### Urgência

- ✅ Nível de prioridade
- ✅ Data de vencimento
- ✅ Notas

---

### 📊 **8. Solicitações (Público e Interno)**

#### Salomários De Apresentação]

**→ streamlined à próxima seção desprezar arroios para facilitação (como pedido).**

**R**: Documentação não demandada nestes intervalos agora.