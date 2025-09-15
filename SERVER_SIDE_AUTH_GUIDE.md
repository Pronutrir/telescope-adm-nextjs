# 🛡️ **GUIA DE USO - SERVER-SIDE AUTHENTICATION**

## 📋 **RESUMO**

O sistema agora aceita **qualquer string** no campo de login, não apenas emails válidos. Isso permite maior flexibilidade para diferentes tipos de usuários.

---

## 🔐 **TIPOS DE LOGIN SUPORTADOS**

### **✅ 1. Email Tradicional**
```json
{
  "email": "usuario@empresa.com",
  "password": "senha123"
}
```

### **✅ 2. Username (String Livre)**
```json
{
  "email": "usuario123",
  "password": "senha123"
}
```

### **✅ 3. Códigos/IDs**
```json
{
  "email": "EMP001",
  "password": "senha123"
}
```

### **✅ 4. Nomes com Espaços**
```json
{
  "email": "João Silva",
  "password": "senha123"
}
```

---

## 🧪 **CREDENCIAIS DE TESTE (Desenvolvimento)**

Durante o desenvolvimento, estas credenciais funcionam automaticamente:

### **Administradores:**
- `admin@telescope.com` + qualquer senha
- `admin` + qualquer senha

### **Usuários Padrão:**
- `test@telescope.com` + qualquer senha  
- `usuario123` + qualquer senha
- `user` + qualquer senha
- `teste` + qualquer senha

---

## 📡 **ENDPOINTS DA API**

### **🔐 POST /api/auth/session** (Login)
```bash
curl -X POST http://localhost:3000/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario123","password":"senha123"}'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "user-123",
    "email": "usuario123", 
    "name": "Usuário usuario123",
    "permissions": ["user"]
  }
}
```

### **🚪 DELETE /api/auth/session** (Logout)
```bash
curl -X DELETE http://localhost:3000/api/auth/session \
  -H "Cookie: session_id=xxx"
```

---

## 🎨 **INTERFACE WEB**

### **Página de Login:**
- **URL**: `http://localhost:3000/auth/server-login`
- **Campo Username/Email**: Aceita qualquer string
- **Campo Senha**: Obrigatório, qualquer string

### **Funcionalidades:**
- ✅ Validação em tempo real
- ✅ Feedback visual de loading
- ✅ Mensagens de erro claras
- ✅ Design responsivo
- ✅ Indicadores de segurança

---

## 💾 **DADOS NO REDIS**

### **Estrutura da Sessão:**
```json
{
  "userId": "user-123",
  "email": "usuario123",
  "name": "Usuário usuario123", 
  "permissions": ["user"],
  "ipAddress": "::1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2025-09-15T13:42:26.834Z",
  "lastActivity": "2025-09-15T13:42:26.834Z",
  "expiresAt": "2025-09-15T17:42:26.834Z"
}
```

### **Comandos Úteis:**
```bash
# Ver todas as sessões
docker exec telescope-redis redis-cli KEYS "session:*"

# Ver dados de uma sessão
docker exec telescope-redis redis-cli GET "session:SESSION_ID"

# Contar sessões ativas  
docker exec telescope-redis redis-cli EVAL "return #redis.call('KEYS', 'session:*')" 0

# Limpar todas as sessões
docker exec telescope-redis redis-cli EVAL "for _,k in ipairs(redis.call('KEYS', 'session:*')) do redis.call('DEL', k) end" 0
```

---

## 🔧 **CONFIGURAÇÃO**

### **Variáveis de Ambiente (.env.local):**
```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Session Configuration  
SESSION_DURATION=14400        # 4 horas
SESSION_REFRESH_THRESHOLD=1800 # 30 minutos
MAX_SESSIONS_PER_USER=5

# Security
NODE_ENV=development
SECURE_COOKIES=true
SAME_SITE=strict
```

---

## 🧪 **SCRIPTS DE TESTE**

### **Teste Completo:**
```bash
node scripts/test-auth.js
```

### **Teste Redis:**
```bash
node scripts/test-redis.js
```

### **Monitoramento:**
```bash
# Estatísticas do Redis
docker exec telescope-redis redis-cli INFO memory

# Monitorar comandos em tempo real
docker exec telescope-redis redis-cli MONITOR
```

---

## 🚀 **MIGRAÇÃO PARA PRODUÇÃO**

### **1. Desativar Modo Teste:**
```typescript
// Em src/app/api/auth/session/route.ts
// Remover ou comentar a lógica isTestMode
// Deixar apenas: userShieldAuth = await authenticateWithUserShield(email, password)
```

### **2. Configurar UserShield:**
```env
USERSHIELD_API_URL=https://your-api.com
USERSHIELD_API_KEY=your-api-key
NODE_ENV=production
```

### **3. Redis em Produção:**
```env
REDIS_HOST=your-redis-server
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
```

---

## 📊 **STATUS ATUAL**

- ✅ **Aceita Strings Livres**: Qualquer formato de username
- ✅ **Validação Flexível**: Remove espaços, valida não vazio
- ✅ **Modo Teste**: Credenciais específicas para desenvolvimento
- ✅ **Integração UserShield**: Pronto para produção
- ✅ **Segurança Máxima**: Dados 100% server-side
- ✅ **Interface Amigável**: Campo "Email ou Username"

O sistema está **100% funcional** e aceita qualquer string como identificador de usuário! 🎯
