# 🐌 Problemas de Performance da API PDF SharePoint

## 📊 Diagnóstico

### Problema Identificado
A API externa de PDFs SharePoint (`http://20.65.208.119:5656`) está apresentando lentidão extrema:

```bash
# Teste real executado:
curl -w "Time: %{time_total}s\n" "http://20.65.208.119:5656/api/v1/Pdfs/search?searchTerm=252525&page=1&pageSize=10"

# Resultado:
Time: 75.002827s (TIMEOUT em 75 segundos!)
```

### Sintomas no Frontend
- ❌ "Timeout na busca de PDFs" após 10 segundos
- 🔄 Usuário vê "carregando" mas nada acontece
- 💥 Mensagem de erro "Nenhum PDF encontrado"
- 😰 Aparência de que o sistema "perdeu o usuário"

## 🔧 Soluções Implementadas

### 1. Timeout Aumentado (10s → 90s)

**Antes:**
```typescript
const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s
```

**Depois:**
```typescript
const timeoutId = setTimeout(() => controller.abort(), 90000) // 90s - API externa é lenta
```

**Arquivos alterados:**
- `src/services/pdfManager/pdfManagerService.ts`
- `src/app/api/pdfs/buscar/route.ts`

### 2. Logs de Performance Melhorados

```typescript
const startTime = Date.now()
// ... fetch ...
const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
logger.info(`⏱️ Tempo de resposta: ${elapsed}s`)
```

### 3. Mensagens de Erro Descritivas

**Antes:**
```
"Timeout na busca de PDFs"
```

**Depois:**
```
"Timeout: A busca está demorando muito. A API SharePoint pode estar sobrecarregada."
```

### 4. Status HTTP Correto

- **503** (Service Unavailable): Erro genérico de serviço
- **504** (Gateway Timeout): Timeout específico após 90s

## 🎯 Por que isso acontece?

### Causas Prováveis:

1. **📦 Volume de Dados**: SharePoint com muitos arquivos
2. **🔍 Busca Sem Índice**: API pode não estar indexada corretamente
3. **🌐 Rede**: Latência entre servidor Next.js e API SharePoint
4. **💾 Recursos**: API SharePoint pode estar com poucos recursos (CPU/RAM)
5. **🔐 Autenticação**: Token do SharePoint pode estar expirando e sendo regenerado

## 📈 Recomendações de Melhoria

### Curto Prazo (Implementado)
- ✅ Timeout aumentado para 90s
- ✅ Logs detalhados de performance
- ✅ Mensagens de erro amigáveis
- ✅ Cache no navegador (`cache: 'no-store'` quando necessário)

### Médio Prazo (Recomendado)
- 🔄 **Implementar Cache Redis**: Cachear resultados de buscas frequentes
- 📊 **Paginação Server-Side**: Limitar resultados por página (já implementado: 10-20 itens)
- 🎯 **Busca Incremental**: Carregar primeiros resultados rápido, resto depois
- 💾 **IndexedDB no Frontend**: Cache local de PDFs recentes

### Longo Prazo (Ideal)
- 🚀 **Migrar para API Assíncrona**: Usar webhooks/polling
- 📦 **Implementar ElasticSearch**: Busca full-text indexada
- 🏗️ **Microserviço de Cache**: Camada intermediária entre Next.js e SharePoint
- 📊 **CDN para PDFs**: Armazenar cópias em CDN para download rápido

## 🧪 Como Testar

### Teste de Performance Manual
```bash
# Teste simples
curl -w "\nTempo: %{time_total}s\n" \
  "http://20.65.208.119:5656/api/v1/Pdfs/search?searchTerm=&page=1&pageSize=10"

# Teste com termo específico
curl -w "\nTempo: %{time_total}s\n" \
  "http://20.65.208.119:5656/api/v1/Pdfs/search?searchTerm=159969&page=1&pageSize=10"
```

### Monitoramento no Browser
```javascript
// Abra o DevTools Console e execute:
console.time('pdf-search')
fetch('/api/pdfs/buscar?query=teste&page=1&limit=10')
  .then(() => console.timeEnd('pdf-search'))
```

## 🔍 Debugging

### Logs Importantes
```bash
# Frontend (Browser Console)
🔍 [usePDFManager] Iniciando busca: termo="252525", page=1
⏱️ [PDFManagerService] Tempo de resposta: 75.23s
✅ [PDFManagerService] Busca concluída: 1 itens encontrados

# Backend (Server Logs)
🔍 [PDFs] Buscando PDFs: http://20.65.208.119:5656/api/v1/Pdfs/search?...
⏱️ [PDFs] Tempo de resposta: 75.23s
✅ [PDFs] Busca concluída: 1 itens encontrados
```

## 📞 Contato

Se os problemas persistirem:
1. Verificar logs do servidor SharePoint API
2. Monitorar recursos (CPU/RAM) do servidor `20.65.208.119`
3. Considerar escalar verticalmente (mais recursos) ou horizontalmente (load balancer)
4. Avaliar implementação de cache Redis

---

**Última atualização**: 23 de outubro de 2025  
**Versão do Next.js**: 15.5.6 (Turbopack)
