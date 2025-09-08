# 🚀 Deploy em Produção - Telescope ADM Next.js

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Porta 80 e 443 disponíveis (ou ajustar as portas no docker-compose.yml)
- Certificados SSL (opcional, mas recomendado)

## 🐳 Deploy com Docker Compose

### 1. Preparação dos Arquivos

Copie os seguintes arquivos para o servidor de produção:

```bash
# Arquivos obrigatórios
- docker-compose.yml
- nginx.conf
- .env.production (opcional, variáveis estão no docker-compose.yml)

# Criar diretórios
mkdir -p logs ssl
```

### 2. Configuração SSL (Opcional)

Se você tem certificados SSL, coloque-os na pasta `ssl/`:

```bash
ssl/
├── telescope.crt
└── telescope.key
```

**Ou desabilite HTTPS** comentando o serviço nginx no docker-compose.yml e expondo a aplicação diretamente na porta 80.

### 3. Ajustar Configurações

**No `docker-compose.yml`:**
- Ajuste as variáveis de ambiente conforme necessário
- Modifique as portas se necessário
- Ajuste o nome do domínio no nginx.conf

**No `nginx.conf`:**
- Substitua `telescope.pronutrir.com.br` pelo seu domínio
- Ajuste os caminhos dos certificados SSL

### 4. Executar a Aplicação

```bash
# Baixar a imagem (se não foi buildada localmente)
docker pull pronutrir/telescope-adm-nextjs:latest

# Iniciar os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f telescope-app
```

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
# Parar os serviços
docker-compose down

# Reiniciar apenas a aplicação
docker-compose restart telescope-app

# Atualizar a aplicação
docker-compose pull telescope-app
docker-compose up -d telescope-app

# Ver logs em tempo real
docker-compose logs -f

# Executar shell no container
docker-compose exec telescope-app sh
```

### Verificação de Saúde

```bash
# Health check da aplicação
curl http://localhost:3000/api/health

# Via nginx (se configurado)
curl http://localhost/api/health
```

### Monitoramento

```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Logs por serviço
docker-compose logs telescope-app
docker-compose logs nginx
```

## 🌍 Configuração apenas com Next.js (sem Nginx)

Se você não quiser usar Nginx, pode rodar apenas a aplicação:

```yaml
# docker-compose-simple.yml
version: '3.8'

services:
  telescope-app:
    image: pronutrir/telescope-adm-nextjs:latest
    container_name: telescope-adm-nextjs
    restart: unless-stopped
    ports:
      - "80:3000"  # Expor na porta 80
    environment:
      # ... mesmas variáveis do docker-compose.yml
```

```bash
# Executar
docker-compose -f docker-compose-simple.yml up -d
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Porta em uso:**
   ```bash
   # Verificar quais portas estão em uso
   netstat -tulpn | grep :80
   netstat -tulpn | grep :443
   ```

2. **Problemas de SSL:**
   - Verifique se os certificados estão no caminho correto
   - Teste sem HTTPS primeiro
   - Verifique as permissões dos arquivos de certificado

3. **API não funcionando:**
   ```bash
   # Testar conectividade com a API de PDFs
   curl -v http://20.65.208.119:5656/api/v1/Pdfs
   
   # Health check
   curl http://localhost:3000/api/health
   ```

4. **Container não iniciando:**
   ```bash
   # Ver logs detalhados
   docker-compose logs telescope-app
   
   # Verificar configuração
   docker-compose config
   ```

### Logs e Monitoramento

```bash
# Logs da aplicação
docker-compose logs -f telescope-app

# Logs do nginx
docker-compose logs -f nginx

# Monitorar recursos
docker stats telescope-adm-nextjs
```

## 🔧 Configurações Avançadas

### Backup e Restore

```bash
# Backup dos logs
tar -czf telescope-logs-$(date +%Y%m%d).tar.gz logs/

# Backup da configuração
tar -czf telescope-config-$(date +%Y%m%d).tar.gz docker-compose.yml nginx.conf .env.production
```

### Escalonamento

Para múltiplas instâncias da aplicação:

```yaml
# No docker-compose.yml
services:
  telescope-app:
    # ... configurações existentes
    deploy:
      replicas: 3
```

### Atualizações

```bash
# Atualização sem downtime
docker-compose pull telescope-app
docker-compose up -d --no-deps telescope-app
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs: `docker-compose logs`
2. Teste o health check: `curl http://localhost:3000/api/health`
3. Verifique a conectividade com as APIs externas
