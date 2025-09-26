# 🚀 Pipeline CI/CD - Telescope ADM

Este documento explica como usar o pipeline CI/CD configurado para o projeto Telescope ADM.

## 📋 Visão Geral

O pipeline CI/CD foi projetado para garantir qualidade, segurança e confiabilidade em todos os deploys:

```
🔄 Pipeline Flow
├── 🔍 Quality Checks (ESLint, Prettier, TypeScript)
├── 🔒 Security Scan (NPM Audit, Dependency Review)
├── 🔴 Redis Tests (Conectividade e Performance)
├── 🧪 Unit Tests (Jest com Coverage)
├── 🏗️ Build & Package (Next.js + Artifacts)
├── 🐳 Docker Build (Container Registry)
├── 🚀 Deploy Staging (Automático)
└── 📢 Notifications (Status + Reports)
```

## 🎯 Workflows Configurados

### **1. Workflow Principal (`ci-cd.yml`)**

**Triggers:**
- Push para `main`, `master`, `develop`
- Pull Requests para `main`, `master`

**Jobs Executados:**
- ✅ **Quality** - ESLint, Prettier, TypeScript (2 min)
- ✅ **Security** - NPM Audit, Dependency Review (3 min)
- ✅ **Redis Tests** - Conectividade local/produção (2 min)
- ✅ **Unit Tests** - Jest com coverage report (5 min)
- ✅ **Build** - Next.js build + artifacts (5 min)
- ✅ **Docker** - Container build + push (7 min)
- ✅ **Deploy Staging** - Deploy automático (10 min)
- ✅ **Notifications** - Status summary (1 min)

**Tempo Total:** ~15-20 minutos (jobs paralelos)

## 🔧 Configuração Inicial

### **1. Verificar Pré-requisitos**

```bash
# Verificar se tudo está configurado
npm run ci:check

# Deve retornar: ✅ Configuração perfeita! Pipeline pronto para uso.
```

### **2. Configurar GitHub Secrets**

Acesse `Settings > Secrets and variables > Actions` e adicione:

```bash
# Redis Configuration
REDIS_HOST_STAGING=seu-redis-staging.com
REDIS_HOST_PRODUCTION=seu-redis-prod.com
REDIS_PASSWORD_STAGING=senha-staging
REDIS_PASSWORD_PRODUCTION=senha-producao

# Docker Registry (se usando registry privado)
DOCKER_REGISTRY_TOKEN=seu-token
DOCKER_REGISTRY_USER=seu-usuario

# Deploy Configuration
DEPLOY_SSH_KEY=sua-chave-ssh-privada
DEPLOY_HOST_STAGING=staging.telescope.com
DEPLOY_HOST_PRODUCTION=telescope.com

# Notifications (opcional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

### **3. Configurar Branch Protection**

Acesse `Settings > Branches > Add rule`:

**Branch name pattern:** `main` (ou `master`)

**Proteções obrigatórias:**
- ✅ Require pull request before merging
- ✅ Require approvals (1)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**Status checks obrigatórios:**
- `quality`
- `security`
- `redis-tests`
- `unit-tests`
- `build`

### **4. Configurar Environments**

**Staging Environment:**
- Protection rules: None (deploy automático)
- Secrets: `REDIS_HOST_STAGING`, `REDIS_PASSWORD_STAGING`

**Production Environment:**
- Protection rules: Required reviewers (você)
- Wait timer: 0 minutes
- Secrets: `REDIS_HOST_PRODUCTION`, `REDIS_PASSWORD_PRODUCTION`

## 🚀 Como Usar

### **Desenvolvimento Normal**

1. **Criar branch feature:**
```bash
git checkout -b feature/nova-funcionalidade
# Desenvolver...
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

2. **Abrir Pull Request:**
- Pipeline executa automaticamente
- Todos os testes devem passar
- Code review obrigatório

3. **Merge para main:**
- Deploy automático para staging
- Testes de saúde executados

### **Deploy para Produção**

1. **Branch main deve estar estável**
2. **Acesse Actions > Deploy Production**
3. **Aprovação manual necessária**
4. **Deploy executado automaticamente**

### **Comandos Úteis**

```bash
# Verificar configuração do pipeline
npm run ci:check

# Executar testes localmente (mesmo que CI)
npm run lint                 # ESLint
npm run test:redis:all       # Testes Redis
npm test                     # Unit tests
npm run build                # Build

# Verificar formatação
npx prettier --check "src/**/*.{ts,tsx}"
npx prettier --write "src/**/*.{ts,tsx}"
```

## 📊 Monitoramento

### **GitHub Actions**
- **Actions tab** - Histórico de execuções
- **Status badges** - Status em tempo real
- **Artifacts** - Downloads de builds e reports

### **Artifacts Gerados**
- `build-artifacts` - Build do Next.js (5 dias)
- `coverage-report` - Relatório de cobertura
- `security-report` - Relatório de segurança
- `quality-report` - Relatório de qualidade (se falhar)

### **Notificações**
- **GitHub** - Status do pipeline em PRs
- **Email** - Falhas em deploys
- **Slack/Teams** - Integração opcional

## 🐛 Troubleshooting

### **❌ Quality Check Failed**
```bash
# Corrigir formatação
npm run lint -- --fix
npx prettier --write "src/**/*.{ts,tsx}"

# Verificar TypeScript
npx tsc --noEmit
```

### **❌ Redis Tests Failed**
```bash
# Testar localmente
npm run test:redis:local
npm run redis:config

# Verificar configurações
cat .env.local | grep REDIS
```

### **❌ Unit Tests Failed**
```bash
# Executar testes localmente
npm test

# Com coverage
npm test -- --coverage
```

### **❌ Build Failed**
```bash
# Testar build local
npm run build

# Verificar logs
cat .next/trace
```

### **❌ Deploy Failed**
- Verificar secrets do GitHub
- Verificar conectividade SSH
- Verificar logs do deployment

## 📈 Métricas e Reports

### **Coverage Report**
- Disponível como artifact após cada build
- Comment automático em PRs
- Mínimo recomendado: 80%

### **Bundle Analysis**
- Executado em PRs
- Identifica aumentos significativos
- Recomendações de otimização

### **Security Report**
- NPM audit results
- Dependency vulnerability scan
- SARIF reports para GitHub Security

## 🔄 Evolução do Pipeline

### **Próximas Implementações**
- [ ] E2E Tests (Playwright)
- [ ] Performance Testing
- [ ] Lighthouse CI
- [ ] Multi-environment testing
- [ ] Rollback automático
- [ ] A/B Testing support

### **Personalizações Possíveis**
- Modificar `timeout-minutes` para jobs específicos
- Adicionar novos environments
- Integrar ferramentas de monitoramento
- Configurar deploy strategies (blue-green, canary)

## ✅ Status Atual

```
🎯 Pipeline Status: ✅ ATIVO
📊 Cobertura: Em implementação
🔒 Segurança: ✅ Configurada
🚀 Deploy: ✅ Automático (staging)
📱 Monitoramento: ✅ Básico
```

**🎉 Pipeline pronto para uso em produção!**

---

Para dúvidas ou sugestões, consulte a [documentação completa](CI-CD-CONFIG.md) ou abra uma issue.