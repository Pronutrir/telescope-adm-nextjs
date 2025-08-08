# 🚀 Passo a Passo - Migração do Layout Principal

## 📋 Planejamento Geral

### 🎯 **Objetivo**
Migrar o layout principal da aplicação telescope-ADM (Material-UI) para Next.js com Tailwind CSS, mantendo toda a funcionalidade de navegação e estrutura.

### 🏗️ **Componentes a Migrar**
1. **Layout Principal** (`Admin.tsx`)
2. **Navbar Superior** (`AdminNavbar.js`)
3. **Sidebar Lateral** (`Sidebar.tsx`)
4. **Menu Dropdown** (`NavbarDropdown.js`)
5. **Sistema de Rotas**
6. **Context de Navegação**

---

## 🔄 **FASE 1: Análise e Preparação**

### ✅ **Componentes Identificados:**
- [x] `src/layouts/Admin.tsx` - Layout principal
- [x] `src/components/Navbars/AdminNavbar.js` - Navbar superior
- [x] `src/components/Sidebar/Sidebar.tsx` - Sidebar lateral
- [x] `src/components/Dropdowns/NavbarDropdown.js` - Menu do usuário
- [x] `src/Router/routes.tsx` - Sistema de rotas

### 📊 **Estrutura de Navegação Identificada:**
```typescript
// Menus principais identificados no código original:
- Dashboard
- Gerenciador
- Usuários
- Perfil do Usuário
- Bloqueios
- Médicos Exclusivos
- Avaliações
- NPS (com submenus)
  - Consultas
  - Médicos
  - Tratamentos Novos
  - Recepcionistas
  - Quimio
- Medicine (com submenus)
  - Evolução Médica
  - Agenda Quimioterapia
  - Acompanhantes
  - Escala News
  - Stopwatch
- Quick Queue
- PowerBI/Dashboards
```

---

## 🚀 **FASE 2: Implementação - Estrutura Base**

### **Passo 1: Criar Context de Layout**
- [x] Context para gerenciar estado do sidebar (aberto/fechado)
- [x] Context para gerenciar usuário logado
- [x] Context para notificações do layout

### **Passo 2: Criar Layout Base**
- [x] Layout principal responsivo
- [x] Sistema de grid com sidebar e content
- [x] Responsividade mobile/desktop

### **Passo 3: Implementar Navbar Superior**
- [x] Barra superior fixa
- [x] Toggle do sidebar
- [x] Search box
- [x] Menu do usuário (dropdown)
- [x] Notificações

### **Passo 4: Implementar Sidebar**
- [x] Menu lateral colapsável
- [x] Navegação hierárquica
- [x] Ícones e labels
- [x] Estados ativo/inativo
- [x] Submenus expandíveis

---

## 🎨 **FASE 3: Design System com Tailwind**

### **Passo 5: Design Tokens**
- [ ] Cores da marca
- [ ] Espaçamentos consistentes
- [ ] Tipografia
- [ ] Sombras e bordas
- [ ] Transições e animações

### **Passo 6: Componentes Visuais**
- [ ] Estilo glassmorphism para navbar
- [ ] Sidebar com gradientes
- [ ] Hover states
- [ ] Active states
- [ ] Loading states

---

## 🔗 **FASE 4: Navegação e Rotas**

### **Passo 7: Sistema de Rotas Next.js**
- [ ] Migrar rotas para App Router
- [ ] Páginas placeholder
- [ ] Navegação programática
- [ ] Breadcrumbs

### **Passo 8: Menu de Navegação**
- [ ] Estrutura hierárquica de menus
- [ ] Ícones para cada seção
- [ ] Submenus colapsáveis
- [ ] Busca no menu

---

## 🧪 **FASE 5: Funcionalidades Avançadas**

### **Passo 9: Features do Layout**
- [ ] Search global
- [ ] Notificações em tempo real
- [ ] Perfil do usuário
- [ ] Configurações do layout
- [ ] Modo escuro/claro (futuro)

### **Passo 10: Responsividade**
- [ ] Mobile-first design
- [ ] Menu mobile (hambúrguer)
- [ ] Sidebar overlay em mobile
- [ ] Touch gestures

---

## 🎯 **FASE 6: Integração e Testes**

### **Passo 11: Integração com Auth**
- [ ] Conectar com AuthContext
- [ ] Dados do usuário no layout
- [ ] Logout integrado
- [ ] Proteção de rotas no layout

### **Passo 12: Otimização**
- [ ] Code splitting
- [ ] Lazy loading de menus
- [ ] Performance optimization
- [ ] Accessibility (a11y)

---

## 📋 **Checklist de Execução**

### **Preparação (Hoje)**
- [ ] Analisar componentes originais ✅
- [ ] Definir estrutura de arquivos
- [ ] Criar interfaces TypeScript
- [ ] Setup inicial dos componentes

### **Implementação (Próximos passos)**
- [ ] Layout Context
- [ ] Layout Principal
- [ ] Navbar Superior
- [ ] Sidebar Lateral
- [ ] Sistema de Rotas
- [ ] Integração e Testes

### **Prioridades**
1. **Alto**: Layout base, Navbar, Sidebar
2. **Médio**: Submenus, Search, Responsividade
3. **Baixo**: Notificações, Modo escuro, Features avançadas

---

## 🎨 **Design Preview**

```
┌─────────────────────────────────────────────────────────┐
│ 🔭 Telescope ADM    [🔍 Search...]  [🔔] [👤 User ▼]   │
├─────────────────────────────────────────────────────────┤
│ ≡  │                                                    │
│ 📊 │ Dashboard                    Content Area          │
│ ⚙️ │                                                    │
│ 👥 │                                                    │
│ ⭐ │                                                    │
│ 🏥 │                                                    │
│ 📋 │                                                    │
│ 📊 │                                                    │
│    │                                                    │
└────┴────────────────────────────────────────────────────┘
```

---

Vamos começar com a **Fase 2 - Implementação da Estrutura Base**?
