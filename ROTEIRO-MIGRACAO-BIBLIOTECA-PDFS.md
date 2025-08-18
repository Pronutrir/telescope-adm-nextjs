# 📚 Roteiro de Migração: Biblioteca de PDFs

## ✅ STATUS ATUAL: FASE 4 CONCLUÍDA
**Componentes Reutilizáveis**: Todos os 4 componentes principais criados e funcionais

### 🎯 Última Atualização - FASE 4 Completa
- ✅ **PDFCard**: Componente de card com grid/list view
- ✅ **UploadZone**: Interface de upload com drag & drop
- ✅ **SearchPDF**: Sistema de busca e filtros avançados  
- ✅ **PDFViewerModal**: Modal de visualização com zoom/rotação
- ✅ **Barrel Export**: Organização de exportações

## 🎯 Objetivo
Migrar completamente o sistema de gestão de PDFs do projeto `app_pdfs` para a página `biblioteca-pdfs` no telescope-adm-nextjs, preservando todas as funcionalidades e integrando com o design system existente.

## 📊 Análise do Projeto Fonte (app_pdfs)

### 🏗️ Arquitetura Identificada
- **Framework**: Next.js 15.4.4 + React 19.1.0 + TypeScript
- **Styling**: Tailwind CSS 4
- **Estrutura**: 3 páginas principais (2.400+ linhas)
- **APIs**: 6 endpoints RESTful
- **Funcionalidades**: 15+ recursos implementados

### 📁 Componentes Principais Analisados
1. **Página Principal** (`page.tsx` - 998 linhas)
   - Busca avançada com paginação
   - Visualizações Grid/Lista
   - Seleção múltipla para unificação
   - Preview de PDF em iframe
   - Dark mode completo

2. **Upload** (`upload/page.tsx` - 473 linhas)
   - Upload múltiplo com drag & drop
   - Sistema de nomenclatura automática
   - Validação e progress tracking

3. **PDFs Unificados** (`unificados/page.tsx` - 935 linhas)
   - Gestão de PDFs consolidados
   - Interface para nova unificação
   - Busca específica

### 🔗 Interfaces Identificadas
```typescript
// Interface principal
interface PDFItem {
  id: string;
  title: string;
  url: string;
  fileName: string;
  size: string;
  uploadDate: string;
  description: string;
}

// Interface para PDFs unificados
interface UnifiedPDFItem extends PDFItem {
  sourceFiles: string[];
  pageCount: number;
}

// Interface para integração Tasy
interface ContaPaciente {
  Conta: string;
  Nome: string;
  DataNascimento: string;
}
```

### 🌐 APIs Mapeadas
- `GET /api/pdfs/listar` - Listar todos os PDFs
- `GET /api/pdfs/buscar-paginado` - Busca com paginação
- `POST /api/pdfs/upload` - Upload de arquivos
- `GET /api/Pdfs/unificados` - PDFs consolidados
- `POST /api/pdfs/unificar-especificos` - Criar PDF unificado
- `GET /api/pdfs/visualizar/{id}` - Visualizar PDF

---

## 🗺️ ROTEIRO DE EXECUÇÃO

### 📋 **FASE 1: Preparação e Estrutura Base**
**Duração Estimada**: 2-3 horas

#### 1.1 Configuração Inicial
```bash
# Criar estrutura de diretórios
mkdir -p src/app/admin/biblioteca-pdfs
mkdir -p src/app/admin/biblioteca-pdfs/upload
mkdir -p src/app/admin/biblioteca-pdfs/unificados
mkdir -p src/types/pdf
mkdir -p src/services/pdf
mkdir -p src/components/pdf
```

#### 1.2 Definir Interfaces TypeScript
**Arquivo**: `src/types/pdf/index.ts`
- [ ] Migrar interface `PDFItem`
- [ ] Migrar interface `UnifiedPDFItem`
- [ ] Migrar interface `ContaPaciente`
- [ ] Adicionar tipos para responses da API
- [ ] Definir tipos para estados de UI

#### 1.3 Configurar Serviços de API
**Arquivo**: `src/services/pdf/pdfService.ts`
- [ ] Criar classe/funções para comunicação com backend
- [ ] Implementar todos os 6 endpoints identificados
- [ ] Adicionar error handling e tipos
- [ ] Configurar base URL e headers

### 📋 **FASE 2: Página Principal - Biblioteca**
**Duração Estimada**: 4-5 horas

#### 2.1 Layout Base
**Arquivo**: `src/app/admin/biblioteca-pdfs/page.tsx`
- [ ] Integrar com layout existente do telescope-adm
- [ ] Adaptar header com breadcrumbs
- [ ] Implementar sidebar navigation
- [ ] Configurar tema dark/light consistente

