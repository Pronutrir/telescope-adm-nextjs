# Sistema de Design Tailwind - Telescope ADM

## 📚 Guia Completo para Desenvolvedores

Este documento serve como referência completa para o sistema de design da aplicação Telescope ADM, especialmente direcionado para desenvolvedores que estão aprendendo Tailwind CSS.

## 🎯 Objetivo

Criar um sistema consistente e reutilizável que permita:
- Desenvolvimento mais rápido
- Consistência visual em toda aplicação
- Facilidade de manutenção
- Suporte a temas (claro/escuro)

---

## 🎨 Paleta de Cores

### Cores Primárias (Azul Professional)
```css
/* Use estas classes para elementos principais */
.bg-primary-50    /* Azul muito claro - fundos delicados */
.bg-primary-100   /* Azul claro - hover em botões secundários */
.bg-primary-500   /* Azul principal - botões primários */
.bg-primary-600   /* Azul escuro - hover em botões primários */
.bg-primary-900   /* Azul muito escuro - textos importantes */

.text-primary-500 /* Texto azul principal */
.text-primary-600 /* Texto azul escuro */
.border-primary-500 /* Bordas azuis */
```

### Cores Neutras (Cinza)
```css
/* Use para textos e fundos neutros */
.bg-gray-50      /* Fundo muito claro */
.bg-gray-100     /* Fundo claro para cards */
.bg-gray-500     /* Elementos neutros */
.bg-gray-900     /* Fundo escuro no tema dark */

.text-gray-600   /* Texto secundário */
.text-gray-900   /* Texto principal */
```

### Cores de Status
```css
/* Sucesso (Verde) */
.bg-success-500  /* Verde para ações positivas */
.text-success-600 /* Texto de sucesso */

/* Aviso (Âmbar) */
.bg-warning-500  /* Amarelo para avisos */
.text-warning-600 /* Texto de aviso */

/* Erro (Vermelho) */
.bg-error-500    /* Vermelho para erros */
.text-error-600  /* Texto de erro */

/* Informação (Azul claro) */
.bg-info-500     /* Azul claro para informações */
.text-info-600   /* Texto informativo */
```

---

## 🔧 Classes Utilitárias Personalizadas

### Espaçamentos Padronizados

#### Espaçamento Interno (Padding)
```css
/* Containers pequenos */
.p-container-sm   /* padding: 0.75rem (12px) */

/* Containers médios */
.p-container-md   /* padding: 1.5rem (24px) */

/* Containers grandes */
.p-container-lg   /* padding: 2.5rem (40px) */

/* Cards */
.p-card          /* padding: 1.5rem (24px) */

/* Botões */
.p-btn-sm        /* padding: 0.5rem 1rem */
.p-btn-md        /* padding: 0.75rem 1.5rem */
.p-btn-lg        /* padding: 1rem 2rem */
```

#### Espaçamento Externo (Margin)
```css
/* Seções */
.mb-section      /* margin-bottom: 2rem (32px) */
.mt-section      /* margin-top: 2rem (32px) */

/* Elementos */
.mb-element      /* margin-bottom: 1rem (16px) */
.mt-element      /* margin-top: 1rem (16px) */

/* Cards */
.mb-card         /* margin-bottom: 1.5rem (24px) */
```

### Tipografia

#### Tamanhos de Texto
```css
/* Títulos */
.text-title-xl   /* 2.25rem (36px) - Títulos principais */
.text-title-lg   /* 1.875rem (30px) - Títulos de seção */
.text-title-md   /* 1.5rem (24px) - Subtítulos */
.text-title-sm   /* 1.25rem (20px) - Títulos pequenos */

/* Corpo do texto */
.text-body-lg    /* 1.125rem (18px) - Texto destaque */
.text-body-md    /* 1rem (16px) - Texto padrão */
.text-body-sm    /* 0.875rem (14px) - Texto secundário */
.text-body-xs    /* 0.75rem (12px) - Legendas */
```

#### Pesos de Fonte
```css
.font-title      /* font-weight: 600 (semi-bold) */
.font-body       /* font-weight: 400 (normal) */
.font-emphasis   /* font-weight: 500 (medium) */
.font-strong     /* font-weight: 700 (bold) */
```

---

## 🖼️ Componentes Pré-definidos

### Botões

#### Botão Primário
```html
<!-- Botão principal da aplicação -->
<button class="btn-primary">
  Ação Principal
</button>

<!-- Equivale a: -->
<button class="bg-primary-500 hover:bg-primary-600 text-white p-btn-md rounded-md transition-colors font-emphasis">
  Ação Principal
</button>
```

#### Botão Secundário
```html
<!-- Botão secundário -->
<button class="btn-secondary">
  Ação Secundária
</button>

<!-- Equivale a: -->
<button class="bg-gray-100 hover:bg-gray-200 text-gray-700 p-btn-md rounded-md transition-colors font-emphasis border border-gray-300">
  Ação Secundária
</button>
```

