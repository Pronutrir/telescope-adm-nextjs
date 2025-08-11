# 🔭 Telescope ADM - AI Coding Instructions

## 📋 CONTEXTO ESSENCIAL

Para trabalhar neste projeto, você **DEVE** primeiro ler:
- `AGENT-CONTEXT.md` - Documentação completa da arquitetura
- `AGENT-WORKFLOWS.md` - Workflows práticos e exemplos

## 🎯 INSTRUÇÕES RÁPIDAS

### Componentes
- **LOCALIZAÇÃO:** Apenas em `src/components/ui/`
- **CONTEXTOS:** Sempre usar `useTheme()` e `useLayout()`
- **PADRÕES:** TypeScript + Tailwind CSS + responsividade

### Estrutura Base
```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

export const NovoComponente: React.FC<Props> = (props) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    return (
        <div className={`transition-colors ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}>
            {/* Conteúdo */}
        </div>
    )
}
```

### Workflow Obrigatório
1. ✅ Ler documentação completa em `AGENT-CONTEXT.md`
2. ✅ Verificar componentes existentes em `src/components/ui/`
3. ✅ Usar contextos de tema e layout
4. ✅ Exportar no `src/components/ui/index.ts`
5. ✅ Adicionar exemplo em `FlyonCardExamples.tsx`

## 🚫 RESTRIÇÕES

- **NUNCA** criar componentes fora de `src/components/ui/`
- **NUNCA** ignorar contextos obrigatórios
- **NUNCA** usar detecção manual de tema/mobile
- **SEMPRE** seguir padrões TypeScript
- **SEMPRE** implementar suporte dark/light

## 📖 Leia AGENT-CONTEXT.md para detalhes completos!
