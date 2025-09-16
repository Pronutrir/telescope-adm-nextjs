# Documentação do Sistema de Temas da Aplicação

Este documento detalha a arquitetura e o uso do sistema de temas da aplicação, que é construído com base em Variáveis CSS (Custom Properties) para oferecer flexibilidade, consistência e fácil manutenção.

## Visão Geral

O sistema de temas está centralizado no arquivo `src/styles/themes.css`. Ele define dois temas principais:

1.  **Tema Claro (Padrão):** Definido no seletor `:root`. É o tema padrão da aplicação.
2.  **Tema Escuro:** Definido sob o seletor `.dark`. Este tema é ativado quando a classe `dark` é aplicada a um elemento pai (geralmente a tag `<html>` ou `<body>`).

A troca entre os temas é feita dinamicamente, e as transições de cores são animadas para uma experiência de usuário mais suave.

## Estrutura das Variáveis CSS

O sistema é composto por um conjunto de variáveis semânticas e paletas de cores.

### 1. Cores Semânticas do Sistema

Estas são as variáveis mais importantes e devem ser a principal forma de aplicar cores nos componentes para garantir que eles se adaptem corretamente a ambos os temas.

| Variável | Descrição |
| :--- | :--- |
| `--color-background` | Cor de fundo principal da página. |
| `--color-foreground` | Cor do texto principal. |
| `--color-card` | Cor de fundo para componentes como cards e painéis. |
| `--color-card-foreground` | Cor do texto dentro dos cards. |
| `--color-popover` | Cor de fundo para popovers e menus suspensos. |
| `--color-popover-foreground` | Cor do texto dentro de popovers. |
| `--color-border` | Cor para bordas de elementos e divisores. |
| `--color-input` | Cor de fundo para campos de formulário (`input`, `textarea`). |
| `--color-primary` | Cor primária principal para botões e links de destaque. |
| `--color-primary-foreground` | Cor do texto para ser usada sobre a cor primária. |
| `--color-secondary` | Cor secundária para elementos menos proeminentes. |
| `--color-secondary-foreground`| Cor do texto para ser usada sobre a cor secundária. |
| `--color-accent` | Cor para acentos e destaques sutis. |
| `--color-accent-foreground` | Cor do texto para ser usada sobre a cor de acento. |
| `--color-destructive` | Cor para ações destrutivas (ex: botões de exclusão). |
| `--color-destructive-foreground`| Cor do texto para ser usada sobre a cor destrutiva. |
| `--color-muted` | Cor para elementos "silenciados" ou de baixa prioridade. |
| `--color-muted-foreground` | Cor do texto para elementos "silenciados". |
| `--color-ring` | Cor para anéis de foco em elementos interativos. |

### 2. Paletas de Cores

Para cada cor principal (primária, secundária, sucesso, aviso, erro), existe uma paleta completa com 11 tons, de 50 a 950 (ex: `--color-primary-50`, `--color-primary-100`, ..., `--color-primary-950`).

-   **Tema Claro:** Utiliza uma paleta moderna com azul profissional, cinza neutro e cores vibrantes para status.
-   **Tema Escuro:** Utiliza uma paleta única e sofisticada com nomes temáticos como `Outer Space`, `Night`, `Licorice` e `Caput Mortuum`.

### 3. Sombras e Efeitos

-   `--shadow-theme`, `--shadow-theme-lg`, `--shadow-theme-xl`: Variáveis para sombras de caixa (`box-shadow`) consistentes.
-   `--backdrop-blur`: Variável para o efeito de desfoque de fundo (glassmorphism).

## Como Utilizar o Tema

### Em Arquivos CSS

Para garantir que seus componentes sejam compatíveis com os temas, utilize as variáveis CSS. A sintaxe `rgb(var(...))` é preferível para permitir o uso de opacidade.

**Exemplo:**

```css
.meu-componente {
  background-color: rgb(var(--color-card));
  color: rgb(var(--color-card-foreground));
  border: 1px solid rgb(var(--color-border));
  border-radius: 0.5rem;
  box-shadow: var(--shadow-theme);
}

.meu-componente-titulo {
  color: rgb(var(--color-primary));
}
```

### Sobrescrevendo Classes do Tailwind CSS

O arquivo `themes.css` já sobrescreve muitas classes utilitárias do Tailwind CSS (como `text-gray-500`, `bg-primary-500`, etc.) para que elas usem as variáveis do tema.

Isso significa que, ao usar uma classe como `bg-card` ou `text-foreground` no seu JSX/HTML (assumindo que estas estejam configuradas no `tailwind.config.js`), elas já estarão vinculadas às variáveis do tema.

**Importante:** Evite usar cores fixas do Tailwind (ex: `bg-blue-500`) diretamente, pois elas não se adaptarão à mudança de tema. Em vez disso, prefira as classes semânticas configuradas no `tailwind.config.js` que apontam para as variáveis CSS.

## Efeitos Especiais

O sistema de temas inclui classes prontas para efeitos visuais modernos:

-   `.glass-theme` / `.glass-secondary`: Aplica um efeito de "vidro" (glassmorphism) que funciona em ambos os temas.
-   `.modern-glow` (tema claro) / `.sophisticated-glow` (tema escuro): Adiciona um brilho sutil em elementos interativos no estado de `:hover`.

## Scrollbar

A barra de rolagem é automaticamente estilizada para combinar com o tema ativo. Classes utilitárias como `.scrollbar-hide` e `.scrollbar-custom` também estão disponíveis para customizações adicionais.
