# 📐 Design System - Telescope ADM

Este diretório contém a documentação completa do design system do **Telescope ADM**.

## 📂 Estrutura

```
design-system/
└── telescope-adm/
    ├── MASTER.md          ← Documento principal (leia primeiro)
    └── pages/             ← Overrides específicos por página
        └── [nome-pagina].md
```

## 📖 Como Usar

### 1. Para Designers e Desenvolvedores

**Leia o arquivo principal:**
```bash
cat design-system/telescope-adm/MASTER.md
```

Este arquivo contém:
- 🎨 Paleta de cores completa (dark mode OLED)
- 🔤 Tipografia (fonte Inter, escalas)
- 📐 Espaçamento (sistema 8-point)
- 🎭 Componentes (botões, cards, inputs, etc.)
- 🎬 Animações e transições
- 🌈 Efeitos e sombras
- ♿ Acessibilidade
- 📱 Responsividade
- 🎯 Ícones (Lucide React)
- ✅ Checklist de qualidade

### 2. Overrides por Página (opcional)

Se uma página específica tem estilos que **divergem** do MASTER, crie um arquivo de override:

```
design-system/telescope-adm/pages/nome-da-pagina.md
```

**Quando criar um override:**
- Página usa paleta de cores diferente
- Componentes específicos daquela página
- Regras de layout exclusivas

**Exemplo:** `pages/nps-consultas.md` pode definir cores específicas para badges de classificação NPS.

### 3. Hierarquia de Estilos

```
MASTER.md (base)
   ↓
[Override específico] (sobrescreve parcialmente)
   ↓
Componente final
```

**Regra:** O override **não substitui** o MASTER, apenas adiciona ou modifica pontos específicos. Todo o resto vem do MASTER.

## 🎯 Para Agentes de IA

**Antes de criar ou modificar qualquer componente UI:**

1. ✅ Leia `design-system/telescope-adm/MASTER.md`
2. ✅ Verifique se existe override em `design-system/telescope-adm/pages/[nome-da-pagina].md`
3. ✅ Aplique as regras de:
   - Cores (dark mode OLED + cyan para ações)
   - Tipografia (Inter + escalas definidas)
   - Espaçamento (sistema 8-point)
   - Acessibilidade (contraste 4.5:1, foco visível)
   - Ícones (apenas Lucide React, sem emojis)

## 📝 Convenções

### Nomenclatura de Overrides
```
nome-da-pasta-no-app/
  ↓
design-system/telescope-adm/pages/nome-da-pasta.md

Exemplos:
src/app/admin/nps/         → pages/nps.md
src/app/admin/dashboard/   → pages/dashboard.md
src/app/admin/profile/     → pages/profile.md
```

### Estrutura de Override (template)
```markdown
# [Nome da Página] - Design Overrides

> Este documento sobrescreve parcialmente `MASTER.md` para a página [nome].

## Cores Específicas
[...]

## Componentes Exclusivos
[...]

## Regras de Layout
[...]
```

## 🔗 Integração

### No Código
```tsx
// Sempre use:
import { cn } from '@/lib/utils'  // Combinar classes
import { useTheme } from '@/contexts/ThemeContext'  // Dark mode
```

### Nas Instruções
Os arquivos em `.agents/docs/` já referenciam este design system:

- `.agents/docs/INSTRUCTIONS.md` - aponta para `design-system/telescope-adm/MASTER.md`
- `.agents/docs/CONTEXT.md` - menciona estrutura de design system

## 🚀 Atualizações

**Ao adicionar novas cores, componentes ou padrões:**

1. Atualize `MASTER.md` primeiro
2. Se for específico de uma página, crie/atualize o override em `pages/`
3. Documente no changelog do MASTER
4. Notifique a equipe

## 📚 Referências Rápidas

| Preciso de... | Arquivo |
|--------------|---------|
| Cores do dark mode | `MASTER.md` → Paleta de Cores → Dark Mode OLED |
| Tamanhos de fonte | `MASTER.md` → Tipografia → Escala Tipográfica |
| Espaçamento entre elementos | `MASTER.md` → Espaçamento |
| Estilo de botões | `MASTER.md` → Componentes → Botões |
| Regras de acessibilidade | `MASTER.md` → Acessibilidade |
| Breakpoints | `MASTER.md` → Responsividade |

---

**Versão:** 1.0.0
**Última Atualização:** 2026-03-09
**Mantido por:** Equipe Telescope ADM