#### Botão de Perigo
```html
<!-- Para ações destrutivas -->
<button class="btn-danger">
  Excluir
</button>
```

### Cards

#### Card Básico
```html
<!-- Card padrão -->
<div class="card-basic">
  <h3 class="text-title-sm mb-element">Título do Card</h3>
  <p class="text-body-md text-gray-600">Conteúdo do card...</p>
</div>

<!-- Equivale a: -->
<div class="bg-white p-card rounded-lg card-shadow border border-gray-200">
  <h3 class="text-title-sm mb-element">Título do Card</h3>
  <p class="text-body-md text-gray-600">Conteúdo do card...</p>
</div>
```

#### Card com Elevação
```html
<!-- Card com sombra mais acentuada -->
<div class="card-elevated">
  Conteúdo...
</div>
```

### Inputs

#### Input Padrão
```html
<!-- Campo de entrada básico -->
<input class="input-basic" type="text" placeholder="Digite aqui...">

<!-- Equivale a: -->
<input class="w-full p-btn-md border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" type="text" placeholder="Digite aqui...">
```

#### Input com Erro
```html
<!-- Campo com estado de erro -->
<input class="input-error" type="text" placeholder="Digite aqui...">
```

---

## 🎯 Ícones Sistema

### Configuração Global de Ícones

Todos os ícones Lucide têm configuração automática. Use as classes específicas:

#### Ícones do Navbar
```html
<!-- Ícone do sino no navbar -->
<Bell className="icon-navbar" />

<!-- Equivale a ter: -->
<Bell className="w-5 h-5 navbar-bell-icon" />
```

#### Ícones do Sidebar
```html
<!-- Ícone no menu lateral -->
<Home className="icon-sidebar" />

<!-- Para ícone ativo: -->
<Home className="icon-sidebar-active" />
```

#### Ícones de Botões
```html
<!-- Ícone dentro de botão -->
<Plus className="icon-button" />

<!-- Ícone pequeno -->
<Edit className="icon-sm" />

<!-- Ícone médio -->
<Search className="icon-md" />

<!-- Ícone grande -->
<Settings className="icon-lg" />
```

#### Ícones de Status
```html
<!-- Ícone de sucesso -->
<Check className="icon-success" />

<!-- Ícone de erro -->
<X className="icon-error" />

<!-- Ícone de aviso -->
<AlertTriangle className="icon-warning" />

<!-- Ícone de informação -->
<Info className="icon-info" />
```

---

## 📱 Layout e Grid

### Container Principal
```html
<!-- Container responsivo da página -->
<div class="container-main">
  Conteúdo da página...
</div>

<!-- Equivale a: -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Conteúdo da página...
</div>
```

### Grid Responsivo
```html
<!-- Grid de cards responsivo -->
<div class="grid-cards">
  <div class="card-basic">Card 1</div>
  <div class="card-basic">Card 2</div>
  <div class="card-basic">Card 3</div>
</div>

<!-- Equivale a: -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="card-basic">Card 1</div>
  <div class="card-basic">Card 2</div>
  <div class="card-basic">Card 3</div>
</div>
```

### Flexbox Utilitários
```css
/* Centralização comum */
.flex-center     /* display: flex; justify-content: center; align-items: center; */
.flex-between    /* display: flex; justify-content: space-between; align-items: center; */
.flex-start      /* display: flex; justify-content: flex-start; align-items: center; */
.flex-end        /* display: flex; justify-content: flex-end; align-items: center; */
```

---

## 🌙 Suporte a Temas

### Como Funciona

O sistema automaticamente alterna entre tema claro e escuro. Use as classes padrão que o sistema se adapta:

```html
<!-- Este card se adapta automaticamente -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Conteúdo que muda com o tema
</div>

<!-- OU use as classes personalizadas que já incluem suporte a tema: -->
<div class="card-basic">
  Conteúdo que se adapta automaticamente
</div>
```

### Classes que Mudam com Tema
```css
/* Estas classes já incluem suporte a dark mode: */
.card-basic          /* Fundo branco no claro, cinza escuro no escuro */
.btn-primary         /* Se adapta ao tema */
.input-basic         /* Se adapta ao tema */
.text-primary        /* Cor primária que muda com tema */
```

---

## 📏 Breakpoints Responsivos

### Tamanhos de Tela
```css
/* Mobile First - comece sempre pelo mobile */
.block              /* Sempre visível */
.hidden sm:block    /* Visível apenas em telas pequenas e maiores */
.block md:hidden    /* Visível apenas em mobile e tablet */
.hidden lg:block    /* Visível apenas em desktop */

/* Breakpoints: */
/* sm: 640px   - Tablets pequenos */
/* md: 768px   - Tablets */
/* lg: 1024px  - Desktop pequeno */
/* xl: 1280px  - Desktop */
/* 2xl: 1536px - Desktop grande */
```

