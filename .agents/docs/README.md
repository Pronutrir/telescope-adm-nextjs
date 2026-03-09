# 📚 Documentação para Agentes de IA - Telescope ADM

Este diretório contém toda a documentação necessária para agentes de IA (GitHub Copilot, Claude, etc.) trabalharem efetivamente no projeto **Telescope ADM**.

## 📋 Índice de Documentos

### 1. [INSTRUCTIONS.md](./INSTRUCTIONS.md)
**Instruções de Codificação e Padrões**

Leia este documento primeiro para entender:
- 🎨 Design System (cores, fontes, estilos)
- 🏗️ Princípios fundamentais (Clean Code, componentização)
- 📁 Estrutura obrigatória de pastas
- ⚡ Server vs Client Components
- 🔄 Server Actions
- 🧩 Padrão de componente
- 📡 Data Fetching
- 🛡️ Error Handling
- ♿ Acessibilidade
- 🎨 Tailwind - Boas práticas
- 🧪 Testes unitários
- 🔑 TypeScript - Padrões
- ✅ Checklist de qualidade
- 🚫 Restrições

**Quando usar:** Sempre antes de criar ou modificar qualquer código.

---

### 2. [CONTEXT.md](./CONTEXT.md)
**Contexto Completo da Arquitetura**

Documentação detalhada sobre:
- 🏗️ Stack tecnológica completa
- 📁 Estrutura completa do projeto (todos os diretórios e arquivos)
- 🔑 Contextos principais (ThemeContext, LayoutContext, AuthContext)
- 🧩 Anatomia de um componente
- 📡 Camada de serviços
- 🌐 Variáveis de ambiente
- 🔄 Fluxo de dados
- 🔐 Fluxo de autenticação / token
- 🧪 Configuração de testes
- 📏 Convenções
- 🚀 Comandos do projeto

**Quando usar:** Para entender a arquitetura completa, localizar arquivos, entender fluxos de dados e autenticação.

---

### 3. [WORKFLOWS.md](./WORKFLOWS.md)
**Workflows Práticos**

Guias passo a passo para tarefas comuns:
- ➕ Criar novo componente
- 🔌 Criar Server Action
- 📡 Criar serviço de API
- 🔄 Data Fetching com React Query
- 🛣️ Criar nova rota (App Router)
- ♻️ Refatorar componente legado
- 🐛 Corrigir bug
- 🧪 Executar testes
- 💡 Prompts recomendados

**Quando usar:** Quando precisar executar uma tarefa específica e quiser seguir o padrão do projeto.

---

## 🎯 Como Usar Esta Documentação

### Para Agentes de IA (Copilot, Claude, etc.)

**Ordem de leitura recomendada:**

1. **Antes de qualquer tarefa:** Leia `INSTRUCTIONS.md` para entender os padrões básicos
2. **Para entender o projeto:** Leia `CONTEXT.md` para conhecer a arquitetura
3. **Para executar tarefas:** Use `WORKFLOWS.md` como guia passo a passo

### Para Desenvolvedores

**Referências rápidas:**

```bash
# Ver instruções de codificação
cat .agents/docs/INSTRUCTIONS.md

# Ver contexto da arquitetura
cat .agents/docs/CONTEXT.md

# Ver workflows práticos
cat .agents/docs/WORKFLOWS.md
```

---

## 📂 Estrutura deste Diretório

```
.agents/
├── docs/
│   ├── README.md         ← Você está aqui (índice principal)
│   ├── INSTRUCTIONS.md   ← Instruções de codificação e padrões
│   ├── CONTEXT.md        ← Contexto completo da arquitetura
│   └── WORKFLOWS.md      ← Workflows práticos passo a passo
└── skills/               ← Skills customizados para agentes
```

---

## 🔗 Referências Cruzadas

### INSTRUCTIONS.md referencia:
- `CONTEXT.md` - Para arquitetura completa
- `WORKFLOWS.md` - Para workflows práticos

### WORKFLOWS.md referencia:
- `CONTEXT.md` - Para arquitetura completa

### CONTEXT.md referencia:
- `WORKFLOWS.md` - Para workflows práticos

---

## 📖 Como Manter Atualizado

Ao fazer alterações significativas no projeto, atualize:

- **INSTRUCTIONS.md** - Se mudar padrões de código, design system, ou regras
- **CONTEXT.md** - Se alterar arquitetura, adicionar contextos, ou mudar fluxos
- **WORKFLOWS.md** - Se criar novos workflows ou atualizar processos

---

## 🚀 Início Rápido para Agentes

Se você é um agente de IA trabalhando neste projeto pela primeira vez:

1. ✅ Leia `INSTRUCTIONS.md` (essencial)
2. ✅ Consulte `CONTEXT.md` quando precisar entender onde algo está
3. ✅ Use `WORKFLOWS.md` como checklist para tarefas comuns

**Lembre-se:** Estes documentos são sua fonte de verdade para padrões e convenções do projeto Telescope ADM.
