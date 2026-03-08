/**
 * Barrel export para todos os componentes PDF
 * Facilita importação e organização
 */

// Componentes principais
export { PDFCard } from './PDFCard'
export { UploadZone } from './UploadZone'
export { SearchPDF } from './SearchPDF'
export { PDFViewerModal } from './PDFViewerModal'
export { default as InlinePDFViewer } from './InlinePDFViewer'
export { PDFSortableCard } from './PDFSortableCard'
export { SortablePDFGrid } from './SortablePDFGrid'

// Gerenciador de PDFs - página principal
export { GerenciadorPDFsClient } from './GerenciadorPDFsClient'
export { PDFPageHeader } from './PDFPageHeader'
export { PDFSearchToolbar } from './PDFSearchToolbar'
export { MergeProgressBanner } from './MergeProgressBanner'
export { PDFSelectionPanel } from './PDFSelectionPanel'
export { PDFContentArea } from './PDFContentArea'
export { EditPageGrid } from './EditPageGrid'
export { PDFEditModal } from './PDFEditModal'
export { PDFMergeModal } from './PDFMergeModal'

// Re-exportar tipos relacionados aos componentes
export type { ViewMode } from '@/types/pdf'
export type { EditState } from './usePDFEdit'
export type { MergeProgress, NomeComposicao } from './usePDFMerge'
