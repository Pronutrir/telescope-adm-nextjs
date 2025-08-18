# Modal Component

Componente Modal reutilizável com animações e suporte a temas, baseado no template HTML fornecido.

## Características

- ✅ **Animações suaves**: slide-down (padrão), fade, slide-up, zoom
- ✅ **Suporte a temas**: Integração com ThemeContext (dark/light)
- ✅ **Responsivo**: Adaptação automática para mobile
- ✅ **Centralizado**: Sempre visível na viewport atual (sem scroll da página)
- ✅ **Acessibilidade**: ARIA labels, navegação por teclado
- ✅ **Altura inteligente**: Máximo 90vh com scroll interno quando necessário
- ✅ **Flexível**: Múltiplos tamanhos e configurações
- ✅ **Hook incluído**: `useModal` para controle de estado
- ✅ **Exemplos integrados**: Disponível na página `ComponentsExamples` em `@/components/examples`

## Exemplos Práticos

Para ver todos os exemplos em ação, os exemplos do Modal estão integrados na página principal de componentes:

```tsx
import { ComponentsExamples } from '@/components/examples'

// Página completa com todos os componentes incluindo Modal
<ComponentsExamples />
```

A seção **Modal Component** inclui:
- **8 tipos diferentes de modais**: Confirmação, Formulário, Detalhes, Personalizado, Alerta, Sucesso, Informativo, Grande
- **Categorias organizadas**: Modais Básicos, Notificações, Tamanhos e Animações
- **Exemplos interativos**: Todos funcionais com tema automático

## Uso Básico

```tsx
import { Modal, useModal } from '@/components/ui/Modal'

function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal()

  return (
    <>
      <button onClick={openModal}>
        Abrir Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Meu Modal"
      >
        <p>Conteúdo do modal aqui...</p>
      </Modal>
    </>
  )
}
```

## Exemplos Completos

### Modal Simples
```tsx
<Modal
  isOpen={isOpen}
  onClose={closeModal}
  title="Confirmação"
>
  <p>Tem certeza que deseja continuar?</p>
</Modal>
```

### Modal com Footer e Ações
```tsx
<Modal
  isOpen={isOpen}
  onClose={closeModal}
  title="Excluir Item"
  footer={
    <>
      <button 
        onClick={closeModal}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        Cancelar
      </button>
      <button 
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Excluir
      </button>
    </>
  }
>
  <p>Esta ação não pode ser desfeita.</p>
</Modal>
```

### Modal Grande com Scroll
```tsx
<Modal
  isOpen={isOpen}
  onClose={closeModal}
  title="Detalhes Completos"
  size="xl"
  animation="slide-up"
>
  <div className="space-y-4">
    <p>Conteúdo muito longo...</p>
    <p>Mais conteúdo...</p>
    {/* O scroll automático será aplicado se necessário */}
  </div>
</Modal>
```

### Modal Personalizado
```tsx
<Modal
  isOpen={isOpen}
  onClose={closeModal}
  size="lg"
  animation="zoom"
  closeOnOverlayClick={false}
  closeOnEsc={false}
  className="border-2 border-blue-500"
>
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-4">Modal Especial</h2>
    <p>Este modal só fecha com o botão específico.</p>
  </div>
</Modal>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | `boolean` | - | **Obrigatório**. Se o modal está aberto |
| `onClose` | `() => void` | - | **Obrigatório**. Função para fechar o modal |
| `title` | `string` | - | Título do modal |
| `children` | `ReactNode` | - | **Obrigatório**. Conteúdo do modal |
| `footer` | `ReactNode` | - | Conteúdo do footer (botões, etc.) |
| `className` | `string` | - | Classes CSS adicionais |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Tamanho do modal |
| `showCloseButton` | `boolean` | `true` | Se deve mostrar o botão X |
| `closeOnOverlayClick` | `boolean` | `true` | Se deve fechar ao clicar no overlay |
| `closeOnEsc` | `boolean` | `true` | Se deve fechar com a tecla ESC |
| `animation` | `'slide-down' \| 'fade' \| 'slide-up' \| 'zoom'` | `'slide-down'` | Tipo de animação |

## Posicionamento e Layout

O componente Modal utiliza posicionamento fixo (`fixed inset-0`) para garantir que sempre apareça centralizado na tela, independentemente da posição de scroll da página:

- **Centralização Automática**: O modal sempre aparece no centro da viewport
- **Sem Scroll da Página**: O usuário não precisa rolar a página para ver o modal completo
- **Responsivo**: Funciona em todos os tamanhos de tela
- **Scroll Interno**: Quando o conteúdo é muito grande, apenas o corpo do modal rola
- **Altura Máxima**: 70% da altura da viewport para garantir visibilidade

### Comportamento por Tamanho

| Tamanho | Largura | Altura Máxima | Comportamento |
|---------|---------|---------------|---------------|
| `sm` | 384px | 70vh | Modal pequeno, ideal para confirmações |
| `md` | 512px | 70vh | Modal padrão para formulários simples |
| `lg` | 640px | 70vh | Modal grande para formulários complexos |
| `xl` | 768px | 70vh | Modal extra grande para conteúdo extenso |
| `full` | 95vw | 90vh | Modal em tela cheia com margens |

## Hook useModal

```tsx
const { 
  isOpen,      // boolean - estado atual
  openModal,   // () => void - abre o modal  
  closeModal,  // () => void - fecha o modal
  toggleModal  // () => void - alterna o estado
} = useModal()
```

## Tamanhos Disponíveis

- `sm`: max-width 384px
- `md`: max-width 448px (padrão)
- `lg`: max-width 672px
- `xl`: max-width 896px
- `full`: largura total com margem

## Animações

- `slide-down`: Desliza de cima para baixo (padrão)
- `fade`: Fade in/out simples
- `slide-up`: Desliza de baixo para cima
- `zoom`: Efeito de zoom in/out

## Acessibilidade

- Suporte completo a navegação por teclado
- Atributos ARIA apropriados
- Foco automático no modal quando aberto
- Previne scroll da página quando ativo

## Integração com Temas

O componente usa automaticamente:
- `useTheme()` para cores dark/light
- `useLayout()` para adaptações mobile

As cores se adaptam automaticamente ao tema ativo do projeto.
