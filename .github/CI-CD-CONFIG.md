# ================================================
# CONFIGURAÇÃO DE AMBIENTE PARA CI/CD
# ================================================

# Este arquivo define as configurações necessárias
# para o pipeline CI/CD funcionar corretamente

# ===============================================
# GITHUB SECRETS NECESSÁRIOS
# ===============================================

# Para funcionar corretamente, configure os seguintes secrets no GitHub:
# Settings > Secrets and variables > Actions > New repository secret

# 🔴 Redis Configuration
REDIS_HOST_STAGING=seu-redis-staging.com
REDIS_HOST_PRODUCTION=seu-redis-prod.com
REDIS_PASSWORD_STAGING=senha-staging
REDIS_PASSWORD_PRODUCTION=senha-producao

# 🐳 Docker Registry
DOCKER_REGISTRY_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
DOCKER_REGISTRY_USER=seu-usuario

# 🚀 Deploy Configuration  
DEPLOY_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
DEPLOY_HOST_STAGING=staging.telescope.com
DEPLOY_HOST_PRODUCTION=telescope.com
DEPLOY_USER=deploy

# 📢 Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/xxx

# 🔐 Security Tokens
SNYK_TOKEN=xxxxx-xxxxx-xxxxx-xxxxx
SONAR_TOKEN=sqp_xxxxxxxxxxxxxxxxxxxxxx

# ===============================================
# ENVIRONMENT VARIABLES PADRÃO
# ===============================================

# Estas variáveis são definidas automaticamente pelo workflow
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
CI=true

# ===============================================
# CONFIGURAÇÃO DOS AMBIENTES
# ===============================================

# DEVELOPMENT
# - Usa .env.local
# - Redis local (13.65.197.121)
# - Deploy automático desabilitado

# STAGING  
# - Usa variáveis do GitHub Secrets
# - Deploy automático após merge na main
# - Testes completos executados

# PRODUCTION
# - Usa variáveis do GitHub Secrets  
# - Deploy manual com aprovação
# - Monitoramento completo ativo

# ===============================================
# BRANCH PROTECTION RULES RECOMENDADAS
# ===============================================

# Configure no GitHub: Settings > Branches > Add rule

# Branch name pattern: main (ou master)
# ✅ Require a pull request before merging
# ✅ Require approvals (1)
# ✅ Dismiss stale pull request approvals when new commits are pushed
# ✅ Require review from code owners
# ✅ Require status checks to pass before merging
# ✅ Require branches to be up to date before merging
# Status checks required:
#   - quality
#   - security  
#   - redis-tests
#   - unit-tests
#   - build
# ✅ Require conversation resolution before merging
# ✅ Restrict pushes that create files that match certain patterns

# ===============================================
# CONFIGURAÇÃO DE ENVIRONMENTS
# ===============================================

# Configure no GitHub: Settings > Environments

# STAGING Environment:
# - Environment protection rules: None (deploy automático)
# - Environment secrets: REDIS_HOST_STAGING, etc.

# PRODUCTION Environment:  
# - Environment protection rules: Required reviewers (você)
# - Wait timer: 0 minutes
# - Environment secrets: REDIS_HOST_PRODUCTION, etc.

# ===============================================
# MONITORAMENTO RECOMENDADO
# ===============================================

# Para monitoramento completo, integre:
# 1. Sentry (Error tracking)
# 2. DataDog/New Relic (Performance)  
# 3. StatusPage (Status público)
# 4. Slack/Teams (Alertas)

# ===============================================
# COMANDOS ÚTEIS PARA DEBUG
# ===============================================

# Testar workflow localmente:
# gh workflow run ci-cd.yml

# Ver logs do workflow:
# gh run list
# gh run view [RUN_ID]

# Reexecutar workflow:
# gh run rerun [RUN_ID]

# ===============================================
# TROUBLESHOOTING COMUM
# ===============================================

# ❌ Erro: Redis connection timeout
# ✅ Solução: Verificar REDIS_HOST e REDIS_PORT

# ❌ Erro: npm audit failures  
# ✅ Solução: npm audit fix, committar mudanças

# ❌ Erro: Docker build failed
# ✅ Solução: Verificar Dockerfile, dependencies

# ❌ Erro: Deploy permission denied
# ✅ Solução: Verificar DEPLOY_SSH_KEY secret

# ❌ Erro: Tests timeout
# ✅ Solução: Aumentar timeout-minutes no workflow