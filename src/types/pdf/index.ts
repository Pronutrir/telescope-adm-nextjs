/**
 * Interfaces TypeScript para o sistema de biblioteca de PDFs
 * Migradas do projeto app_pdfs
 */

// Interface principal para itens PDF (formato frontend)
export interface PDFItem {
  id: string;
  title: string;
  url: string;
  fileName: string;
  size: string;
  uploadDate: string;
  description: string;
}

// Interface para dados da API Real (.NET)
export interface PdfInfo {
  nome: string;
  caminhoCompleto: string;
  tamanhoBytes: number;
  tamanhoMB: number;
  dataCriacao: string;
  dataModificacao: string;
  numeroPaginas?: number;
  erro?: string | null;
}

// Interface para PDFs unificados (extends PDFItem)
export interface UnifiedPDFItem extends PDFItem {
  sourceFiles: string[];
  pageCount: number;
}

// Interface para integração com sistema Tasy
export interface ContaPaciente {
  Conta: string;
  Nome: string;
  DataNascimento: string;
  CPF?: string;
  RG?: string;
  Telefone?: string;
  Email?: string;
}

// Tipos para responses da API Real (.NET)
export interface PDFListResponse {
  sucesso: boolean;
  mensagem?: string;
  totalArquivos: number;
  tamanhoTotalMB: number;
  dataConsulta: string;
  arquivos: PdfInfo[];
}

export interface PDFSearchResponse {
  sucesso: boolean;
  mensagem?: string;
  termoBusca: string;
  totalEncontrados: number;
  paginaAtual: number;
  itensPorPagina: number;
  totalPaginas: number;
  temPaginaAnterior: boolean;
  temProximaPagina: boolean;
  totalTamanhoMB: number;
  totalTamanhoGeralMB: number;
  dataConsulta: string;
  arquivos: PdfInfo[];
}

// Tipos para o frontend (formato transformado)
export interface PDFSearchResponseFrontend {
  success: boolean;
  data: PDFItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface UnifiedPDFSearchResponse {
  sucesso: boolean;
  mensagem?: string;
  termoBusca: string;
  totalEncontrados: number;
  paginaAtual: number;
  itensPorPagina: number;
  totalPaginas: number;
  temPaginaAnterior: boolean;
  temProximaPagina: boolean;
  totalTamanhoMB: number;
  totalTamanhoGeralMB: number;
  dataConsulta: string;
  arquivos: PdfInfo[];
}

export interface UnifiedPDFListResponse {
  sucesso: boolean;
  mensagem?: string;
  totalArquivos: number;
  tamanhoTotalMB: number;
  dataConsulta: string;
  arquivos: PdfInfo[];
}

export interface PDFUploadResponse {
  success: boolean;
  data?: PDFItem;
  message?: string;
  error?: string;
}

export interface PDFUnificationResponse {
  success: boolean;
  data?: UnifiedPDFItem;
  message?: string;
  error?: string;
}

// Tipos para estados de UI
export type ViewMode = 'grid' | 'list';

export interface PDFUIState {
  isLoading: boolean;
  isSearching: boolean;
  isSelectionMode: boolean;
  selectedForMerge: Set<string>;
  viewMode: ViewMode;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  error?: string | null;
}

// Tipos para upload
export interface UploadFileInfo {
  file: File;
  id: string;
  customName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  // Parâmetros de composição do nome
  cdPessoaFisica?: string;
  numeroAtendimento?: string;
  dataUpload?: string;
  hash?: string;
}

export interface UploadState {
  files: UploadFileInfo[];
  isUploading: boolean;
  overallProgress: number;
}

// Interface para composição do nome dos arquivos
export interface NomeComposicao {
  setor: string;
  nomeCompleto: string;
  cdPessoaFisica?: string; // Código da pessoa física selecionada (string conforme API TASY)
  numeroAtendimento: string;
  dataUpload: string;
  hash: string;
}

// Tipos para busca
export interface SearchParams {
  query: string;
  page: number;
  limit: number;
  sortBy?: 'title' | 'uploadDate' | 'size';
  sortOrder?: 'asc' | 'desc';
}

// Tipos para categorias
export type PDFCategory = 'documentos' | 'contratos' | 'relatorios' | 'outros';

// Tipos para ordenação
export type PDFSortOption = 
  | 'name_asc' 
  | 'name_desc' 
  | 'date_asc' 
  | 'date_desc' 
  | 'size_asc' 
  | 'size_desc';

// Tipos para filtros
export interface PDFFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  fileType?: string[];
}

// Tipos para filtros de busca avançada
export interface SearchFilters {
  categories: PDFCategory[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: PDFSortOption;
}

// Tipos para preview
export interface PDFPreviewState {
  isOpen: boolean;
  selectedPdf: PDFItem | null;
  pdfBase64: string | null;
  isLoading: boolean;
  error?: string;
}

// Tipos para unificação
export interface UnificationRequest {
  title: string;
  description: string;
  sourceFileIds: string[];
  mergeOrder: string[];
}

// Interface específica para o endpoint da API real
export interface UnificationAPIRequest {
  nomesPdfs: string[];
  nomeArquivoSaida?: string | null;
}

// Resposta da API de unificação
export interface UnificationAPIResponse {
  sucesso: boolean;
  mensagem: string;
  nomeArquivoSaida: string | null;
  caminhoArquivoSaida: string | null;
  totalArquivosUnificados: number;
  tamanhoFinalMB: number;
  dataCriacao: string;
  arquivosProcessados: string[];
  arquivosNaoEncontrados: string[];
}

// Tipos de erro da API
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Tipos para edição de PDFs
export interface PDFPageInfo {
  pageNumber: number;
  thumbnail?: string;
  selected: boolean;
}

export interface PDFEditState {
  isOpen: boolean;
  selectedPdf: PDFItem | null;
  isLoading: boolean;
  isLoadingPages: boolean;
  form: {
    title: string;
    description: string;
    fileName: string;
  };
  pages: PDFPageInfo[];
  pdfBase64?: string;
}

export interface PDFEditRequest {
  id: string;
  title: string;
  description: string;
  fileName: string;
  pagesToKeep: number[];
}

export interface PDFEditResponse {
  success: boolean;
  message: string;
  updatedPdf?: PDFItem;
}
