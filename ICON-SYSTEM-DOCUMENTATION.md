# 📋 Documentação - Sistema de Ícones da Aplicação

## 🎯 Objetivo
Este documento define as diretrizes e padrões para o uso consistente de ícones na aplicação, garantindo especificidade CSS adequada, temas responsivos e manutenibilidade.

## 📐 Arquitetura do Sistema

### 1. **Hierarquia de Especificidade CSS**
O sistema usa diferentes níveis de especificidade para garantir que os estilos sejam aplicados corretamente:

```css
/* Nível 1: Padrão Global (menor especificidade) */
svg[data-lucide] { ... }

/* Nível 2: Exceções por Atributo */
svg[data-lucide="icon-name"] { ... }

/* Nível 3: Classes Específicas (maior especificidade) */
svg.component-icon { ... }
```

### 2. **Estrutura de Themes**
Todos os ícones suportam tema light/dark automaticamente:

```css
/* Light Theme */
svg.icon-class { stroke: #374151; }

/* Dark Theme */  
.dark svg.icon-class { stroke: #d1d5db; }
```

## 🎨 Categorias de Ícones

### **1. Ícones Globais (Padrão)**
**Localização:** Aplicado automaticamente a todos os ícones Lucide

```css
svg[data-lucide] {
  stroke: #374151 !important;        /* Gray-700 (light) */
  fill: none !important;
  stroke-width: 1.5 !important;
  transition: all 0.2s ease-in-out;
}

.dark svg[data-lucide] {
  stroke: #d1d5db !important;        /* Gray-300 (dark) */
}
```

**Uso:** Automático - não requer configuração adicional

---

### **2. Ícones do Navbar**
**Classes:** `.navbar-bell-icon`, `.navbar-message-icon`, `.navbar-settings-icon`, `.navbar-search-icon`

**Características:**
- Maior especificidade: `svg.navbar-*-icon`
- Fill personalizado para melhor visibilidade
- Cores específicas para cada tema

```tsx
// ✅ Correto
<Bell className="w-5 h-5 navbar-bell-icon" />
<Search className="w-4 h-4 navbar-search-icon" />

// ❌ Incorreto  
<Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
```

**Estilos CSS:**
```css
/* Light Theme */
svg.navbar-bell-icon,
svg.navbar-message-icon,
svg.navbar-settings-icon,
svg.navbar-search-icon {
  stroke: #374151 !important;
  fill: #f3f4f6 !important;
  stroke-width: 1.5 !important;
}

/* Dark Theme */
.dark svg.navbar-bell-icon,
.dark svg.navbar-message-icon,
.dark svg.navbar-settings-icon,
.dark svg.navbar-search-icon {
  stroke: #d1d5db !important;
  fill: #374151 !important;
}
```

---

### **3. Ícones do Sidebar**
**Classes:** `.sidebar-icon`

**Estados:**
- **Padrão:** Gray-500 (light) / Gray-400 (dark)
- **Hover:** Gray-900 (light) / Gray-50 (dark)  
- **Ativo:** Blue-600 (light) / Blue-400 (dark)

```tsx
// ✅ Correto
<BarChart3 className="w-5 h-5 sidebar-icon" />

// ❌ Incorreto
<BarChart3 className="w-5 h-5 text-gray-500" />
```

---

### **4. Ícones do Dashboard**
**Classes:** `.dashboard-*-icon`

