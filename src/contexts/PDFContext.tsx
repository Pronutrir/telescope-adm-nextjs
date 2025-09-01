'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { usePDFManager } from '@/hooks/usePDFManager'
import { useUnifiedPDFs } from '@/hooks/useUnifiedPDFs'
import { usePDFUpload } from '@/hooks/usePDFUpload'

// Tipos para o contexto
interface PDFContextType {
    // Gerenciamento geral de PDFs
    pdfManager: ReturnType<typeof usePDFManager>

    // PDFs unificados
    unifiedPDFs: ReturnType<typeof useUnifiedPDFs>

    // Upload de PDFs
    upload: ReturnType<typeof usePDFUpload>

    // Ações globais
    refreshAllData: () => Promise<void>
    clearAllStates: () => void
}

interface PDFProviderProps {
    children: ReactNode
}

// Criação do contexto
const PDFContext = createContext<PDFContextType | undefined>(undefined)

/**
 * Provider para contexto de PDFs
 * Centraliza todos os hooks relacionados a PDFs
 */
export const PDFProvider: React.FC<PDFProviderProps> = ({ children }) => {
    // 🎯 Inicializar todos os hooks
    const pdfManager = usePDFManager()
    const unifiedPDFs = useUnifiedPDFs()
    const upload = usePDFUpload()

    // 🎯 AÇÕES GLOBAIS
    const refreshAllData = async () => {
        await Promise.all([
            pdfManager.refreshPDFs(),
            unifiedPDFs.refreshData()
        ])
    }

    const clearAllStates = () => {
        upload.clearAllFiles()
        // Outras limpezas conforme necessário
    }

    const contextValue: PDFContextType = {
        pdfManager,
        unifiedPDFs,
        upload,
        refreshAllData,
        clearAllStates
    }

    return (
        <PDFContext.Provider value={contextValue}>
            {children}
        </PDFContext.Provider>
    )
}

/**
 * Hook para usar o contexto de PDFs
 */
export const usePDFContext = (): PDFContextType => {
    const context = useContext(PDFContext)

    if (context === undefined) {
        throw new Error('usePDFContext deve ser usado dentro de um PDFProvider')
    }

    return context
}

/**
 * Hook para usar apenas o gerenciamento de PDFs
 */
export const usePDFs = () => {
    const { pdfManager } = usePDFContext()
    return pdfManager
}

/**
 * Hook para usar apenas PDFs unificados
 */
export const useUnifiedPDFsContext = () => {
    const { unifiedPDFs } = usePDFContext()
    return unifiedPDFs
}

/**
 * Hook para usar apenas upload
 */
export const usePDFUploadContext = () => {
    const { upload } = usePDFContext()
    return upload
}

// Exportações por conveniência
export { usePDFManager, useUnifiedPDFs, usePDFUpload }
