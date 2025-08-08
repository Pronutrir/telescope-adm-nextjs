# FlyonUI Card Integration

Este documento descreve a integração dos componentes FlyonUI Card no projeto Telescope ADM, refatorados para TypeScript e Next.js 15.

## Componentes Disponíveis

### FlyonCard
Componente principal de card baseado no FlyonUI com integração ao sistema de design do Telescope ADM.

```tsx
import { FlyonCard } from '@/components/ui/FlyonCard'

<FlyonCard variant="telescope" size="md" elevation="lg">
  {/* Conteúdo do card */}
</FlyonCard>
```

#### Props
- `variant`: 'default' | 'primary' | 'secondary' | 'telescope' | 'glass'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `elevation`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

### CardBody
Contêiner do conteúdo do card.

```tsx
import { CardBody } from '@/components/ui/FlyonCard'

<CardBody padding="md">
  {/* Conteúdo */}
</CardBody>
```

#### Props
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

### CardTitle
Título do card com opção de gradiente.

```tsx
import { CardTitle } from '@/components/ui/FlyonCard'

<CardTitle level={3} gradient>
  Título do Card
</CardTitle>
```

#### Props
- `level`: 1 | 2 | 3 | 4 | 5 | 6 (h1, h2, h3, etc.)
- `gradient`: boolean (aplica gradiente colorido)

### CardActions
Container para botões e ações do card.

```tsx
import { CardActions } from '@/components/ui/FlyonCard'

<CardActions justify="between">
  {/* Botões */}
</CardActions>
```

#### Props
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around'

### CardButton
Botão estilizado para usar dentro dos cards.

```tsx
import { CardButton } from '@/components/ui/FlyonCard'
import { ArrowRight } from 'lucide-react'

<CardButton 
  variant="primary" 
  size="md" 
  icon={ArrowRight} 
  iconPosition="right"
>
  Clique aqui
</CardButton>
```

#### Props
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: LucideIcon (ícone do Lucide React)
- `iconPosition`: 'left' | 'right'

## Exemplos de Uso

### Card Básico
```tsx
import { FlyonCard, CardBody, CardTitle, CardActions, CardButton } from '@/components/ui/FlyonCard'

<FlyonCard variant="default" size="sm" elevation="md">
  <CardBody>
    <CardTitle>Título do Card</CardTitle>
    <p className="mb-4 text-muted-foreground">
      Descrição do conteúdo do card.
    </p>
    <CardActions>
      <CardButton variant="primary">Ação Principal</CardButton>
    </CardActions>
  </CardBody>
</FlyonCard>
```

### Card com Gradiente
```tsx
<FlyonCard variant="telescope" size="md" elevation="lg">
  <CardBody padding="lg">
    <CardTitle gradient level={2}>
      Título com Gradiente
    </CardTitle>
    <p className="mb-6 text-muted-foreground">
      Card com estilo telescope e título gradiente.
    </p>
    <CardActions justify="center">
      <CardButton variant="primary" size="lg" icon={Star}>
        Ação Especial
      </CardButton>
    </CardActions>
  </CardBody>
</FlyonCard>
```

### Card Glass Effect
```tsx
<FlyonCard variant="glass" size="lg" elevation="xl">
  <CardBody padding="xl">
    <CardTitle level={1}>
      Efeito Glass
    </CardTitle>
    <p className="mb-8 text-muted-foreground">
      Card com efeito de vidro e backdrop blur.
    </p>
    <CardActions justify="between">
      <CardButton variant="outline">Cancelar</CardButton>
      <CardButton variant="primary">Confirmar</CardButton>
    </CardActions>
  </CardBody>
</FlyonCard>
```

## Variantes de Estilo

### Default
Card padrão com fundo card e bordas sutis.

### Primary
Card com acentos primários e gradiente sutil.

### Secondary
Card com acentos secundários e gradiente sutil.

### Telescope
Card com o estilo característico do Telescope ADM, incluindo bordas primárias e ring effects.

### Glass
Card com efeito de vidro (glass morphism) usando backdrop-blur.

## Classes CSS Customizadas

O sistema inclui classes CSS customizadas definidas em `globals.css`:

- `.card`: Estilo base do card
- `.card-body`: Container flexível do conteúdo
- `.card-title`: Estilo do título
- `.card-actions`: Container das ações
- `.btn`: Estilo base dos botões
- `.btn-primary`, `.btn-secondary`, etc.: Variantes dos botões
- `.card-hover-lift`: Efeito de elevação no hover

## Integração com Tailwind CSS

Os componentes são totalmente compatíveis com o Tailwind CSS v4 usado no projeto, utilizando:

- Classes utilitárias do Tailwind
- Variáveis CSS customizadas do tema
- Sistema de cores do Telescope ADM
- Breakpoints responsivos

## Demo Page

Acesse `/admin/flyon-cards` para ver todos os componentes em ação com diferentes configurações e estilos.

## Considerações de Performance

- Componentes são lazy-loaded quando necessário
- Utilizam React.forwardRef para compatibilidade com refs
- Otimizados para SSR com Next.js 15
- Classes CSS minificadas em produção

## Acessibilidade

- Suporte completo a screen readers
- Focus management adequado
- Contraste de cores WCAG compatível
- Navegação por teclado