**Variações Disponíveis:**
- `.dashboard-icon` - Cor atual do contexto
- `.dashboard-wifi-icon` - Verde (#22c55e)
- `.dashboard-wifi-off-icon` - Vermelho (#ef4444)
- `.dashboard-alert-icon` - Vermelho (#ef4444)  
- `.dashboard-refresh-icon` - Cor atual (mantém animação spin)

```tsx
// ✅ Correto
<Wifi className="w-6 h-6 dashboard-wifi-icon" />
<WifiOff className="w-6 h-6 dashboard-wifi-off-icon" />
<AlertCircle className="w-5 h-5 dashboard-alert-icon" />
<RefreshCw className="w-4 h-4 dashboard-refresh-icon animate-spin" />

// ❌ Incorreto
<Wifi className="w-6 h-6 text-green-500" />
```

---

### **5. Ícones de Componentes**
**Classes:** `.button-icon`, `.stats-card-icon`

**Características:**
- Usam `currentColor` para herdar a cor do contexto
- Adaptam-se automaticamente ao estilo do componente pai

```tsx
// ✅ Correto - Em Buttons
<Button>
  <Save className="w-4 h-4 button-icon" />
  Salvar
</Button>

// ✅ Correto - Em StatsCards  
<StatsCard>
  <Users className="w-8 h-8 stats-card-icon" />
</StatsCard>
```

---

### **6. Ícones Específicos**
**Classes:** `.pdf-icon`, `.pdf-file-icon`

**Características:**
- Contexto específico (ex: manipulação de PDFs)
- Cores e fills customizados para o domínio

```tsx
// ✅ Correto
<FileText className="w-5 h-5 pdf-icon" />
<File className="w-6 h-6 pdf-file-icon" />
```

## 🔧 Como Implementar Novos Ícones

### **Passo 1: Identificar o Contexto**
Determine em qual categoria o ícone se encaixa:
- Navbar → `.navbar-*-icon`
- Sidebar → `.sidebar-icon`
- Dashboard → `.dashboard-*-icon`
- Componente → `.button-icon` / `.stats-card-icon`
- Específico → `.custom-icon`

### **Passo 2: Criar a Classe CSS**
Adicione no `src/app/globals.css` com alta especificidade:

```css
/* Light Theme */
svg.my-custom-icon {
  stroke: #your-color !important;
  fill: none !important; /* ou cor específica se precisar */
  stroke-width: 1.5 !important;
}

/* Dark Theme */
.dark svg.my-custom-icon {
  stroke: #your-dark-color !important;
  fill: none !important;
}
```

### **Passo 3: Aplicar no Componente**
```tsx
<MyIcon className="w-5 h-5 my-custom-icon" />
```

### **Passo 4: Adicionar Fill (se necessário)**
Se o ícone precisar de preenchimento, adicione às exceções:

```css
svg[data-lucide="my-icon"] {
  fill: #f9fafb !important;
}

.dark svg[data-lucide="my-icon"] {
  fill: #374151 !important;
}
```

## 📝 Boas Práticas

### **✅ Fazer:**
1. **Usar classes CSS específicas** em vez de Tailwind inline
2. **Manter consistência** no stroke-width (1.5)
3. **Implementar dark theme** para todas as classes
4. **Usar currentColor** quando apropriado
5. **Documentar** novas classes criadas

### **❌ Evitar:**
1. **Classes Tailwind inline** para cores (`text-gray-500`)
2. **Misturar especificidades** diferentes no mesmo contexto
3. **Esquecer o dark theme**
4. **Usar !important** desnecessariamente (apenas quando conflito com globals)
5. **Criar muitas classes específicas** para um mesmo contexto

## 🎯 Cores Padrão do Sistema

### **Light Theme:**
- **Texto Principal:** `#374151` (Gray-700)
- **Texto Secundário:** `#6b7280` (Gray-500)
- **Fill Claro:** `#f9fafb` (Gray-50)
- **Fill Médio:** `#f3f4f6` (Gray-100)

### **Dark Theme:**
- **Texto Principal:** `#d1d5db` (Gray-300)
- **Texto Secundário:** `#9ca3af` (Gray-400)  
- **Fill Escuro:** `#374151` (Gray-700)
- **Fill Médio:** `#4b5563` (Gray-600)

### **Cores de Status:**
- **Sucesso:** `#22c55e` (Green-500)
- **Erro:** `#ef4444` (Red-500)
- **Aviso:** `#f59e0b` (Amber-500)
- **Info:** `#3b82f6` (Blue-500)

## 📖 Exemplos de Uso

### **Navbar Icons:**
```tsx
const Navbar = () => (
  <nav>
    <Bell className="w-5 h-5 navbar-bell-icon" />
    <MessageSquare className="w-5 h-5 navbar-message-icon" />
    <Settings className="w-5 h-5 navbar-settings-icon" />
    <Search className="w-4 h-4 navbar-search-icon" />
  </nav>
)
```

### **Dashboard Icons:**
```tsx
const Dashboard = () => (
  <div>
    <Wifi className="w-6 h-6 dashboard-wifi-icon" />
    <WifiOff className="w-6 h-6 dashboard-wifi-off-icon" />
    <AlertCircle className="w-5 h-5 dashboard-alert-icon" />
    <RefreshCw className="w-4 h-4 dashboard-refresh-icon animate-spin" />
  </div>
)
```

### **Component Icons:**
```tsx
const MyButton = () => (
  <Button variant="primary">
    <Save className="w-4 h-4 button-icon" />
    Salvar
  </Button>
)

const MyCard = () => (
  <StatsCard>
    <Users className="w-8 h-8 stats-card-icon" />
    1,234 Users
  </StatsCard>
)
```

## 🔍 Troubleshooting

### **Problema: Ícone não está com a cor esperada**
**Solução:** Verificar hierarquia de especificidade CSS. Classes específicas (`svg.my-icon`) têm precedência sobre seletores de atributo (`svg[data-lucide]`).

### **Problema: Dark theme não funciona**
**Solução:** Certificar-se de que existe a versão `.dark svg.my-icon` da regra CSS.

### **Problema: Fill não aparece**
**Solução:** Adicionar o ícone às exceções de fill no globals.css.

### **Problema: Ícone muito claro/escuro**
**Solução:** Ajustar as cores usando o sistema de cores padrão da aplicação.

## 📂 Estrutura de Arquivos

```
src/
├── app/
│   └── globals.css          # Configurações CSS dos ícones
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Usa .navbar-*-icon
│   │   └── Sidebar.tsx      # Usa .sidebar-icon
│   └── ui/
│       ├── Button.tsx       # Usa .button-icon
│       └── StatsCard.tsx    # Usa .stats-card-icon
└── pages/
    └── dashboard/
        └── page.tsx         # Usa .dashboard-*-icon
```

## 🔄 Histórico de Versões

### **v1.0 - Agosto 2025**
- ✅ Sistema inicial implementado
- ✅ Classes para Navbar, Sidebar, Dashboard
- ✅ Suporte completo a dark/light theme
- ✅ Especificidade CSS otimizada
- ✅ Componentes Button e StatsCard integrados

---

**📅 Última atualização:** Agosto 2025  
**🔄 Versão:** 1.0  
**✍️ Mantenedor:** Time de Frontend  
**📧 Contato:** dev-team@telescope.com

---

## 🤝 Contribuição

Para contribuir com melhorias neste sistema:

1. **Analise** se sua necessidade se encaixa em uma categoria existente
2. **Proponha** novas classes seguindo o padrão estabelecido
3. **Teste** em ambos os themes (light/dark)
4. **Documente** as mudanças neste arquivo
5. **Valide** a especificidade CSS está correta

**Lembre-se:** Consistência é a chave para um sistema de ícones eficiente!
