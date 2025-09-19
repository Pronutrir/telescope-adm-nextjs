# 🩺 Monitor de Sinais Vitais - Webhook

Uma página pública para monitoramento crítico em tempo real de sinais vitais de pacientes via SignalR WebSocket. Interface moderna seguindo o tema da aplicação com design médico profissional.

## 🎯 **Funcionalidades Principais**

### ✅ **Monitoramento de Paciente Completo**
- 👤 **Card principal do paciente** com informações detalhadas
- 📊 **Timeline de sinais vitais** com histórico completo ordenado por data
- 🔄 **Atualização automática** com animações suaves (Framer Motion)
- ⏰ **Timestamp da última atualização** sempre visível

### ✅ **Sistema de Criticidade Avançado**
- 🔴 **CRÍTICO**: Alteração >10%, O2 <85%, Temp >39°C
- 🟡 **ALERTA**: Diferença >7%, O2 <90%, Temp >37.8°C  
- 🔵 **NORMAL**: Valores dentro dos parâmetros esperados
- 🎨 **Cores dinâmicas** e animações baseadas no nível de risco

### ✅ **Interface Médica Profissional**
- 🎨 **Design tema da aplicação**: Gradientes purple/indigo/slate
- 📱 **Layout responsivo** otimizado para monitores médicos
- 🏥 **Cards de sinais vitais** com indicadores visuais claros
- ⚡ **Alertas em tempo real** para alterações significativas

### ✅ **Conexão SignalR Robusta**
- 🔌 **Auto-conexão** ao hub SignalR
- 🔄 **Reconexão automática** em caso de perda
- 📡 **Múltiplos listeners**: `ReceiveMessage`, `PatientData`, `SinaisVitais`, `MonitorData`
- 🛡️ **Validação de dados** automática com tratamento de erros

## 📋 **Estrutura de Dados**

### **Formato Esperado pelo Webhook:**
```json
{
  "cD_PACIENTE": "208439",
  "nM_PACIENTE": "sicrano teste 02", 
  "comparacaoDtos": [
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
}
```

### **TypeScript Interfaces:**
```typescript
interface IPatientData {
    cD_PACIENTE: string        // Código do paciente
    nM_PACIENTE: string        // Nome do paciente
    comparacaoDtos: ISinalVital[]  // Array de sinais vitais
}

interface ISinalVital {
    nR_SEQUENCIA: number          // Sequência única do registro
    dT_SINAL_VITAL: string        // Data/hora da coleta
    qT_SATURACAO_O2: number       // Saturação de oxigênio (%)
    qT_TEMP: number               // Temperatura corporal (°C)  
    qT_PESO: number               // Peso (kg)
    qT_ALTURA_CM: number          // Altura (cm)
    diferencaPercentual: number   // Diferença percentual
    alteracaoMaior10: boolean     // Flag de alteração crítica
}
```

## 🚀 **Como Usar**

### **1. Acessar a Página**
```
http://localhost:3000/webhook-monitor
```
> ✅ Rota pública - não requer autenticação

### **2. Testar com Script**
```bash
node test-patient-data.js
```

### **3. Monitorar em Tempo Real**
- A página conecta automaticamente ao SignalR
- Dados aparecem instantaneamente quando recebidos
- Interface atualiza com animações suaves
- Logs de conexão visíveis na sidebar

## 🧪 **Scripts de Teste**

### **test-patient-data.js** - Script Principal
- Envia dados no formato completo do paciente
- Testa múltiplos métodos SignalR
- Inclui dados com diferentes níveis de criticidade
- Dados realistas com alterações significativas

### **Dados de Teste Incluem:**
- 🚨 **Saturação O2 crítica** (80-88%)
- 🌡️ **Temperatura elevada** (38.5°C) 
- ⚠️ **Alteração >10%** detectada
- 📈 **Diferenças percentuais** variadas

## 🎨 **Design e Tema**

### **Paleta de Cores Médica:**
- **Header**: Gradiente purple-800 → indigo-800 → slate-800
- **Background**: Gradiente slate-900 → purple-900 → slate-900
- **Cards**: Branco com bordas coloridas baseadas na criticidade
- **Alertas**: Sistema de cores padronizado (vermelho/amarelo/azul)

### **Componentes Visuais:**
- 💓 **Ícone Heart** para identificação médica
- 📊 **Grid responsivo** de sinais vitais
- ⏱️ **Timeline visual** com indicadores de status
- 🔔 **Alertas destacados** para alterações críticas

## 🔧 **Configuração Técnica**

### **SignalR Hub:**
```
https://servicesapp.pronutrir.com.br/apitasy/notify-hub
```

### **Métodos Suportados:**
- `ReceiveMessage` - Método padrão
- `PatientData` - Dados específicos do paciente  
- `SinaisVitais` - Sinais vitais diretos
- `MonitorData` - Dados de monitoramento

### **Dependências:**
- `@microsoft/signalr` - Cliente SignalR
- `framer-motion` - Animações
- `moment` - Formatação de datas
- `lucide-react` - Ícones
- `tailwindcss` - Estilos

## 📈 **Níveis de Criticidade**

### 🔴 **CRÍTICO - Intervenção Imediata**
- Saturação O2 < 85%
- Temperatura > 39°C  
- `alteracaoMaior10 = true`
- Diferença percentual > 15%

### 🟡 **ALERTA - Monitoramento Intensivo**
- Saturação O2 < 90%
- Temperatura > 37.8°C
- Diferença percentual > 7%

### 🔵 **NORMAL - Acompanhamento Rotineiro**  
- Todos os parâmetros dentro da normalidade
- Diferença percentual < 7%
- Saturação O2 > 90%

## 🔍 **Recursos de Debug**

### **Logs em Tempo Real:**
- Todas as conexões/desconexões
- Dados recebidos e processados
- Erros de validação
- Status do sistema

### **Informações da Conexão:**
- Connection ID do SignalR
- Status atual da conexão
- Dados do paciente atual
- Número de registros carregados

### **Controles Manuais:**
- 🔄 Botão de reconexão
- 🧹 Limpeza de logs
- 🧪 Simulação de dados de teste

## ⚡ **Performance**

- **Animações otimizadas** com Framer Motion
- **Renderização condicional** para performance
- **Logs limitados** (30 entradas máximo)
- **Auto-limpeza** de dados antigos
- **Lazy loading** de componentes pesados

## 🚨 **Monitoramento Crítico**

Esta página foi projetada para ambiente hospitalar com:
- ⚡ **Resposta instantânea** a mudanças críticas
- 🔔 **Alertas visuais destacados** para emergências  
- 📊 **Dados históricos** para análise de tendências
- 🎯 **Interface focada** na informação essencial
- 🏥 **Design profissional** adequado ao ambiente médico

---

**🏥 Desenvolvido para monitoramento médico profissional com foco na segurança do paciente e resposta rápida a emergências.**
