# SortablePDFList Component

Um componente React reutilizável para exibir e gerenciar listas de PDFs com funcionalidades de arrastar e soltar, seleção múltipla e visualização.

## Características

- **Layout baseado no SortableProgressStats**: Utiliza o mesmo padrão de grid responsivo e estilização
- **Drag & Drop**: Funcionalidade de arrastar e soltar para reordenar PDFs (usando SortableJS)
- **Modo de Seleção**: Permite seleção múltipla com indicadores visuais de ordem
- **Visualização Responsiva**: Suporte a grid e list view com diferentes números de colunas
- **Tema Dark/Light**: Totalmente compatível com temas escuros e claros
- **Ações Personalizáveis**: Callbacks para visualização, seleção e reordenação

## Props

```typescript
interface SortablePDFListProps {
    items: PDFItem[]                          // Lista de PDFs
    onSortEnd?: (items: PDFItem[]) => void    // Callback para reordenação
    onViewPDF?: (pdf: PDFItem) => void        // Callback para visualização
    onSelectPDF?: (pdfId: string) => void     // Callback para seleção
    className?: string                        // Classes CSS adicionais
    isDark?: boolean                          // Tema escuro
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6         // Número de colunas no grid
    animation?: number                        // Duração da animação de drag (ms)
    disabled?: boolean                        // Desabilitar drag & drop
    isSelectionMode?: boolean                 // Modo de seleção múltipla
    selectedItems?: Set<string>               // IDs dos itens selecionados
    selectionOrder?: string[]                 // Ordem de seleção
    formatDate?: (date: string) => string     // Formatador de data
    viewMode?: 'grid' | 'list'               // Modo de visualização
}
```

## Interface PDFItem

```typescript
interface PDFItem {
    id: string          // ID único do PDF
    title: string       // Título do documento
    url: string         // URL do arquivo
    fileName: string    // Nome do arquivo
    size: string        // Tamanho formatado (ex: "2.5 MB")
    uploadDate: string  // Data de upload
    description: string // Descrição do documento
}
```

## Exemplo de Uso Básico

```tsx
import { SortablePDFList } from '@/components/pdf/SortablePDFList'

function MyPDFLibrary() {
    const [pdfs, setPdfs] = useState<PDFItem[]>([...])
    
    return (
        <SortablePDFList
            items={pdfs}
            onSortEnd={setPdfs}
            onViewPDF={(pdf) => console.log('Visualizar:', pdf)}
            isDark={false}
            gridCols={3}
        />
    )
}
```

## Exemplo com Seleção Múltipla

```tsx
import { SortablePDFList } from '@/components/pdf/SortablePDFList'

function PDFSelectionExample() {
    const [pdfs, setPdfs] = useState<PDFItem[]>([...])
    const [selectedPdfs, setSelectedPdfs] = useState(new Set<string>())
    const [selectionOrder, setSelectionOrder] = useState<string[]>([])
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    
    const handleSelectPDF = (pdfId: string) => {
        const newSelected = new Set(selectedPdfs)
        let newOrder = [...selectionOrder]
        
        if (newSelected.has(pdfId)) {
            newSelected.delete(pdfId)
            newOrder = newOrder.filter(id => id !== pdfId)
        } else {
            newSelected.add(pdfId)
            newOrder.push(pdfId)
        }
        
        setSelectedPdfs(newSelected)
        setSelectionOrder(newOrder)
    }
    
    return (
        <div>
            <button onClick={() => setIsSelectionMode(!isSelectionMode)}>
                {isSelectionMode ? 'Cancelar Seleção' : 'Selecionar PDFs'}
            </button>
            
            <SortablePDFList
                items={pdfs}
                onSortEnd={setPdfs}
                onSelectPDF={handleSelectPDF}
                isSelectionMode={isSelectionMode}
                selectedItems={selectedPdfs}
                selectionOrder={selectionOrder}
                disabled={isSelectionMode}
                gridCols={4}
            />
        </div>
    )
}
```

## Customização de Layout

```tsx
// Layout em lista com 1 coluna
<SortablePDFList
    items={pdfs}
    viewMode="list"
    gridCols={1}
/>

// Layout em grid com 6 colunas
<SortablePDFList
    items={pdfs}
    viewMode="grid"
    gridCols={6}
/>

// Layout responsivo personalizado
<SortablePDFList
    items={pdfs}
    gridCols={3} // 1 col mobile, 2 col tablet, 3 col desktop
    className="gap-6 p-4"
/>
```

## Estados e Indicadores

O componente automaticamente mostra diferentes indicadores:

- **Modo Normal**: Indicador de "Arraste e solte para reorganizar"
- **Modo Seleção**: Indicador de "Clique nos PDFs para selecionar na ordem desejada"
- **Números de Seleção**: Mostra a ordem de seleção nos PDFs selecionados
- **Hover States**: Animações de hover e transformações

## Estilos CSS

O componente inclui estilos CSS automáticos para:
- Estados do drag & drop (`sortable-ghost`, `sortable-chosen`, `sortable-drag`)
- Cursor states (grab, grabbing, pointer)
- Transições suaves
- Hover effects

## Integração com Temas

O componente é totalmente compatível com sistemas de tema:

```tsx
const { isDark } = useTheme()

<SortablePDFList
    items={pdfs}
    isDark={isDark}
    // ... outras props
/>
```

## Acessibilidade

- Suporte a navegação por teclado
- Estados de foco visíveis
- Indicadores semânticos para seleção
- Aria labels apropriados

## Performance

- Otimizado para listas grandes
- Memoização interna para re-renders mínimos
- Lazy loading compatível
- Animações GPU-accelerated
