# 🔄 Guia de Migração - Sistema de Design

## Como Migrar Componentes Existentes

Este guia prático mostra como converter componentes existentes para usar o novo sistema de design Tailwind.

---

## 📋 Checklist de Migração

### ✅ Antes de Começar
- [ ] Leia o [TAILWIND-DESIGN-SYSTEM.md](./TAILWIND-DESIGN-SYSTEM.md)
- [ ] Verifique se o arquivo `globals.css` está atualizado
- [ ] Teste o tema claro e escuro

### ✅ Durante a Migração
- [ ] Substitua classes Tailwind antigas pelas novas classes personalizadas
- [ ] Teste responsividade
- [ ] Verifique acessibilidade (foco, contraste)

---

## 🔧 Exemplos de Migração

### 1. Botões

#### ❌ Antes (Tailwind puro):
```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
  Salvar
</button>
```

#### ✅ Depois (Sistema de Design):
```jsx
<button className="btn-primary">
  Salvar
</button>
```

#### 🎯 Outros tipos de botão:
```jsx
<button className="btn-secondary">Cancelar</button>
<button className="btn-danger">Excluir</button>
<button className="btn-success">Confirmar</button>
<button className="btn-outline">Mais Opções</button>
```

---

### 2. Cards

#### ❌ Antes:
```jsx
<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
  <h3 className="text-lg font-semibold mb-4">Título</h3>
  <p className="text-gray-600">Conteúdo...</p>
</div>
```

#### ✅ Depois:
```jsx
<div className="card-basic">
  <h3 className="text-title-sm font-title mb-element">Título</h3>
  <p className="text-muted">Conteúdo...</p>
</div>
```

#### 🎯 Outros tipos de card:
```jsx
<div className="card-elevated">Card com mais sombra</div>
<div className="card-interactive">Card clicável</div>
```

---

### 3. Inputs

#### ❌ Antes:
```jsx
<input 
  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
  type="text" 
  placeholder="Digite aqui..."
/>
```

#### ✅ Depois:
```jsx
<input 
  className="input-basic" 
  type="text" 
  placeholder="Digite aqui..."
/>
```

#### 🎯 Estados do input:
```jsx
<input className="input-error" placeholder="Campo com erro" />
<input className="input-success" placeholder="Campo válido" />
```

---

### 4. Layout e Containers

#### ❌ Antes:
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards */}
  </div>
</div>
```

#### ✅ Depois:
```jsx
<div className="container-main">
  <div className="grid-cards">
    {/* Cards */}
  </div>
</div>
```

#### 🎯 Outros containers:
```jsx
<div className="container-section">Conteúdo de seção</div>
<div className="container-narrow">Conteúdo estreito</div>

<div className="grid-cards-sm">Grid com 4 colunas</div>
<div className="grid-cards-lg">Grid com 2 colunas grandes</div>
```

---

### 5. Tipografia

#### ❌ Antes:
```jsx
<h1 className="text-3xl font-bold text-gray-900 mb-4">
  Título Principal
</h1>
<p className="text-lg text-gray-600 mb-6">
  Descrição da página
</p>
<span className="text-sm text-gray-500">
  Texto pequeno
</span>
```

#### ✅ Depois:
```jsx
<h1 className="text-title-lg font-title text-emphasis mb-element">
  Título Principal
</h1>
<p className="text-body-lg text-muted mb-section">
  Descrição da página
</p>
<span className="text-body-sm text-muted">
  Texto pequeno
</span>
```

#### 🎯 Hierarquia de títulos:
```jsx
<h1 className="text-title-xl">Título Muito Grande</h1>
<h2 className="text-title-lg">Título Grande</h2>
<h3 className="text-title-md">Título Médio</h3>
<h4 className="text-title-sm">Título Pequeno</h4>
```

---

### 6. Ícones

#### ❌ Antes:
```jsx
<Bell className="w-5 h-5 text-blue-600" />
<Settings className="w-4 h-4 text-gray-500" />
<Check className="w-6 h-6 text-green-600" />
```

#### ✅ Depois:
```jsx
<Bell className="icon-navbar" />
<Settings className="icon-button" />
<Check className="icon-success" />
```

#### 🎯 Tamanhos de ícones:
```jsx
<Home className="icon-xs" />  {/* 12px */}
<Home className="icon-sm" />  {/* 16px */}
<Home className="icon-md" />  {/* 20px */}
<Home className="icon-lg" />  {/* 24px */}
<Home className="icon-xl" />  {/* 32px */}
```

#### 🎯 Ícones com contexto:
```jsx
<Home className="icon-sidebar" />
<Home className="icon-sidebar-active" />
<AlertTriangle className="icon-warning" />
<X className="icon-error" />
<Info className="icon-info" />
```

---

### 7. Flexbox e Alinhamento

#### ❌ Antes:
```jsx
<div className="flex justify-between items-center">
  <span>Texto</span>
  <button>Ação</button>
</div>

<div className="flex justify-center items-center h-64">
  <div>Centralizado</div>
</div>
```

#### ✅ Depois:
```jsx
<div className="flex-between">
  <span>Texto</span>
  <button>Ação</button>
</div>

<div className="flex-center h-64">
  <div>Centralizado</div>
