---
mode: 'agent'
description: 'Criar novo componente seguindo todos os padrões do Telescope ADM'
---

Leia obrigatoriamente os arquivos #AGENT-CONTEXT.md e #AGENT-WORKFLOWS.md antes de qualquer ação.

Crie um componente chamado **${input:NomeComponente:ex: UserCard}** com a seguinte finalidade: **${input:Descricao:ex: exibir informações do usuário}**

### Regras obrigatórias:
- Criar em `src/components/ui/${input:NomeComponente}/`
- Arquivos: `index.ts`, `${input:NomeComponente}.tsx`, `${input:NomeComponente}.test.tsx`, `use${input:NomeComponente}.ts`
- Usar `useTheme()` e `useLayout()` no componente
- Lógica separada no hook `use${input:NomeComponente}.ts`
- TypeScript com interface `${input:NomeComponente}Props`
- Tailwind CSS com `cn()` para condicionais
- Suporte completo dark/light mode
- Acessibilidade: `aria-label`, `role` quando necessário
- Arquivo < 150 linhas
- Registrar export em `src/components/ui/index.ts`
- Criar testes com mocks de `useTheme` e `useLayout`