#### 2.2 Componentes de Busca
**Arquivo**: `src/components/pdf/SearchPDF.tsx`
- [ ] Campo de busca com debounce
- [ ] Filtros avançados
- [ ] Botão limpar busca
- [ ] Estados de loading da busca

#### 2.3 Controles de Visualização
**Arquivo**: `src/components/pdf/ViewControls.tsx`
- [ ] Toggle Grid/Lista
- [ ] Controles de seleção múltipla
- [ ] Contador de selecionados
- [ ] Botões de ação em lote

#### 2.4 Lista/Grid de PDFs
**Arquivo**: `src/components/pdf/PDFGrid.tsx`
- [ ] Componente para visualização em grid
- [ ] Cards responsivos com preview
- [ ] Hover effects e animations
- [ ] Checkbox para seleção múltipla

**Arquivo**: `src/components/pdf/PDFList.tsx`
- [ ] Componente para visualização em lista
- [ ] Layout compacto e informativo
- [ ] Ações inline (visualizar, download)

#### 2.5 Preview de PDF
**Arquivo**: `src/components/pdf/PDFPreview.tsx`
- [ ] Modal/Dialog para preview
- [ ] Iframe com PDF base64
- [ ] Controles de zoom e navegação
- [ ] Botões de ação (nova janela, download)

#### 2.6 Paginação
**Arquivo**: `src/components/pdf/Pagination.tsx`
- [ ] Componente de paginação reutilizável
- [ ] Informações de total/página atual
- [ ] Navegação por páginas
- [ ] Controle de itens por página

### 📋 **FASE 3: Sistema de Upload**
**Duração Estimada**: 3-4 horas

#### 3.1 Página de Upload
**Arquivo**: `src/app/admin/biblioteca-pdfs/upload/page.tsx`
- [ ] Layout integrado com design system
- [ ] Breadcrumbs e navegação
- [ ] Estados de loading global

#### 3.2 Zona de Upload
**Arquivo**: `src/components/pdf/UploadZone.tsx`
- [ ] Drag & drop interface
- [ ] Seleção manual de arquivos
- [ ] Preview de arquivos selecionados
- [ ] Validação de tipo e tamanho

#### 3.3 Sistema de Nomenclatura
**Arquivo**: `src/components/pdf/FileNaming.tsx`
- [ ] Input para nome personalizado
- [ ] Geração automática de nomes
- [ ] Validação de duplicatas
- [ ] Preview do nome final

#### 3.4 Progress Tracking
**Arquivo**: `src/components/pdf/UploadProgress.tsx`
- [ ] Barra de progresso individual
- [ ] Status de cada arquivo
- [ ] Cancelamento de uploads
- [ ] Retry em caso de erro

### 📋 **FASE 4: PDFs Unificados**
**Duração Estimada**: 4-5 horas

#### 4.1 Página de Unificados
**Arquivo**: `src/app/admin/biblioteca-pdfs/unificados/page.tsx`
- [ ] Lista de PDFs já unificados
- [ ] Informações de arquivos fonte
- [ ] Botão para nova unificação
- [ ] Busca específica para unificados

#### 4.2 Interface de Unificação
**Arquivo**: `src/components/pdf/PDFUnification.tsx`
- [ ] Seleção de PDFs para unificar
- [ ] Preview dos arquivos selecionados
- [ ] Configuração de ordem
- [ ] Processo de unificação

#### 4.3 Detalhes do PDF Unificado
**Arquivo**: `src/components/pdf/UnifiedPDFDetails.tsx`
- [ ] Informações detalhadas
- [ ] Lista de arquivos fonte
- [ ] Número de páginas
- [ ] Ações disponíveis

### ✅ **FASE 5: Hooks e Estados**
**Duração Estimada**: 2-3 horas - **CONCLUÍDA**

#### 5.1 ✅ Hooks Customizados
**Arquivo**: `src/hooks/usePDFManager.ts` ✅
- ✅ Hook para gerenciamento completo de PDFs
- ✅ Estados de loading/error centralizados
- ✅ Operações CRUD integradas
- ✅ Sistema de busca e paginação

**Arquivo**: `src/hooks/useUnifiedPDFs.ts` ✅
- ✅ Hook para PDFs unificados
- ✅ Modal de criação de unificação
- ✅ Seleção e gerenciamento de arquivos
- ✅ Preview e busca específica

**Arquivo**: `src/hooks/usePDFUpload.ts` ✅
- ✅ Hook para upload múltiplo
- ✅ Drag & drop com validação
- ✅ Progress tracking detalhado
- ✅ Retry logic e error handling

#### 5.2 ✅ Context Providers
**Arquivo**: `src/contexts/PDFContext.tsx` ✅
- ✅ Context para estado global dos PDFs
- ✅ Integração de todos os hooks
- ✅ Ações globais (refresh, clear)
- ✅ Hooks de conveniência exportados

