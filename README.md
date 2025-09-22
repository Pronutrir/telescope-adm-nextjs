# 🔭 Telescope ADM - Next.js

Sistema administrativo moderno desenvolvido em **Next.js 15** com **React 19** e **Tailwind CSS**.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **React**: 19.x
- **UI**: Tailwind CSS (glassmorphism design)
- **TypeScript**: Full type safety
- **Authentication**: JWT + Refresh Token
- **HTTP Client**: Axios com interceptors
- **State Management**: Context API + useReducer
- **Forms**: Formik + Yup validation

## 📦 Instalação

```bash
# Clone o repositório
git clone <repo-url>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🔐 Sistema de Autenticação

Sistema completo de autenticação com:

- ✅ Login com validação
- ✅ Alteração de senha obrigatória
- ✅ Middleware de proteção de rotas
- ✅ Gerenciamento automático de tokens
- ✅ Server-side API routes (evita CORS)
- ✅ Interceptors automáticos do Axios
- ✅ Debug tools integradas

### 📚 Documentação Detalhada
- [**AUTHENTICATION.md**](./AUTHENTICATION.md) - Documentação completa
- [**AUTH-QUICK-REFERENCE.md**](./AUTH-QUICK-REFERENCE.md) - Referência rápida

## 🌐 URLs da Aplicação

- **Login**: `http://localhost:3000/auth/login`
- **Recovery**: `http://localhost:3000/auth/recovery`
- **Test Page**: `http://localhost:3000/test`
- **Admin**: `http://localhost:3000/admin` (em desenvolvimento)

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run type-check   # Verificação de tipos TypeScript
```

## 📁 Estrutura do Projeto

```
src/
├── app/                      # App Router (Next.js 13+)
│   ├── auth/                # Páginas de autenticação
│   ├── test/                # Página de teste/debug
│   ├── admin/               # Área administrativa
│   └── api/                 # API Routes (Server-side)
├── components/              # Componentes reutilizáveis
├── contexts/                # Context providers
├── services/                # Clientes de API
├── lib/                     # Utilitários e configurações
├── hooks/                   # Custom hooks
└── types/                   # Interfaces TypeScript
```

## 🔧 Configuração de Ambiente

```bash
# .env.local - Configurações básicas (exemplo)
# Use TLS seguro por padrão. Para desenvolvimento local que requer TLS inseguro,
# habilite explicitamente DEV_ALLOW_INSECURE_TLS e NUNCA em produção.
# DEV_ALLOW_INSECURE_TLS=1

# Token de autenticação para API Pronutrir (necessário para webhook monitor)
PRONUTRIR_API_TOKEN=seu_token_aqui
```

### 🔐 API Pronutrir - Autenticação Automática

O **Webhook Monitor** utiliza as APIs da Pronutrir que requerem autenticação. O sistema **obtém o token automaticamente** usando as credenciais já configuradas do UserShield:

1. **Credenciais utilizadas** (já configuradas):
   ```bash
   # .env.local - Credenciais existentes do UserShield
   USERSHIELD_USERNAME="User@ADM#0110"
   USERSHIELD_PASSWORD="5sdt85f215600k008sdfbn$#sd4"
   ```

2. **Sem configuração adicional necessária**:
   - ✅ O sistema usa automaticamente as credenciais do UserShield
   - ✅ Não há duplicação de variáveis de ambiente
   - ✅ Mantém consistência com o resto da aplicação

4. **APIs utilizadas**:
   - **Login**: `https://servicesapp.pronutrir.com.br/usershield/api/v1/Auth/login`
   - **Dados iniciais**: `https://servicesapp.pronutrir.com.br/apitasy/api/v1/SinaisVitaisMonitoracaoGeral/GetAlertaSinaisVitaisPaciente`
   - **SignalR Hub**: `https://servicesapp.pronutrir.com.br/apitasy/notify-hub`

**Funcionamento**:
- ✅ O sistema faz login automaticamente usando username/password
- ✅ Tokens são armazenados em cache por 50 minutos
- ✅ Renovação automática quando necessário
- ✅ Fallback para token manual se preferir

**Nota**: As credenciais do UserShield já configuradas são automaticamente utilizadas.

## 🌍 APIs e Proxy

O projeto está configurado com proxy para as seguintes APIs:

```javascript
/usershield/* → https://servicesapp.pronutrir.com.br/usershield/*
/apitasy/*    → https://servicesapp.pronutrir.com.br/apitasy/*
/notify/*     → https://servicesapp.pronutrir.com.br/notify/*
```

## 🛡️ Proteção de Rotas

### Middleware Automático
- Rotas protegidas: `/admin`, `/test`
- Rotas públicas: `/auth/login`, `/auth/recovery`
- Redirecionamento automático baseado na autenticação

### Hook de Autenticação
```typescript
import { useAuth } from '@/contexts/AuthContext'

const { user, isAuthenticated, login, logout } = useAuth()
```

## 🐛 Debug e Testes

### Página de Teste (`/test`)
Interface completa para debug do sistema de autenticação:
- Status de autenticação
- Dados do usuário
- Tokens (localStorage + cookies)
- Estado da aplicação
- Conectividade das APIs

### Console Logs
O sistema inclui logs detalhados para facilitar o desenvolvimento:
```typescript
console.log('🔐 Auth: Login successful')
console.log('🔄 Auth: Token applied to headers')
console.log('🐛 DEBUG - TestPage:', debugInfo)
```

## 🎨 Design System

### Glassmorphism UI
- **Background**: Gradientes azul/roxo/índigo
- **Cards**: Backdrop blur com transparência
- **Borders**: Bordas sutis com alpha
- **Shadows**: Sombras suaves e profundas
- **Typography**: Montserrat e Rubik fonts

### Responsive Design
- **Mobile First**: Totalmente responsivo
- **Grid System**: CSS Grid e Flexbox
- **Breakpoints**: sm, md, lg, xl (Tailwind)

## 🚦 Status do Projeto

### ✅ Concluído
- [x] Sistema de autenticação completo
- [x] Páginas de login e recovery
- [x] Middleware de proteção
- [x] API routes server-side
- [x] Gerenciamento de tokens
- [x] Debug tools
- [x] Design responsivo

### 🔄 Em Desenvolvimento
- [ ] Área administrativa (`/admin`)
- [ ] Dashboard principal
- [ ] Gestão de usuários
- [ ] Relatórios e analytics

### 📋 Backlog
- [ ] Implementação de refresh token automático
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Docker deployment

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Migração do Projeto Original

Este projeto foi migrado do **telescope-ADM** (React 18 + CRA) para Next.js 15:

### Principais Mudanças
- **Material-UI → Tailwind CSS**: Design system moderno
- **CRA → Next.js**: SSR e App Router
- **Client APIs → Server APIs**: Melhor segurança e CORS
- **localStorage → Dual Storage**: localStorage + cookies
- **Manual routing → Middleware**: Proteção nativa

### Melhorias Implementadas
- TypeScript completo
- Error handling robusto
- Debug tools integradas
- Interceptors automáticos
- Proxy configuration
- Suspense boundaries
- Loading states

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

**Desenvolvido com ❤️ usando Next.js 15 e React 19**
