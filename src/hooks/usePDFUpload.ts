'use client'

import { useState, useCallback } from 'react'
import { UploadFileInfo, UploadState } from '@/types/pdf'
import { PDFService, PDFValidationService } from '@/services/pdf/pdfService'

/**
 * Hook personalizado para gerenciamento de upload de PDFs
 * Centraliza lógica de drag & drop, validação e upload em lote
 */
export const usePDFUpload = () => {
    // 🎯 Estados principais do upload
    const [uploadState, setUploadState] = useState<UploadState>({
        files: [],
        isUploading: false,
        overallProgress: 0
    })

    // Estados para UI
    const [isDragOver, setIsDragOver] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 🎯 GERAR ID ÚNICO PARA ARQUIVO
    const generateFileId = useCallback(() => {
        return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }, [])

    // 🎯 VALIDAR ARQUIVO
    const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
        // Usar o método de validação do serviço
        return PDFValidationService.validatePDFFile(file)
    }, [])

    // 🎯 ADICIONAR ARQUIVOS
    const addFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files)
        const newFiles: UploadFileInfo[] = []

        fileArray.forEach(file => {
            const validation = validateFile(file)
            
            const fileInfo: UploadFileInfo = {
                file,
                id: generateFileId(),
                customName: file.name.replace('.pdf', ''),
                progress: 0,
                status: validation.isValid ? 'pending' : 'error',
                error: validation.error
            }

            newFiles.push(fileInfo)
        })

        setUploadState(prev => ({
            ...prev,
            files: [...prev.files, ...newFiles]
        }))

        setError(null)
    }, [validateFile, generateFileId])

    // 🎯 REMOVER ARQUIVO
    const removeFile = useCallback((fileId: string) => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.filter(f => f.id !== fileId)
        }))
    }, [])

    // 🎯 ATUALIZAR NOME CUSTOMIZADO
    const updateCustomName = useCallback((fileId: string, customName: string) => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.map(f => 
                f.id === fileId ? { ...f, customName } : f
            )
        }))
    }, [])

    // 🎯 ATUALIZAR PROGRESSO DO ARQUIVO
    const updateFileProgress = useCallback((fileId: string, progress: number, status?: UploadFileInfo['status']) => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.map(f => 
                f.id === fileId 
                    ? { ...f, progress, ...(status && { status }) }
                    : f
            )
        }))
    }, [])

    // 🎯 CALCULAR PROGRESSO GERAL
    const calculateOverallProgress = useCallback((files: UploadFileInfo[]) => {
        if (files.length === 0) return 0
        
        const totalProgress = files.reduce((sum, file) => sum + file.progress, 0)
        return Math.round(totalProgress / files.length)
    }, [])

    // 🎯 UPLOAD DE ARQUIVO INDIVIDUAL
    const uploadSingleFile = useCallback(async (fileInfo: UploadFileInfo): Promise<void> => {
        const { file, customName, id } = fileInfo

        try {
            updateFileProgress(id, 0, 'uploading')

            // Simular progresso durante upload (em produção seria baseado no progresso real da API)
            const progressInterval = setInterval(() => {
                setUploadState(prev => {
                    const fileIndex = prev.files.findIndex(f => f.id === id)
                    if (fileIndex === -1) return prev

                    const currentFile = prev.files[fileIndex]
                    const newProgress = Math.min(currentFile.progress + 10, 90)

                    const updatedFiles = [...prev.files]
                    updatedFiles[fileIndex] = { ...currentFile, progress: newProgress }

                    return {
                        ...prev,
                        files: updatedFiles,
                        overallProgress: calculateOverallProgress(updatedFiles)
                    }
                })
            }, 200)

            // Upload real
            await PDFService.uploadPDF(file, customName)

            clearInterval(progressInterval)
            updateFileProgress(id, 100, 'success')

        } catch (error) {
            console.error('Erro no upload:', error)
            updateFileProgress(id, 0, 'error')
            
            setUploadState(prev => ({
                ...prev,
                files: prev.files.map(f => 
                    f.id === id 
                        ? { 
                            ...f, 
                            error: error instanceof Error ? error.message : 'Erro no upload',
                            status: 'error' as const,
                            progress: 0
                        }
                        : f
                )
            }))
            
            throw error
        }
    }, [updateFileProgress, calculateOverallProgress])

    // 🎯 UPLOAD EM LOTE
    const uploadAllFiles = useCallback(async (): Promise<{ success: number; failed: number }> => {
        const pendingFiles = uploadState.files.filter(f => f.status === 'pending')
        
        if (pendingFiles.length === 0) {
            throw new Error('Nenhum arquivo válido para upload')
        }

        setUploadState(prev => ({ ...prev, isUploading: true }))
        setError(null)

        let successCount = 0
        let failedCount = 0

        try {
            // Upload sequencial para melhor controle de progresso
            for (const fileInfo of pendingFiles) {
                try {
                    await uploadSingleFile(fileInfo)
                    successCount++
                } catch (error) {
                    failedCount++
                    console.error(`Erro no upload de ${fileInfo.file.name}:`, error)
                }
            }

            // Atualizar progresso final
            setUploadState(prev => ({
                ...prev,
                overallProgress: 100,
                isUploading: false
            }))

            return { success: successCount, failed: failedCount }

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro no upload')
            setUploadState(prev => ({ ...prev, isUploading: false }))
            throw error
        }
    }, [uploadState.files, uploadSingleFile])

    // 🎯 LIMPAR ARQUIVOS COMPLETADOS
    const clearCompletedFiles = useCallback(() => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.filter(f => f.status !== 'success'),
            overallProgress: 0
        }))
    }, [])

    // 🎯 LIMPAR TODOS OS ARQUIVOS
    const clearAllFiles = useCallback(() => {
        setUploadState({
            files: [],
            isUploading: false,
            overallProgress: 0
        })
        setError(null)
    }, [])

    // 🎯 TENTAR NOVAMENTE ARQUIVOS COM ERRO
    const retryFailedUploads = useCallback(async () => {
        const failedFiles = uploadState.files.filter(f => f.status === 'error')
        
        if (failedFiles.length === 0) return

        // Resetar status dos arquivos com erro
        setUploadState(prev => ({
            ...prev,
            files: prev.files.map(f => 
                f.status === 'error' 
                    ? { ...f, status: 'pending', progress: 0, error: undefined }
                    : f
            )
        }))

        // Tentar upload novamente
        return uploadAllFiles()
    }, [uploadState.files, uploadAllFiles])

    // 🎯 HANDLERS PARA DRAG & DROP
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            addFiles(files)
        }
    }, [addFiles])

    // 🎯 HANDLER PARA INPUT DE ARQUIVO
    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            addFiles(files)
        }
        // Limpar input para permitir selecionar o mesmo arquivo novamente
        e.target.value = ''
    }, [addFiles])

    return {
        // Estados
        uploadState,
        isDragOver,
        error,
        
        // Ações de gerenciamento de arquivos
        addFiles,
        removeFile,
        updateCustomName,
        
        // Ações de upload
        uploadAllFiles,
        uploadSingleFile,
        retryFailedUploads,
        
        // Ações de limpeza
        clearCompletedFiles,
        clearAllFiles,
        
        // Handlers de drag & drop
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileInput,
        
        // Estados computados
        hasFiles: uploadState.files.length > 0,
        hasPendingFiles: uploadState.files.some(f => f.status === 'pending'),
        hasFailedFiles: uploadState.files.some(f => f.status === 'error'),
        hasSuccessFiles: uploadState.files.some(f => f.status === 'success'),
        canUpload: uploadState.files.some(f => f.status === 'pending') && !uploadState.isUploading,
        pendingCount: uploadState.files.filter(f => f.status === 'pending').length,
        successCount: uploadState.files.filter(f => f.status === 'success').length,
        failedCount: uploadState.files.filter(f => f.status === 'error').length,
        totalFiles: uploadState.files.length
    }
}
