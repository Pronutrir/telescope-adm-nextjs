# 🔴 Documentação de Testes Redis
# Health check contínuo
npm run redis:health

# Monitoramento contínuo (30s intervalos)
npm run redis:monitor

# Verificar configurações carregadas
npm run redis:config
```documentação explica como usar o sistema de testes Redis implementado no projeto telescope-adm-nextjs.

## 📋 Visão Geral

O sistema de testes Redis foi criado para validar a conectividade e funcionalidade dos ambientes Redis (local e produção) utilizados pela aplicação.

### 🎯 Ambientes Configurados (via Variáveis de Ambiente)

#### 🏠 **Ambiente LOCAL**
- **Host:** `REDIS_LOCAL_HOST` (padrão: 13.65.197.121)
- **Porta:** `REDIS_LOCAL_PORT` (padrão: 6379)
- **Senha:** `REDIS_LOCAL_PASSWORD` (padrão: vazio)
- **Database:** `REDIS_LOCAL_DB` (padrão: 0)

#### 🏭 **Ambiente PRODUÇÃO**
- **Host:** `REDIS_PROD_HOST` (padrão: 10.0.0.7)
- **Porta:** `REDIS_PROD_PORT` (padrão: 6379)
- **Senha:** `REDIS_PROD_PASSWORD` (padrão: vazio)
- **Database:** `REDIS_PROD_DB` (padrão: 0)

## 🚀 Como Executar os Testes

### 📦 NPM Scripts (Recomendado)

```bash
# Testar apenas ambiente local
npm run test:redis:local

# Testar apenas ambiente produção
npm run test:redis:prod

# Testar ambos os ambientes
npm run test:redis:all

# Health check único
npm run redis:health

# Monitoramento contínuo (30s intervalos)
npm run redis:monitor
```

### 🔧 Execução Manual

```bash
# Teste específico de ambiente
npx tsx scripts/test-redis.ts local
npx tsx scripts/test-redis.ts production  
npx tsx scripts/test-redis.ts both

# Health check
npx tsx scripts/redis-health-check.ts once
npx tsx scripts/redis-health-check.ts monitor
npx tsx scripts/redis-health-check.ts monitor 60  # Intervalo de 60s
```

### 🧪 Testes Automatizados (Jest)

```bash
# Executar todos os testes
npm test tests/redis.test.ts

# Com relatório de cobertura
npm test -- --coverage tests/redis.test.ts

# Modo watch
npm test -- --watch tests/redis.test.ts
```

## 🔍 O Que é Testado

### ✅ **Testes de Conectividade**
- Estabelecimento de conexão TCP
- Autenticação (se necessária)
- Seleção de database
- Medição de latência de conexão

### ✅ **Operações Básicas**
- **SET**: Inserção de dados com TTL
- **GET**: Recuperação de dados
- **TTL**: Verificação de expiração
- **DEL**: Remoção de dados

### ✅ **Testes de Performance**
- Latência de cada operação
- Cálculo de médias, mínimo e máximo
- Identificação de gargalos

### ✅ **Limpeza de Dados**
- Remoção automática de dados de teste
- Não interfere com dados de produção

## 📊 Interpretando os Resultados

### 🎉 **Saída de Sucesso**
```
🔍 Testando Redis - LOCAL (13.65.197.121:6379)
✅ Conexão estabelecida com sucesso - Latência: 5ms
✅ Operação SET realizada - Latência: 3ms
✅ Operação GET realizada - Latência: 2ms
✅ TTL configurado corretamente - Tempo restante: 59s
✅ Operação DELETE realizada - Latência: 4ms
📊 Performance: Média 3.5ms | Min: 2ms | Max: 5ms
🎉 Todos os testes passaram para LOCAL!
```

### ❌ **Saída de Erro**
```
🔍 Testando Redis - PRODUÇÃO (10.0.0.7:6379)
❌ Falha na conexão com PRODUÇÃO: connect ETIMEDOUT 10.0.0.7:6379
```

### 📋 **Relatório Completo**
```
📋 RELATÓRIO DE TESTES REDIS
==================================================

1. LOCAL
   Host: 13.65.197.121:6379
   Status: ✅ SUCESSO
   Conexão: ✅ 8ms
   Performance: Média 5ms (2-12ms)

2. PRODUÇÃO  
   Host: 10.0.0.7:6379
   Status: ❌ FALHOU
   Conexão: ❌ connect ETIMEDOUT

📊 RESUMO: 1/2 ambientes funcionando
⚠️  Alguns ambientes precisam de atenção.
```

## 🏥 Health Check Contínuo

O health check monitora continuamente a saúde dos ambientes Redis:

```bash
# Monitoramento a cada 30 segundos
npm run redis:monitor