</div>
```

#### 🎯 Outras opções de flex:
```jsx
<div className="flex-start">Alinhado à esquerda</div>
<div className="flex-end">Alinhado à direita</div>
<div className="flex-col-center">Coluna centralizada</div>
```

---

### 8. Espaçamentos

#### ❌ Antes:
```jsx
<div className="mb-8">
  <h2 className="mb-4">Título da Seção</h2>
  <p className="mb-4">Parágrafo</p>
  <div className="p-6 bg-white rounded-lg">
    Card content
  </div>
</div>
```

#### ✅ Depois:
```jsx
<div className="mb-section">
  <h2 className="mb-element">Título da Seção</h2>
  <p className="mb-element">Parágrafo</p>
  <div className="p-card bg-white rounded-lg">
    Card content
  </div>
</div>
```

#### 🎯 Sistema de espaçamento:
```jsx
{/* Margins */}
<div className="mb-section">Seção (32px)</div>
<div className="mb-element">Elemento (16px)</div>
<div className="mb-card">Card (24px)</div>

{/* Paddings */}
<div className="p-container-sm">Container pequeno (12px)</div>
<div className="p-container-md">Container médio (24px)</div>
<div className="p-container-lg">Container grande (40px)</div>
<div className="p-card">Card (24px)</div>
```

---

### 9. Estados e Feedback

#### ❌ Antes:
```jsx
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
  Sucesso!
</div>

<span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
  Erro
</span>
```

#### ✅ Depois:
```jsx
<div className="alert-success">
  Sucesso!
</div>

<span className="status-error">
  Erro
</span>
```

#### 🎯 Tipos de alertas e status:
```jsx
{/* Alertas */}
<div className="alert-success">Mensagem de sucesso</div>
<div className="alert-error">Mensagem de erro</div>
<div className="alert-warning">Mensagem de aviso</div>
<div className="alert-info">Mensagem informativa</div>

{/* Status badges */}
<span className="status-success">Ativo</span>
<span className="status-error">Erro</span>
<span className="status-warning">Pendente</span>
<span className="status-info">Info</span>

{/* Badges */}
<span className="badge-primary">Principal</span>
<span className="badge-secondary">Secundário</span>
```

---

### 10. Loading States

#### ❌ Antes:
```jsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>

<div className="animate-pulse bg-gray-300 h-4 w-full rounded"></div>
```

#### ✅ Depois:
```jsx
<div className="loading-spinner"></div>

<div className="skeleton-text"></div>
```

#### 🎯 Skeleton loading:
```jsx
<div className="skeleton-title"></div>
<div className="skeleton-text"></div>
<div className="skeleton-text"></div>
<div className="skeleton-avatar"></div>
```

---

## 🎨 Exemplo Completo de Migração

### ❌ Componente Antes:
```jsx
function ProductCard({ product }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          Ativo
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{product.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">
          R$ {product.price}
        </span>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
        Comprar Agora
      </button>
    </div>
  );
}
```

### ✅ Componente Depois:
```jsx
function ProductCard({ product }) {
  return (
    <div className="card-interactive">
      <div className="flex-between mb-element">
        <h3 className="text-title-sm font-title">{product.name}</h3>
        <span className="status-success">Ativo</span>
      </div>
      
      <p className="text-muted mb-element">{product.description}</p>
      
      <div className="flex-between">
        <span className="text-title-md font-strong text-emphasis">
          R$ {product.price}
        </span>
        
        <div className="flex space-x-2">
          <button className="p-2 text-muted hover:text-primary transition-colors">
            <Eye className="icon-button" />
          </button>
          <button className="p-2 text-muted hover:text-red-600 transition-colors">
            <Trash2 className="icon-button" />
          </button>
        </div>
      </div>
      
      <button className="btn-primary w-full mt-element">
        Comprar Agora
      </button>
    </div>
  );
}
```

---

## 🚀 Benefícios da Migração

### Antes vs Depois

| **Aspecto** | **Antes** | **Depois** |
|-------------|-----------|------------|
| **Linhas de CSS** | ~15-20 classes por componente | ~5-8 classes por componente |
| **Manutenção** | Difícil, estilos espalhados | Fácil, centralizado |
| **Consistência** | Manual, propenso a erros | Automática |
| **Tema Dark** | Precisa configurar manualmente | Automático |
| **Responsividade** | Configurar para cada elemento | Já incluída nos componentes |
| **Legibilidade** | Difícil de ler | Fácil de entender |

---

## 📝 Próximos Passos

1. **Migre gradualmente**: Comece pelos componentes mais usados
2. **Teste sempre**: Verifique tema claro/escuro e responsividade
3. **Documente mudanças**: Anote componentes migrados
4. **Treine a equipe**: Compartilhe este guia com outros desenvolvedores

---

## 🆘 Dúvidas Frequentes

### ❓ "E se eu precisar de algo específico que não existe no sistema?"

Primeiro verifique se realmente não existe uma classe similar. Se não existir, você pode:

1. **Criar uma nova classe** no `globals.css` seguindo o padrão
2. **Usar Tailwind normal** como exceção (documente o motivo)
3. **Propor adição** ao sistema de design

### ❓ "Como migro componentes complexos?"

Quebre em partes menores:
1. Migre a estrutura principal (card, container)
2. Migre a tipografia
3. Migre os botões e ícones
4. Teste cada etapa

### ❓ "O que fazer se algo quebrar?"

1. Verifique se todas as classes existem no `globals.css`
2. Teste no tema claro e escuro
3. Verifique se não há conflitos com CSS existente
4. Use as ferramentas de dev do browser para debugar

---

**Lembre-se**: A migração é gradual. Não precisa migrar tudo de uma vez! 🎯
