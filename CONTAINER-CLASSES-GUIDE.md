# Container Classes - Sistema de Design

## 📐 Classes de Container Disponíveis

### 🏠 **container-main** (Padrão)
```css
max-width: 80rem; /* 1280px */
margin: 0 auto;
padding: 1rem (mobile) → 2rem (desktop)
```
**Uso:** Páginas com conteúdo centralizado e largura limitada.

### 📄 **container-section** (Artigos)
```css
max-width: 56rem; /* 896px */
margin: 0 auto;
padding: 1rem (mobile) → 2rem (desktop)
```
**Uso:** Seções de texto, artigos, formulários.

### 📖 **container-narrow** (Texto)
```css
max-width: 42rem; /* 672px */
margin: 0 auto;
padding: 1rem (mobile) → 2rem (desktop)
```
**Uso:** Textos longos, posts de blog, leitura.

### 🖥️ **container-full** (Full Width) ⭐ **NOVO**
```css
width: 100%;
min-height: 100vh;
padding: 1rem (mobile) → 2rem (desktop)
```
**Uso:** Páginas que ocupam toda a área disponível.

---

## 🚀 Como Usar - container-full

### 1️⃣ **Estrutura Básica:**
```tsx
<div className="container-full">
    <div className="container-full-content">
        <div className="section-full">
            {/* Header da página */}
        </div>
        
        <section className="section-full">
            {/* Seção 1 */}
        </section>
        
        <section className="section-full">
            {/* Seção 2 */}
        </section>
    </div>
</div>
```

### 2️⃣ **Classes Auxiliares:**
- **container-full-content:** Wrapper interno sem limitação de largura
- **section-full:** Espaçamento consistente entre seções (1.5rem → 2rem)

### 3️⃣ **Responsividade Automática:**
```css
/* Mobile */
padding: 1rem;
margin-bottom: 1.5rem;

/* Tablet */
padding: 1.25rem;

/* Desktop */
padding: 1.5rem;
margin-bottom: 2rem;

/* Large Desktop */
padding: 2rem;
```

---

## 📋 **Exemplos de Uso**

### ✅ **Biblioteca de Componentes:**
```tsx
const ComponentLibraryPage = () => (
    <div className="container-full">
        <div className="container-full-content">
            <div className="section-full">
                <h1>Título da Página</h1>
            </div>
            <section className="section-full">
                <div className="card-basic">
                    {/* Conteúdo */}
                </div>
            </section>
        </div>
    </div>
)
```

### ✅ **Dashboard:**
```tsx
const DashboardPage = () => (
    <div className="container-full">
        <div className="container-full-content">
            <div className="section-full">
                <h1>Dashboard</h1>
            </div>
            <section className="section-full">
                <div className="grid-cards">
                    {/* Cards de estatísticas */}
                </div>
            </section>
        </div>
    </div>
)
```

### ✅ **Página de Administração:**
```tsx
const AdminPage = () => (
    <div className="container-full">
        <div className="container-full-content">
            <div className="section-full">
                <h1>Administração</h1>
            </div>
            <section className="section-full">
                {/* Tabelas, formulários */}
            </section>
        </div>
    </div>
)
```

---

## 🎯 **Vantagens**

### ✅ **Reutilização:**
- Classes padronizadas para todas as páginas
- Configuração centralizada no CSS
- Fácil manutenção

### ✅ **Responsividade:**
- Breakpoints automáticos
- Padding adaptativo
- Espaçamento consistente

### ✅ **Produtividade:**
- 3 classes vs 8+ classes Tailwind
- Código mais limpo
- Padrão consistente

---

## 🔄 **Migração**

### ❌ **Antes (Manual):**
```tsx
<div className="w-full min-h-screen p-4 lg:p-6 xl:p-8">
    <div className="max-w-none w-full">
        <div className="mb-6 lg:mb-8">
            {/* Conteúdo */}
        </div>
    </div>
</div>
```

### ✅ **Depois (Classes do Sistema):**
```tsx
<div className="container-full">
    <div className="container-full-content">
        <div className="section-full">
            {/* Conteúdo */}
        </div>
    </div>
</div>
```

**Resultado:** Mesmo visual, 60% menos código, mais manutenível! 🎉
