'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Upload,
    FileText,
    X,
    Check,
    AlertCircle,
    ArrowLeft,
    Loader2,
    FolderOpen,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { UploadFileInfo, UploadState } from '@/types/pdf'
import { PDFService, PDFValidationService } from '@/services/pdf/pdfService'

const UploadPDFsPage = () => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios conforme AGENT-CONTEXT
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // 🎯 STEP 2: PRESERVAÇÃO - Estados migrados do app_pdfs
    const [ mounted, setMounted ] = useState(false)
    const [ uploadState, setUploadState ] = useState<UploadState>({
        files: [],
        isUploading: false,
        overallProgress: 0
    })

    // Estados para drag & drop - migrado do app_pdfs
    const [ isDragOver, setIsDragOver ] = useState(false)
    const [ dragCounter, setDragCounter ] = useState(0)

    // Validação de arquivo - migrado do app_pdfs
    const validateAndAddFile = useCallback((file: File) => {
        const validation = PDFValidationService.validatePDFFile(file)

        if (!validation.isValid) {
            alert(validation.error)
            return
        }

        // Verificar duplicatas
        const isDuplicate = uploadState.files.some(f =>
            f.file.name === file.name && f.file.size === file.size
        )

        if (isDuplicate) {
            alert('Este arquivo já foi selecionado')
            return
        }

        const fileInfo: UploadFileInfo = {
            file,
            id: crypto.randomUUID(),
            customName: file.name.replace('.pdf', ''),
            progress: 0,
            status: 'pending'
        }

        setUploadState(prev => ({
            ...prev,
            files: [ ...prev.files, fileInfo ]
        }))
    }, [ uploadState.files ])

    // Manipuladores de drag & drop - migrados do app_pdfs
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragCounter(prev => prev + 1)
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragOver(true)
        }
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragCounter(prev => prev - 1)
        if (dragCounter <= 1) {
            setIsDragOver(false)
        }
    }, [ dragCounter ])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
        setDragCounter(0)

        const files = Array.from(e.dataTransfer.files)
        files.forEach(file => {
            if (file.type === 'application/pdf') {
                validateAndAddFile(file)
            }
        })
    }, [ validateAndAddFile ])

    // Seleção manual de arquivos
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(validateAndAddFile)
        // Limpar input para permitir selecionar o mesmo arquivo novamente
        e.target.value = ''
    }, [ validateAndAddFile ])

    // Remover arquivo da lista
    const removeFile = useCallback((fileId: string) => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.filter(f => f.id !== fileId)
        }))
    }, [])

    // Atualizar nome customizado
    const updateCustomName = useCallback((fileId: string, newName: string) => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.map(f =>
                f.id === fileId ? { ...f, customName: newName } : f
            )
        }))
    }, [])

    // Upload de arquivos - migrado e adaptado do app_pdfs
    const uploadFiles = useCallback(async () => {
        if (uploadState.files.length === 0) return

        setUploadState(prev => ({ ...prev, isUploading: true }))

        const totalFiles = uploadState.files.length
        let completedFiles = 0

        for (const fileInfo of uploadState.files) {
            if (fileInfo.status !== 'pending') continue

            try {
                // Atualizar status para uploading
                setUploadState(prev => ({
                    ...prev,
                    files: prev.files.map(f =>
                        f.id === fileInfo.id
                            ? { ...f, status: 'uploading', progress: 0 }
                            : f
                    )
                }))

                // Simular progresso durante upload
                const progressInterval = setInterval(() => {
                    setUploadState(prev => ({
                        ...prev,
                        files: prev.files.map(f =>
                            f.id === fileInfo.id && f.progress < 90
                                ? { ...f, progress: f.progress + 10 }
                                : f
                        )
                    }))
                }, 200)

                // Realizar upload
                await PDFService.uploadPDF(fileInfo.file, fileInfo.customName)

                clearInterval(progressInterval)

                // Atualizar para sucesso
                setUploadState(prev => ({
                    ...prev,
                    files: prev.files.map(f =>
                        f.id === fileInfo.id
                            ? { ...f, status: 'success', progress: 100 }
                            : f
                    )
                }))

                completedFiles++

            } catch (error) {
                console.error('Erro no upload:', error)

                // Atualizar para erro
                setUploadState(prev => ({
                    ...prev,
                    files: prev.files.map(f =>
                        f.id === fileInfo.id
                            ? {
                                ...f,
                                status: 'error',
                                error: error instanceof Error ? error.message : 'Erro no upload'
                            }
                            : f
                    )
                }))

                completedFiles++
            }

            // Atualizar progresso geral
            setUploadState(prev => ({
                ...prev,
                overallProgress: Math.round((completedFiles / totalFiles) * 100)
            }))
        }

        setUploadState(prev => ({ ...prev, isUploading: false }))
    }, [ uploadState.files ])

    // Limpar lista após sucesso
    const clearSuccessfulFiles = useCallback(() => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.filter(f => f.status !== 'success'),
            overallProgress: 0
        }))
    }, [])

    // Formatar tamanho do arquivo
    const formatFileSize = (bytes: number) => {
        return PDFValidationService.formatFileSize(bytes)
    }

    // Prevenir hidratação inconsistente
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className="w-full space-y-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <div className="w-full space-y-8">
                {/* 🎯 PRESERVAÇÃO: Header baseado no layout original */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={() => window.location.href = '/admin/biblioteca-pdfs'}
                            variant="outline"
                            size="sm"
                            className="inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Button>
                        <h1 className={twMerge(
                            'text-4xl font-bold',
                            isDark ? 'text-white' : 'text-slate-800'
                        )}>
                            Upload de PDFs
                        </h1>
                    </div>

                    <p className={twMerge(
                        'text-lg',
                        isDark ? 'text-gray-300' : 'text-muted-foreground'
                    )}>
                        Faça upload de seus documentos PDF
                    </p>
                </div>

                {/* Zona de Upload - migrada do app_pdfs */}
                <div className={twMerge(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
                    isDragOver
                        ? isDark
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-blue-500 bg-blue-50'
                        : isDark
                            ? 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
                )}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="space-y-4">
                        <div className={twMerge(
                            'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
                            isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                        )}>
                            <Upload className={twMerge(
                                'w-8 h-8',
                                isDark ? 'text-blue-400' : 'text-blue-500'
                            )} />
                        </div>

                        <div>
                            <h3 className={twMerge(
                                'text-lg font-medium mb-2',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                Arraste arquivos PDF aqui
                            </h3>
                            <p className={twMerge(
                                'text-sm mb-4',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                ou clique no botão abaixo para selecionar
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <div
                                    className={twMerge(
                                        'inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors',
                                        isDark
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    )}
                                >
                                    <FolderOpen className="w-4 h-4" />
                                    Selecionar Arquivos
                                </div>
                            </label>

                            <p className={twMerge(
                                'text-xs',
                                isDark ? 'text-gray-500' : 'text-gray-400'
                            )}>
                                Máximo 50MB por arquivo • Apenas arquivos PDF
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de arquivos selecionados - migrada do app_pdfs */}
                {uploadState.files.length > 0 && (
                    <div className={twMerge(
                        'p-6 rounded-lg border',
                        isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={twMerge(
                                'text-lg font-medium',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                Arquivos Selecionados ({uploadState.files.length})
                            </h3>

                            <div className="flex items-center gap-2">
                                {uploadState.files.some(f => f.status === 'success') && (
                                    <Button
                                        onClick={clearSuccessfulFiles}
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 border-green-300"
                                    >
                                        Limpar Enviados
                                    </Button>
                                )}

                                <Button
                                    onClick={uploadFiles}
                                    disabled={uploadState.isUploading || uploadState.files.every(f => f.status !== 'pending')}
                                    className={twMerge(
                                        'inline-flex items-center gap-2',
                                        uploadState.isUploading
                                            ? 'cursor-not-allowed opacity-50'
                                            : isDark
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                    )}
                                >
                                    {uploadState.isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Enviar Arquivos
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Progresso geral */}
                        {uploadState.isUploading && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={twMerge(
                                        'text-sm font-medium',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        Progresso Geral
                                    </span>
                                    <span className={twMerge(
                                        'text-sm',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {uploadState.overallProgress}%
                                    </span>
                                </div>
                                <div className={twMerge(
                                    'w-full bg-gray-200 rounded-full h-2',
                                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                                )}>
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadState.overallProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Lista de arquivos */}
                        <div className="space-y-3">
                            {uploadState.files.map((fileInfo) => (
                                <div
                                    key={fileInfo.id}
                                    className={twMerge(
                                        'p-4 rounded-lg border transition-all duration-200',
                                        fileInfo.status === 'success'
                                            ? isDark
                                                ? 'border-green-600 bg-green-900/20'
                                                : 'border-green-300 bg-green-50'
                                            : fileInfo.status === 'error'
                                                ? isDark
                                                    ? 'border-red-600 bg-red-900/20'
                                                    : 'border-red-300 bg-red-50'
                                                : isDark
                                                    ? 'border-gray-600 bg-gray-700/50'
                                                    : 'border-gray-200 bg-gray-50'
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Ícone do arquivo */}
                                        <div className={twMerge(
                                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                            isDark ? 'bg-red-900/20' : 'bg-red-50'
                                        )}>
                                            <FileText className={twMerge(
                                                'w-5 h-5',
                                                isDark ? 'text-red-400' : 'text-red-500'
                                            )} />
                                        </div>

                                        {/* Informações do arquivo */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="text"
                                                    value={fileInfo.customName}
                                                    onChange={(e) => updateCustomName(fileInfo.id, e.target.value)}
                                                    disabled={fileInfo.status === 'uploading' || fileInfo.status === 'success'}
                                                    className={twMerge(
                                                        'font-medium text-sm bg-transparent border-none outline-none flex-1',
                                                        'focus:ring-2 focus:ring-blue-500/20 rounded px-1',
                                                        fileInfo.status === 'success'
                                                            ? isDark ? 'text-green-400' : 'text-green-600'
                                                            : fileInfo.status === 'error'
                                                                ? isDark ? 'text-red-400' : 'text-red-600'
                                                                : isDark ? 'text-white' : 'text-gray-900'
                                                    )}
                                                />
                                                <span className="text-sm text-gray-500">.pdf</span>
                                            </div>

                                            <p className={twMerge(
                                                'text-xs',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {formatFileSize(fileInfo.file.size)} • {fileInfo.file.name}
                                            </p>

                                            {/* Progresso individual */}
                                            {fileInfo.status === 'uploading' && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-blue-600 dark:text-blue-400">
                                                            Enviando...
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {fileInfo.progress}%
                                                        </span>
                                                    </div>
                                                    <div className={twMerge(
                                                        'w-full bg-gray-200 rounded-full h-1.5',
                                                        isDark ? 'bg-gray-600' : 'bg-gray-200'
                                                    )}>
                                                        <div
                                                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                            style={{ width: `${fileInfo.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mensagem de erro */}
                                            {fileInfo.status === 'error' && fileInfo.error && (
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                    {fileInfo.error}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status e ações */}
                                        <div className="flex items-center gap-2">
                                            {fileInfo.status === 'pending' && (
                                                <button
                                                    onClick={() => removeFile(fileInfo.id)}
                                                    className={twMerge(
                                                        'p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors',
                                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                                    )}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}

                                            {fileInfo.status === 'uploading' && (
                                                <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                                            )}

                                            {fileInfo.status === 'success' && (
                                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            )}

                                            {fileInfo.status === 'error' && (
                                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instruções de uso */}
                <div className={twMerge(
                    'p-6 rounded-lg border',
                    isDark ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50 border-blue-200'
                )}>
                    <h3 className={twMerge(
                        'text-lg font-medium mb-3',
                        isDark ? 'text-blue-300' : 'text-blue-800'
                    )}>
                        Instruções de Upload
                    </h3>
                    <ul className={twMerge(
                        'space-y-2 text-sm',
                        isDark ? 'text-blue-200' : 'text-blue-700'
                    )}>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Apenas arquivos PDF são aceitos</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Tamanho máximo de 50MB por arquivo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Você pode editar o nome do arquivo antes do upload</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Arraste múltiplos arquivos ou selecione vários de uma vez</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Arquivos duplicados serão automaticamente rejeitados</span>
                        </li>
                    </ul>
                </div>
            </div>
        </PageWrapper>
    )
}

export default UploadPDFsPage
