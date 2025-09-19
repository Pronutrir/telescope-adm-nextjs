# 📊 Monitor de Sinais Vitais - Webhook

Uma página pública para monitoramento em tempo real de sinais vitais via SignalR WebSocket.

## 🎯 **Funcionalidades**

### ✅ **Conexão SignalR em Tempo Real**
- Conecta automaticamente ao hub: `https://servicesapp.pronutrir.com.br/apitasy/notify-hub`
- Reconexão automática em caso de perda de conexão
- Indicador visual de status da conexão
- Botão manual de reconexão

### ✅ **Recebimento de Dados Inteligente**
- Escuta múltiplos tipos de mensagem: `ReceiveMessage`, `receivemessage`, `SinaisVitais`, etc.
- **Tratamento inteligente de dados**: Diferencia entre IDs de conexão, strings simples e dados JSON válidos
- **Filtro de dados**: Processa apenas dados que correspondem à estrutura de sinais vitais
- Remove duplicatas baseadas em `nR_SEQUENCIA`
- Ordena por data mais recente

### ✅ **Interface Visual**
- Cards animados com dados dos sinais vitais
- Classificação por criticidade (Alto/Médio/Baixo)
- Cores dinâmicas baseadas na criticidade
- Layout responsivo

### ✅ **Logs de Conexão**
- Histórico de eventos da conexão
- Timestamps de todas as ações
- Interface estilo terminal

## 🚀 **Como Usar**

### **1. Acessar a Página**
```
http://localhost:3000/webhook-monitor
```

### **2. Testar com Simulador**
```bash
node test-webhook-simulator.js
```

### **3. Dados Esperados**
```json
[
  {
    "nR_SEQUENCIA": 166144,
    "dT_SINAL_VITAL": "2023-05-11T15:33:54",
    "qT_SATURACAO_O2": 80,
    "qT_TEMP": 36.9,
    "qT_PESO": 109.6,
    "qT_ALTURA_CM": 160,
    "diferencaPercentual": 0,
    "alteracaoMaior10": false
  }
]
```

## 🎨 **Classificação de Criticidade**

### 🔴 **Alto Risco**
- `alteracaoMaior10 = true`
- `qT_SATURACAO_O2 < 90`
- `qT_TEMP > 38.5°C`

### 🟡 **Médio Risco**
- `diferencaPercentual > 5%`
- `qT_SATURACAO_O2 < 95`
- `qT_TEMP > 37.5°C`

### 🔵 **Baixo Risco**
- Todos os outros casos

## 📡 **Métodos SignalR Suportados**

A página escuta os seguintes métodos:
- `ReceiveMessage`
- `receivemessage`
- `receiveMessage`
- `SinaisVitais`
- `sinaisvitais`
- `DataUpdate`
- `dataupdate`

## 🔧 **Configuração**

### **Rota Pública**
A rota `/webhook-monitor` está configurada como pública no `middleware.ts` e não requer autenticação.

### **Dependências**
- `@microsoft/signalr`
- `@mui/material`
- `framer-motion`
- `moment`
- `lucide-react`

## 🧪 **Scripts de Teste**

### **1. test-webhook-simulator.js**
Simula o envio de dados de sinais vitais para testar a página.

### **2. test-aguardar-mensagens.js**
Script Node.js para conectar e aguardar mensagens do hub.

## 🔍 **Logs e Debug**

### **Logs Disponíveis**
- ✅ Status de conexão
- 📨 Mensagens recebidas
- ❌ Erros de conexão
- 🔄 Tentativas de reconexão

### **Debug Console**
Abra o DevTools do navegador para ver logs detalhados da conexão SignalR.

## 📋 **Estrutura dos Dados**

```typescript
interface ISinalVital {
  nR_SEQUENCIA: number
  dT_SINAL_VITAL: string
  qT_SATURACAO_O2: number
  qT_TEMP: number
  qT_PESO: number
  qT_ALTURA_CM: number
  diferencaPercentual: number
  alteracaoMaior10: boolean
}
```

## 🎯 **Próximos Passos**

1. **Filtros Avançados**: Adicionar filtros por tipo de criticidade
2. **Histórico**: Salvar dados em localStorage ou banco
3. **Notificações**: Alertas sonoros para casos críticos
4. **Export**: Exportar dados para CSV/Excel
5. **Gráficos**: Visualizações em tempo real dos dados

## 🚨 **Notas Importantes**

- A página funciona apenas com conexão ativa ao SignalR Hub
- Os dados são mantidos apenas na memória (perdidos ao recarregar)
- Máximo de 100 registros são mantidos para performance
- A página se reconecta automaticamente em caso de perda de conexão
