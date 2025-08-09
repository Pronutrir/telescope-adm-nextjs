# Progress Statistics Components com SortableJS

Este documento descreve como usar os componentes Progress Statistics com funcionalidade de drag & drop usando SortableJS.

## Componentes Disponíveis

### 1. ProgressStat
Componente individual para exibir estatísticas com barra de progresso.

```tsx
import { ProgressStat } from '@/components/ui/ProgressStat'
import { Users } from 'lucide-react'

<ProgressStat
    title="Usuários Ativos"
    value="1,234"
    total="2,000"
    progress={62}
    icon={Users}
    color="primary"
    variant="telescope"
    size="md"
    isDark={false}
/>
```

#### Props:
- `title`: Título do card
- `value`: Valor atual
- `total`: Valor total
- `progress`: Porcentagem (0-100)
- `icon`: Ícone do Lucide React
- `color`: 'primary' | 'success' | 'warning' | 'error' | 'info'
- `variant`: 'default' | 'modern' | 'telescope'
- `size`: 'sm' | 'md' | 'lg'
- `isDark`: Modo escuro/claro
- `className`: Classes CSS customizadas
- `style`: Estilos inline customizados

### 2. SortableProgressStats
Componente wrapper que permite arrastar e reorganizar múltiplos ProgressStat.

```tsx
import { SortableProgressStats } from '@/components/ui/SortableProgressStats'
import { Users, Target, Activity } from 'lucide-react'

const items = [
    {
        id: 'users',
        title: 'Usuários Ativos',
        value: '1,234',
        total: '2,000',
        progress: 62,
        icon: Users,
        color: 'primary',
        variant: 'modern'
    },
    // ... mais items
]

<SortableProgressStats
    items={items}
    onSortEnd={(newItems) => {
        console.log('Nova ordem:', newItems)
        setItems(newItems)
    }}
    isDark={false}
    gridCols={4}
    animation={200}
    disabled={false}
/>
```

#### Props:
- `items`: Array de objetos SortableItem
- `onSortEnd`: Callback executado quando a ordem muda
- `isDark`: Modo escuro/claro
- `gridCols`: Número de colunas (1-6)
- `animation`: Velocidade da animação em ms
- `disabled`: Desabilita o drag & drop
- `className`: Classes CSS customizadas

## Funcionalidades SortableJS

### Estados Visuais
- **sortable-ghost**: Card sendo arrastado (opacidade reduzida)
- **sortable-chosen**: Card selecionado para arraste
- **sortable-drag**: Card em movimento

### Configurações Disponíveis
- **Animation**: Controla a velocidade das transições (100ms - 500ms)
- **Grid Responsivo**: Adapta automaticamente a diferentes tamanhos de tela
- **Callback Events**: Eventos disparados ao finalizar o movimento
- **Modo Desabilitado**: Mantém funcionalidades visuais sem drag & drop

## Exemplos de Uso

### Dashboard Básico
```tsx
const dashboardItems = [
    {
        id: 'cpu',
        title: 'Performance CPU',
        value: '67',
        total: '100',
        progress: 67,
        icon: Monitor,
        color: 'info',
        variant: 'modern'
    },
    {
        id: 'memory',
        title: 'Uso de Memória',
        value: '8.2',
        total: '16',
        progress: 51,
        icon: Database,
        color: 'warning',
        variant: 'modern'
    }
]

<SortableProgressStats
    items={dashboardItems}
    onSortEnd={setDashboardItems}
    gridCols={4}
    animation={200}
/>
```

### Layout Vertical
```tsx
<SortableProgressStats
    items={verticalItems}
    gridCols={2}
    animation={300}
    onSortEnd={(newItems) => {
        console.log('Reordenado:', newItems.map(item => item.title))
    }}
/>
```

### Modo Somente Leitura
```tsx
<SortableProgressStats
    items={readonlyItems}
    gridCols={3}
    disabled={true}
/>
```

## Instalação

Certifique-se de ter o SortableJS instalado:

```bash
npm install sortablejs @types/sortablejs
```

## Acessibilidade

- Atributos ARIA para leitores de tela
- Role "progressbar" nas barras de progresso
- Labels descritivos para valores de progresso
- Navegação por teclado suportada

## Temas

Ambos os componentes detectam automaticamente o tema (claro/escuro) e aplicam as cores apropriadas. Você pode também controlar manualmente através da prop `isDark`.

## Performance

- Animações otimizadas com CSS transitions
- Estados de hover responsivos
- Renderização eficiente com React hooks
- Cleanup automático de event listeners
