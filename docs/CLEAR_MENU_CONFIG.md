# 🔧 Comandos para Limpar Configurações do Menu

## Problema
Os itens do menu aparecem brevemente e depois desaparecem. Isso ocorre porque há configurações antigas salvas no localStorage com a maioria dos itens marcados como `false` (ocultos).

## Solução Rápida

### Opção 1: Console do Navegador (RECOMENDADO)
Abra o Console do desenvolvedor (F12) e execute:

```javascript
// Limpar completamente as configurações antigas
localStorage.removeItem('menuVisibility')
location.reload()
```

### Opção 2: Restaurar Padrões pelo Console
```javascript
// Definir todos os itens como visíveis
const defaults = {
    'Dashboard': true,
    'Biblioteca de Componentes': true,
    'Biblioteca de PDFs': true,
    'Gerenciador de PDFs': true,
    'Regra Médica': true,
    'Usuários': true,
    'Configurações': true,
    'Planos de Saúde': true,
    'Tipos Sanguíneos': true,
    'Grupos de Usuários': true,
    'Médicos': true,
    'Agendamentos': true,
    'Convênios': true,
    'Emergências': true,
    'Chat': true,
    'Especialidades': true,
    'Perfil de Usuário': true,
    'Cadastro de Usuário': true,
    'Triagens': true,
    'NPS Consulta': true,
    'Seu Perfil': true
}

localStorage.setItem('menuVisibility', JSON.stringify(defaults))
location.reload()
```

### Opção 3: Página HTML Utilitária
1. Acesse: `http://localhost:3000/clear-menu-config.html`
2. Clique em "Restaurar Padrões"
3. Recarregue a página principal

## Verificação
Para ver as configurações atuais:

```javascript
const config = JSON.parse(localStorage.getItem('menuVisibility') || '{}')
const total = Object.keys(config).length
const visible = Object.values(config).filter(v => v === true).length
const hidden = total - visible

console.log(`Total: ${total} itens`)
console.log(`Visíveis: ${visible}`)
console.log(`Ocultos: ${hidden}`)
console.log('Configurações:', config)
```

## O que foi corrigido no código

1. **MenuVisibilityContext.tsx**:
   - Detecção automática de configurações antigas (>30% ocultos)
   - Reset automático para padrões quando detectado
   - Logs detalhados para debug
   - Mesclagem de configurações para preservar customizações válidas

2. **DEFAULT_VISIBILITY**:
   - Agora todos os itens estão `true` por padrão
   - Adicionados itens que estavam faltando

3. **Sidebar.tsx**:
   - Logs de debug para rastrear filtragem
   - Verificação `!== false` (ao invés de `=== true`) para tratar undefined como visível

## Logs no Console
Após a correção, você verá logs como:

```
📊 Configurações salvas: 18/20 ocultos (90.0%)
🔄 DETECTADAS CONFIGURAÇÕES ANTIGAS! Resetando tudo...
   ❌ Configuração antiga: {...}
   ✅ Nova configuração: {...}
🔄 Forçando atualização...
```

## Prevenção Futura
O sistema agora detecta automaticamente configurações antigas e as reseta. Não será mais necessário intervenção manual.