### Grid Responsivo
```html
<!-- Grid que se adapta: -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <!-- 1 coluna no mobile -->
  <!-- 2 colunas no tablet pequeno -->
  <!-- 3 colunas no desktop -->
  <!-- 4 colunas em telas grandes -->
</div>
```

---

## 🚀 Exemplos Práticos

### Página Completa
```html
<div class="container-main">
  <!-- Cabeçalho da página -->
  <header class="mb-section">
    <h1 class="text-title-xl font-title text-gray-900 mb-element">
      Título da Página
    </h1>
    <p class="text-body-lg text-gray-600">
      Descrição da página aqui...
    </p>
  </header>

  <!-- Grid de cards -->
  <div class="grid-cards">
    <div class="card-basic">
      <div class="flex-between mb-element">
        <h3 class="text-title-sm font-title">Card Título</h3>
        <Settings className="icon-md" />
      </div>
      <p class="text-body-md text-gray-600">
        Conteúdo do card...
      </p>
      <button class="btn-primary mt-element">
        Ação
      </button>
    </div>
  </div>
</div>
```

### Modal/Dialog
```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex-center">
  <div class="card-elevated max-w-md w-full mx-4">
    <div class="flex-between mb-element">
      <h2 class="text-title-md font-title">Título do Modal</h2>
      <button class="icon-button">
        <X className="icon-md" />
      </button>
    </div>
    
    <div class="mb-section">
      <p class="text-body-md text-gray-600 mb-element">
        Conteúdo do modal aqui...
      </p>
      
      <input class="input-basic mb-element" 
             type="text" 
             placeholder="Digite algo...">
    </div>
    
    <div class="flex-end space-x-3">
      <button class="btn-secondary">Cancelar</button>
      <button class="btn-primary">Confirmar</button>
    </div>
  </div>
</div>
```

### Lista com Ações
```html
<div class="card-basic">
  <h3 class="text-title-sm font-title mb-element">Lista de Itens</h3>
  
  <div class="space-y-3">
    <div class="flex-between p-3 bg-gray-50 rounded-md">
      <div class="flex items-center space-x-3">
        <File className="icon-md text-primary-500" />
        <div>
          <p class="text-body-md font-emphasis">Nome do arquivo.pdf</p>
          <p class="text-body-sm text-gray-500">2.3 MB</p>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button class="p-2 hover:bg-gray-200 rounded-md transition-colors">
          <Eye className="icon-sm" />
        </button>
        <button class="p-2 hover:bg-gray-200 rounded-md transition-colors">
          <Download className="icon-sm" />
        </button>
        <button class="p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors">
          <Trash2 className="icon-sm" />
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 🔍 Dicas para Iniciantes

### 1. **Comece Simples**
```html
<!-- ❌ Evite isso no início: -->
<div class="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">

<!-- ✅ Prefira isso: -->
<div class="card-basic flex-between">
```

### 2. **Use as Classes Personalizadas**
```html
<!-- ❌ Classes muito específicas: -->
<button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">

<!-- ✅ Use os componentes prontos: -->
<button class="btn-primary">
```

### 3. **Pense Mobile First**
```html
<!-- ✅ Sempre comece pelo mobile: -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 coluna no mobile, 2 no tablet, 3 no desktop -->
</div>
```

### 4. **Use Espaçamentos Consistentes**
```html
<!-- ✅ Use as classes de espaçamento padronizadas: -->
<div class="mb-section">
  <h2 class="mb-element">Título</h2>
  <p class="mb-element">Parágrafo</p>
</div>
```

---

## 🛠️ Customização

### Adicionando Novas Cores
Para adicionar novas cores ao sistema, edite o arquivo `src/styles/themes.css`:

```css
:root {
  /* Sua nova cor */
  --color-custom-500: 123 45 67;
}
```

Depois use em Tailwind:
```html
<div class="bg-[rgb(var(--color-custom-500))]">
```

### Criando Novos Componentes
No arquivo `globals.css`, adicione:

```css
/* Novo componente */
.meu-componente {
  @apply bg-white p-card rounded-lg shadow-md border;
}

.dark .meu-componente {
  @apply bg-gray-800 border-gray-700;
}
```

---

## 📋 Checklist de Qualidade

Antes de finalizar um componente, verifique:

- [ ] ✅ Funciona em tema claro e escuro
- [ ] ✅ É responsivo (mobile, tablet, desktop)
- [ ] ✅ Usa classes personalizadas quando possível
- [ ] ✅ Tem espaçamentos consistentes
- [ ] ✅ Ícones têm tamanho apropriado
- [ ] ✅ Cores seguem a paleta definida
- [ ] ✅ Animações são suaves (transition-colors)

---

## 🤝 Suporte

Se tiver dúvidas:
1. Consulte este documento primeiro
2. Veja exemplos em componentes existentes
3. Use as classes personalizadas antes de criar novas
4. Mantenha a consistência com o design system

---

**Lembre-se**: O objetivo é ter código limpo, consistente e fácil de manter! 🚀
