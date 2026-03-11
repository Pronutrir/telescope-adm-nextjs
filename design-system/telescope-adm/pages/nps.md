# NPS Consultas - Design Overrides

> Este documento define estilos específicos para a página **NPS Consultas** que sobrescrevem ou complementam `MASTER.md`.

## 📋 Visão Geral

A página NPS Consultas (`src/app/admin/nps/consultas/`) utiliza o design system base do MASTER.md com algumas personalizações específicas para exibição de dados de pesquisa de satisfação.

---

## 🎨 Cores Específicas

### Classificações NPS

```css
/* Promotor (9-10) */
Promotor Background:     bg-green-500/20
Promotor Border:         border-green-500/30
Promotor Text:           text-green-300
Promotor Icon:           text-green-400

/* Neutro (7-8) */
Neutro Background:       bg-amber-500/20
Neutro Border:           border-amber-500/30
Neutro Text:             text-amber-300
Neutro Icon:             text-amber-400

/* Detrator (0-6) */
Detrator Background:     bg-red-500/20
Detrator Border:         border-red-500/30
Detrator Text:           text-red-300
Detrator Icon:           text-red-400
```

### Estados de Resposta

```css
/* Respondida */
Status Respondida:       bg-cyan-500/20 text-cyan-300 border-cyan-500/30

/* Pendente */
Status Pendente:         bg-amber-500/20 text-amber-300 border-amber-500/30

/* Não Respondida */
Status Não Respondida:   bg-slate-500/20 text-slate-300 border-slate-500/30
```

---

## 🧩 Componentes Exclusivos

### NpsCard (Compound Component)

Card de métrica NPS com ícone, total, e legenda.

```tsx
<NpsCard.Root>
  <NpsCard.Icon icon={ThumbsUp} color="text-green-400" />
  <NpsCard.TotalText>
    <span className="text-4xl font-bold">127</span>
    <span className="text-slate-400 ml-2">Promotores</span>
  </NpsCard.TotalText>
  <NpsCard.Legend>
    <span className="text-green-400">↑ 12%</span> vs. mês anterior
  </NpsCard.Legend>
</NpsCard.Root>
```

**Cores:**
- Root: `bg-[#1E293B] border-slate-700`
- Hover: `hover:border-cyan-500/50`

### NpsTable (Tabela Genérica NPS)

Tabela com paginação, ordenação e filtros.

```tsx
<NpsTable
  columns={columns}
  data={data}
  pagination={{ page: 1, pageSize: 10, total: 100 }}
  sorting={{ field: 'data', order: 'desc' }}
/>
```

**Cores:**
- Header: `bg-slate-700/50 text-slate-300`
- Row hover: `hover:bg-slate-700/30`
- Border: `border-slate-700`
- Footer: `bg-slate-800/50`

### NpsFilterMenu

Menu de filtros avançados com sub-menus (Unidade, Data, Classificação).

```tsx
<NpsFilterMenu
  filters={filters}
  onFilterChange={handleFilterChange}
/>
```

**Cores:**
- Button: `bg-cyan-500 hover:bg-cyan-600 text-white`
- Dropdown: `bg-[#1E293B] border-slate-700`
- Active filter: `bg-cyan-500/20 text-cyan-300`

### SubclassificationGrid

Grid de 13 ícones de subclassificação (atendimento, higiene, alimentação, etc.).

```tsx
<SubclassificationGrid
  selected={selected}
  onSelect={handleSelect}
/>
```

**Layout:**
- Grid: `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3`
- Item: `bg-slate-700/30 hover:bg-slate-700 border border-slate-600`
- Selected: `bg-cyan-500/20 border-cyan-500`

### DashboardCards

8 cards de métricas resumo (Total, Promotores, Neutros, Detratores, NPS, Taxa Resposta, etc.).

```tsx
<DashboardCards data={dashboardData} />
```

**Layout:**
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
- Card: `bg-[#1E293B] border-slate-700 p-6`

---

## 📐 Layout Específico

### Abas (Listagem / Dashboard)

