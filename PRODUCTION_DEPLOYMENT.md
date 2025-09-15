# 🚀 **PRODUCTION DEPLOYMENT CHECKLIST**

## ⚙️ **CONFIGURAÇÃO PRÉ-DEPLOY**

### **1. Atualizar API Endpoint**
```typescript
// src/app/api/auth/session/route.ts
// REMOVER estas linhas para produção:

/*
const isTestMode = process.env.NODE_ENV === 'development'
const testCredentials = [
  { username: 'admin@telescope.com', permissions: ['admin'] },
  { username: 'admin', permissions: ['admin'] },
  { username: 'test@telescope.com', permissions: ['user'] },
  { username: 'usuario123', permissions: ['user'] },
  { username: 'user', permissions: ['user'] },
  { username: 'teste', permissions: ['user'] }
]

if (isTestMode) {
  const testUser = testCredentials.find(u => u.username === email)
  if (testUser) {
    userShieldAuth = {
      success: true,
      user: {
        id: `${testUser.username}-id`,
        email: testUser.username,
        name: `Usuário ${testUser.username}`,
        permissions: testUser.permissions
      }
    }
  }
}
*/

// MANTER apenas:
// const userShieldAuth = await authenticateWithUserShield(email, password)
```

### **2. Variables de Ambiente (.env.production)**
```env
# Redis Configuration
REDIS_HOST=your-production-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-super-secure-redis-password
REDIS_DB=0

# Session Configuration
SESSION_DURATION=14400        # 4 horas
SESSION_REFRESH_THRESHOLD=1800 # 30 minutos  
MAX_SESSIONS_PER_USER=3       # Reduzir para produção

# UserShield API
USERSHIELD_API_URL=https://api.usershield.com/v1/auth
USERSHIELD_API_KEY=your-production-api-key

# Security
NODE_ENV=production
SECURE_COOKIES=true
SAME_SITE=strict
NEXT_PUBLIC_DOMAIN=yourdomain.com
```

---

## 🔒 **CONFIGURAÇÃO DE SEGURANÇA**

### **1. Redis Production Security**
```bash
# redis.conf
requirepass your-super-secure-redis-password
bind 127.0.0.1 ::1
protected-mode yes
port 6379
timeout 300
tcp-keepalive 300
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### **2. Nginx Configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    
    location /api/auth/ {
        limit_req zone=auth burst=3 nodelay;
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🐳 **DOCKER PRODUCTION**

### **1. Dockerfile.production**
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### **2. docker-compose.production.yml**
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    depends_on:
      - redis
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "127.0.0.1:6379:6379"
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  redis_data:
```

---

## 📋 **DEPLOYMENT CHECKLIST**

### **Pré-Deploy:**
- [ ] Remover credenciais de teste do código
- [ ] Configurar variáveis de ambiente de produção
- [ ] Gerar certificados SSL
- [ ] Configurar backup do Redis
- [ ] Configurar monitoramento

### **Deploy:**
- [ ] Build da aplicação: `npm run build`
- [ ] Teste local de produção: `npm start`
- [ ] Deploy via Docker Compose
- [ ] Configurar Nginx/Proxy reverso
- [ ] Configurar domínio e DNS

### **Pós-Deploy:**
- [ ] Testar login com credenciais reais
- [ ] Verificar logs de aplicação
- [ ] Verificar métricas do Redis
- [ ] Testar rate limiting
- [ ] Configurar alertas de monitoramento

---

## 🔍 **MONITORAMENTO**

### **1. Health Checks**
```bash
# API Health
curl -f http://localhost:3000/api/auth/health || exit 1

# Redis Health  
docker exec redis redis-cli ping || exit 1
```

### **2. Métricas Importantes**
- Número de sessões ativas
- Tempo de resposta da API
- Taxa de erro de login
- Uso de memória do Redis
- Taxa de refresh de sessões

### **3. Logs Estruturados**
```typescript
// logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...meta
    }))
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error', 
      message,
      error: error?.message || error
    }))
  }
}
```

---

## 🚨 **TROUBLESHOOTING**

### **Problemas Comuns:**

**1. Redis Connection Failed**
```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Verificar logs do Redis
docker logs redis

# Testar conexão manualmente
telnet redis-host 6379
```

**2. Session Not Found**
```bash
# Verificar chaves no Redis
docker exec redis redis-cli KEYS "session:*"

# Verificar TTL das sessões
docker exec redis redis-cli TTL "session:SESSION_ID"
```

**3. UserShield API Timeout**
- Verificar conectividade
- Validar API key
- Implementar retry logic
- Configurar timeout adequado

O sistema está pronto para produção! 🎯