# Monitoramento personalizado (60 segundos)
npx tsx scripts/redis-health-check.ts monitor 60
```

### 📺 **Saída do Health Check**
```
🏥 Health Check Redis - 25/09/2025 14:30:15
==================================================
LOCAL      ✅ SAUDÁVEL | Perf: 4ms
PRODUÇÃO   ❌ PROBLEMÁTICO | Erro: connect ETIMEDOUT

📊 RESUMO DO HEALTH CHECK:
   Ambientes saudáveis: 1/2 (50%)
   Status Geral: 🟡 PARCIALMENTE OK
```

## 🔧 Configuração e Personalização

### 📁 **Arquivos de Configuração**

- **`src/config/environment.ts`**: Utilitários para carregar variáveis de ambiente
- **`src/config/redis-environments.ts`**: Configurações dos ambientes (baseadas em env vars)
- **`src/tests/redis-validator.ts`**: Lógica de validação  
- **`scripts/test-redis.ts`**: Script de linha de comando
- **`scripts/redis-health-check.ts`**: Health check
- **`tests/redis.test.ts`**: Testes automatizados Jest
- **`.env.local`**: Configurações de desenvolvimento
- **`.env.production`**: Configurações de produção
- **`.env.example`**: Template de configuração

### 🌍 **Configuração de Variáveis de Ambiente**

O sistema agora usa variáveis de ambiente para máxima flexibilidade:

#### **Variáveis Obrigatórias:**
```bash
# Ambiente Local
REDIS_LOCAL_HOST=13.65.197.121
REDIS_LOCAL_PORT=6379
REDIS_LOCAL_PASSWORD=
REDIS_LOCAL_DB=0

# Ambiente Produção
REDIS_PROD_HOST=10.0.0.7
REDIS_PROD_PORT=6379
REDIS_PROD_PASSWORD=
REDIS_PROD_DB=0
```

#### **Arquivos de Ambiente por NODE_ENV:**
- **`development`** → `.env.local`
- **`production`** → `.env.production`
- **`test`** → `.env.test`

### ⚙️ **Modificando Configurações**

Para alterar as configurações dos ambientes, edite o arquivo `.env` apropriado:

**Para desenvolvimento (`.env.local`):**
```bash
# Redis Configuration - LOCAL (Desenvolvimento)
REDIS_LOCAL_HOST=seu-redis-local.com
REDIS_LOCAL_PORT=6379
REDIS_LOCAL_PASSWORD=sua-senha-local
REDIS_LOCAL_DB=0

# Redis Configuration - PRODUÇÃO
REDIS_PROD_HOST=seu-redis-prod.com
REDIS_PROD_PORT=6379
REDIS_PROD_PASSWORD=sua-senha-prod
REDIS_PROD_DB=0
```

**Para produção (`.env.production`):**
```bash
# Redis Configuration - PRODUÇÃO (Ativo)
REDIS_PROD_HOST=redis-prod.exemplo.com
REDIS_PROD_PORT=6380
REDIS_PROD_PASSWORD=senha-super-segura
REDIS_PROD_DB=1
```

### 🔐 **Adicionando Autenticação**

Para adicionar senha, configure as variáveis de ambiente:

```bash
# No arquivo .env.local ou .env.production
REDIS_LOCAL_PASSWORD=sua-senha-local
REDIS_PROD_PASSWORD=sua-senha-super-segura

# Para TLS/SSL (se necessário)
REDIS_LOCAL_TLS=true
REDIS_PROD_TLS=true
```

## 🚨 Solução de Problemas

### ❌ **"connect ETIMEDOUT"**
- Verifique se o host/porta estão corretos
- Confirme conectividade de rede
- Verifique firewall/security groups

### ❌ **"WRONGPASS invalid username-password pair"**  
- Confirme se a senha está correta
- Verifique se o Redis exige autenticação

### ❌ **"connect ECONNREFUSED"**
- Verifique se o serviço Redis está rodando
- Confirme se a porta está correta

### ❌ **"TypeError: a is not a constructor"**
- Execute `npm install` para instalar dependências
- Verifique se o `ioredis` está instalado corretamente

## 📈 Integração com CI/CD

Para usar em pipelines de CI/CD:

```yaml
# GitHub Actions
- name: Test Redis Connectivity
  run: npm run test:redis:all

# Azure DevOps  
- script: npm run test:redis:all
  displayName: 'Test Redis Environments'
```

## 🎯 Exit Codes

- **0**: Todos os testes passaram
- **1**: Algum teste falhou ou erro ocorreu

Isso permite integração fácil com sistemas de monitoramento.

---

## 📞 Suporte

Para dúvidas ou problemas com os testes Redis, consulte:

1. **Logs detalhados**: Execute com verbose para mais informações
2. **Configurações de rede**: Verifique conectividade entre ambientes  
3. **Credenciais**: Confirme usuário/senha se aplicável
4. **Versão Redis**: Verifique compatibilidade da versão

**✅ Sistema pronto para uso!** 🚀