```tsx
<AbasAnswers>
  <Tab id="listagem" />  {/* AnswersList */}
  <Tab id="dashboard" /> {/* AnswersDashboard */}
</AbasAnswers>
```

**Cores:**
- Tab ativa: `border-b-2 border-cyan-500 text-cyan-400`
- Tab inativa: `text-slate-400 hover:text-slate-300`

### Cards de Resumo (5 cards na aba Listagem)

```tsx
<AnswersListCards data={stats} />
```

**Ordem:**
1. Total de Respostas
2. Promotores
3. Neutros
4. Detratores
5. NPS Score

**Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`

---

## 🎯 Ícones Específicos

### Subclassificações (Lucide React)

| Subclassificação | Ícone | Cor |
|------------------|-------|-----|
| Atendimento | `UserCheck` | `text-cyan-400` |
| Higiene | `Droplet` | `text-blue-400` |
| Alimentação | `Utensils` | `text-green-400` |
| Bem-estar | `Heart` | `text-pink-400` |
| Segurança | `Shield` | `text-purple-400` |
| Comunicação | `MessageCircle` | `text-amber-400` |
| Equipe/Médica | `Users` | `text-indigo-400` |
| Equipe/Enfermagem | `Stethoscope` | `text-teal-400` |
| Instalações | `Building` | `text-slate-400` |
| Processos | `Settings` | `text-orange-400` |
| Preço | `DollarSign` | `text-yellow-400` |
| Tempo de espera | `Clock` | `text-red-400` |
| Outros | `MoreHorizontal` | `text-gray-400` |

---

## 🧪 Estados de Carregamento

### Skeleton Loading (Cards)

```tsx
className="animate-pulse bg-slate-700/50 rounded-lg h-32"
```

### Skeleton Loading (Tabela)

```tsx
className="animate-pulse bg-slate-700/30 h-10 rounded"
```

---

## 📊 Gráficos e Métricas

### NPS Score Display

```tsx
<div className="text-6xl font-bold">
  <span className={npsColor}>{npsScore}</span>
  <span className="text-2xl text-slate-400 ml-2">NPS</span>
</div>
```

**Cores dinâmicas:**
```tsx
const npsColor = npsScore >= 75 ? 'text-green-400' :
                 npsScore >= 50 ? 'text-amber-400' :
                 npsScore >= 0  ? 'text-orange-400' :
                                  'text-red-400'
```

### Percentuais

```tsx
<span className="text-sm text-slate-400">
  {percentage}%
</span>
```

---

## ✅ Checklist Específico NPS

Antes de modificar componentes NPS, verifique:

- [ ] **Cores de classificação** seguem o padrão (verde/amarelo/vermelho)
- [ ] **Ícones de subclassificação** são da Lucide React
- [ ] **Tabela** tem ordenação e paginação
- [ ] **Filtros** persistem ao navegar entre abas
- [ ] **Cards de métrica** mostram variação vs. período anterior
- [ ] **Estados de loading** usam skeleton apropriado
- [ ] **Responsivo** em mobile (cards empilham, tabela scroll horizontal)
- [ ] **Acessibilidade** para leitores de tela nos gráficos

---

## 🔗 Arquivos Relacionados

### Componentes
```
src/components/nps/
├── AbasAnswers.tsx
├── AnswersList.tsx
├── AnswersListCards.tsx
├── AnswersDashboard.tsx
├── DashboardCards.tsx
├── NpsCard/ (6 arquivos)
├── NpsTable/ (6 arquivos)
├── NpsFilterMenu.tsx
├── SubclassificationFilter.tsx
├── SubclassificationGrid.tsx
└── CustomMessageModal.tsx
```

### Hooks
```
src/components/nps/
├── useAnswersList.ts
├── useAnswersListColumns.tsx
├── useAnswersDashboard.ts
└── useCustomMessageModal.ts
```

### Serviços
```
src/services/npsConsultaService.ts (11 funções API)
```

### Tipos
```
src/types/nps.ts (20+ interfaces)
```

---

**Versão:** 1.0.0
**Última Atualização:** 2026-03-09
**Página:** `/admin/nps/consultas`