### 📋 **FASE 6: Integração e Polimentos**
**Duração Estimada**: 2-3 horas

#### 6.1 Roteamento e Navegação
- [ ] Configurar rotas em `src/config/routes.ts`
- [ ] Adicionar links no menu sidebar
- [ ] Configurar breadcrumbs
- [ ] Navegação entre seções

#### 6.2 Temas e Estilos
- [ ] Adaptar para design system telescope-adm
- [ ] Consistência com modo escuro existente
- [ ] Responsividade completa
- [ ] Accessibility (ARIA labels)

#### 6.3 Integração com Sistema Tasy
**Arquivo**: `src/services/tasy/tasyIntegration.ts`
- [ ] Interface para busca de pacientes
- [ ] Vinculação de PDFs com contas
- [ ] Validação de dados
- [ ] Error handling específico

#### 6.4 Otimizações
- [ ] Lazy loading de componentes
- [ ] Debounce em buscas
- [ ] Cache de resultados
- [ ] Performance monitoring

---

## 🔧 **IMPLEMENTAÇÃO TÉCNICA**

### Padrões de Desenvolvimento
- **Layout Preservation**: Manter estrutura HTML existente
- **Theme Adaptation**: Usar classes Tailwind do telescope-adm
- **Error Boundaries**: Implementar em todos os componentes
- **Loading States**: Feedback visual consistente
- **Accessibility**: ARIA labels e navegação por teclado

### Estrutura de Arquivos Final
```
src/
├── app/admin/biblioteca-pdfs/
│   ├── page.tsx              # Página principal
│   ├── upload/
│   │   └── page.tsx          # Upload de PDFs
│   └── unificados/
│       └── page.tsx          # PDFs unificados
├── components/pdf/
│   ├── SearchPDF.tsx         # Busca
│   ├── ViewControls.tsx      # Controles de visualização
│   ├── PDFGrid.tsx           # Grid de PDFs
│   ├── PDFList.tsx           # Lista de PDFs
│   ├── PDFPreview.tsx        # Preview modal
│   ├── Pagination.tsx        # Paginação
│   ├── UploadZone.tsx        # Zona de upload
│   ├── FileNaming.tsx        # Nomenclatura
│   ├── UploadProgress.tsx    # Progresso
│   ├── PDFUnification.tsx    # Unificação
│   └── UnifiedPDFDetails.tsx # Detalhes unificados
├── hooks/
│   ├── usePDFs.ts           # Hook principal
│   ├── usePDFSearch.ts      # Hook de busca
│   └── usePDFUpload.ts      # Hook de upload
├── services/pdf/
│   └── pdfService.ts        # Serviços de API
├── services/tasy/
│   └── tasyIntegration.ts   # Integração Tasy
├── types/pdf/
│   └── index.ts             # Interfaces TypeScript
└── contexts/
    └── PDFContext.tsx       # Context global
```

---

## ✅ **CHECKLIST DE FINALIZAÇÃO**

### Funcionalidades Core
- [ ] Listagem de PDFs com Grid/Lista
- [ ] Busca avançada com paginação
- [ ] Upload múltiplo com drag & drop
- [ ] Preview de PDFs em modal
- [ ] Seleção múltipla e unificação
- [ ] Gestão de PDFs unificados
- [ ] Dark mode completo
- [ ] Responsividade total

### Integração
- [ ] APIs conectadas e funcionais
- [ ] Roteamento configurado
- [ ] Menu sidebar atualizado
- [ ] Breadcrumbs implementados
- [ ] Tema consistente
- [ ] Error handling robusto

### Performance e UX
- [ ] Loading states implementados
- [ ] Debounce em buscas
- [ ] Lazy loading onde aplicável
- [ ] Feedback visual adequado
- [ ] Acessibilidade implementada
- [ ] Testes de navegação

### Documentação
- [ ] README da funcionalidade
- [ ] Documentação de APIs
- [ ] Guia de uso para usuários
- [ ] Comentários no código

---

## 🎯 **RESULTADO ESPERADO**

Uma biblioteca de PDFs completamente funcional e integrada ao telescope-adm-nextjs com:

- **15+ funcionalidades** do projeto original migradas
- **6 endpoints de API** integrados
- **3 páginas principais** implementadas
- **10+ componentes reutilizáveis** criados
- **Design system** consistente aplicado
- **Performance otimizada** e responsiva
- **Experiência de usuário** fluida e intuitiva

**Tempo Total Estimado**: 18-23 horas de desenvolvimento

Este roteiro garante uma migração completa e estruturada, preservando todas as funcionalidades do projeto original enquanto integra perfeitamente com o ecossistema telescope-adm existente.
