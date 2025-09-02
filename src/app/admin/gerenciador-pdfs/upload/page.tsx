'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
import { UploadFileInfo, UploadState, NomeComposicao } from '@/types/pdf'
import { PDFManagerService } from '@/services/pdfManager/pdfManagerService'

const UploadGerenciadorPDFsPage = () => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios conforme AGENT-CONTEXT
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // 🎯 STEP 2: PRESERVAÇÃO - Estados migrados com tipos corretos
    const [ mounted, setMounted ] = useState(false)
    const [ uploadState, setUploadState ] = useState<UploadState>({
        files: [],
        isUploading: false,
        overallProgress: 0
    })

    // Estados para composição do nome dos arquivos
    const [ nomeComposicao, setNomeComposicao ] = useState<NomeComposicao>({
        cdPessoaFisica: '',
        numeroAtendimento: '',
        dataUpload: '', // Será preenchido no useEffect
        hash: ''
    })

    const [ dragActive, setDragActive ] = useState(false)
    const [ validationErrors, setValidationErrors ] = useState<Record<string, string>>({})
    const [ error, setError ] = useState<string | null>(null)
    const [ success, setSuccess ] = useState(false)
    const [ uploadedFiles, setUploadedFiles ] = useState<string[]>([])

    // Função para formatar data no formato DDMMAAAA
    const formatDateDDMMAAAA = (date: Date = new Date()): string => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString()
        return `${day}${month}${year}`
    }

    useEffect(() => {
        setMounted(true)
        // Gerar hash único para a sessão e definir data no formato DDMMAAAA
        setNomeComposicao(prev => ({
            ...prev,
            dataUpload: formatDateDDMMAAAA(),
            hash: Math.random().toString(36).substring(2, 8).toUpperCase()
        }))
    }, [])

    // Validation functions (TODO: Adaptar para API do gerenciador)
    const validateFile = (file: File): string | null => {
        // Validar tipo
        if (!file.type.includes('pdf')) {
            return 'Apenas arquivos PDF são permitidos'
        }

        // Validar tamanho (50MB max)
        const maxSize = 50 * 1024 * 1024
        if (file.size > maxSize) {
            return 'Arquivo muito grande (máximo 50MB)'
        }

        return null
    }

    const handleFileSelect = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files)
        const validFiles: UploadFileInfo[] = []
        const errors: Record<string, string> = {}

        fileArray.forEach(file => {
            const error = validateFile(file)
            if (error) {
                errors[ file.name ] = error
            } else {
                validFiles.push({
                    id: `${Date.now()}-${Math.random()}`,
                    file,
                    customName: file.name.replace('.pdf', ''),
                    progress: 0,
                    status: 'pending'
                })
            }
        })

        setValidationErrors(errors)
        setUploadState(prev => ({
            ...prev,
            files: [ ...prev.files, ...validFiles ]
        }))
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)

        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files)
        }
    }, [ handleFileSelect ])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
    }, [])

    const removeFile = (fileId: string) => {
        setUploadState(prev => ({
            ...prev,
            files: prev.files.filter(f => f.id !== fileId)
        }))
    }

    const uploadFiles = async () => {
        if (uploadState.files.length === 0) return

        // Validar parâmetros de composição
        if (!nomeComposicao.cdPessoaFisica.trim()) {
            setError('Código da Pessoa Física é obrigatório')
            return
        }
        if (!nomeComposicao.numeroAtendimento.trim()) {
            setError('Número do Atendimento é obrigatório')
            return
        }
        if (!nomeComposicao.dataUpload.trim() || nomeComposicao.dataUpload.length !== 8) {
            setError('Data deve estar no formato DDMMAAAA (8 dígitos)')
            return
        }

        // Validar se a data é válida
        const day = parseInt(nomeComposicao.dataUpload.substring(0, 2))
        const month = parseInt(nomeComposicao.dataUpload.substring(2, 4))
        const year = parseInt(nomeComposicao.dataUpload.substring(4, 8))

        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
            setError('Data inválida. Use o formato DDMMAAAA com uma data válida')
            return
        }

        setUploadState(prev => ({ ...prev, isUploading: true, overallProgress: 0 }))
        setError(null)

        try {
            const pendingFiles = uploadState.files.filter(f => f.status === 'pending')
            if (pendingFiles.length === 0) return

            // Atualizar todos os arquivos para status 'uploading'
            setUploadState(prev => ({
                ...prev,
                files: prev.files.map(f =>
                    f.status === 'pending'
                        ? { ...f, status: 'uploading' as const, progress: 0 }
                        : f
                )
            }))

            // Simular progresso durante upload
            const progressInterval = setInterval(() => {
                setUploadState(prev => ({
                    ...prev,
                    files: prev.files.map(f =>
                        f.status === 'uploading' && f.progress < 90
                            ? { ...f, progress: f.progress + 10 }
                            : f
                    ),
                    overallProgress: Math.min(
                        Math.round((prev.files.filter(f => f.status === 'uploading').reduce((acc, f) => acc + f.progress, 0) / pendingFiles.length) * 0.9),
                        90
                    )
                }))
            }, 500)

            // Preparar dados para upload em lote
            const batchUploadData = pendingFiles.map((fileInfo, index) => ({
                file: fileInfo.file,
                nomeComposicao: {
                    ...nomeComposicao,
                    // Adicionar índice ao hash para garantir unicidade
                    hash: `${nomeComposicao.hash}${index.toString().padStart(2, '0')}`
                }
            }))

            console.log('📦 [UploadPage] Iniciando upload em lote de', pendingFiles.length, 'arquivos')

            // Upload em lote usando PDFManagerService
            await PDFManagerService.uploadMultiplePDFs(batchUploadData)

            clearInterval(progressInterval)

            // Atualizar todos os arquivos para sucesso
            setUploadState(prev => ({
                ...prev,
                files: prev.files.map(f =>
                    f.status === 'uploading'
                        ? { ...f, status: 'success' as const, progress: 100 }
                        : f
                ),
                overallProgress: 100,
                isUploading: false
            }))

            // Verificar se houve uploads com sucesso
            if (pendingFiles.length > 0) {
                setSuccess(true)
                setUploadedFiles(pendingFiles.map(f => f.customName))
            }

        } catch (error) {
            console.error('❌ [UploadPage] Erro no upload em lote:', error)

            // Marcar todos os arquivos em uploading como erro
            setUploadState(prev => ({
                ...prev,
                files: prev.files.map(f =>
                    f.status === 'uploading'
                        ? {
                            ...f,
                            status: 'error' as const,
                            error: error instanceof Error ? error.message : 'Erro no upload em lote'
                        }
                        : f
                ),
                isUploading: false,
                overallProgress: 0
            }))

            setError(`Erro ao fazer upload dos arquivos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
        }
    }

    const resetUpload = () => {
        setUploadState({
            files: [],
            isUploading: false,
            overallProgress: 0
        })
        setValidationErrors({})
        setError(null)
        setSuccess(false)
        setUploadedFiles([])
    }

    if (!mounted) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className={twMerge(
                'space-y-6 transition-colors duration-200',
                isDark ? 'text-gray-100' : 'text-gray-900'
            )}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>

                        <div className={twMerge(
                            'p-2 rounded-lg',
                            isDark ? 'bg-gray-700' : 'bg-blue-50'
                        )}>
                            <Upload className={twMerge(
                                'h-6 w-6',
                                isDark ? 'text-blue-400' : 'text-blue-600'
                            )} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Upload - Gerenciador</h1>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Adicionar novos documentos ao gerenciador
                            </p>
                        </div>
                    </div>
                </div>

                {/* Parâmetros de Composição do Nome */}
                <div className={twMerge(
                    'bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 space-y-4',
                    isDark ? 'border border-gray-700' : 'border border-gray-200'
                )}>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-semibold">Parâmetros de Composição do Nome</h2>
                    </div>
                    <p className={twMerge(
                        'text-sm mb-4',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                        Os arquivos serão nomeados no formato: <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">cdPessoa_numAtendimento_DDMMAAAA_hash.pdf</code>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Código Pessoa Física *</label>
                            <Input
                                type="text"
                                placeholder="Ex: 123456"
                                value={nomeComposicao.cdPessoaFisica}
                                onChange={(e) => setNomeComposicao(prev => ({
                                    ...prev,
                                    cdPessoaFisica: e.target.value
                                }))}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Número Atendimento *</label>
                            <Input
                                type="text"
                                placeholder="Ex: ATD001"
                                value={nomeComposicao.numeroAtendimento}
                                onChange={(e) => setNomeComposicao(prev => ({
                                    ...prev,
                                    numeroAtendimento: e.target.value
                                }))}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Upload</label>
                            <Input
                                type="text"
                                value={nomeComposicao.dataUpload}
                                onChange={(e) => {
                                    // Permitir apenas números e máximo 8 dígitos
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                                    setNomeComposicao(prev => ({
                                        ...prev,
                                        dataUpload: value
                                    }))
                                }}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                placeholder="DDMMAAAA"
                                maxLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hash</label>
                            <Input
                                type="text"
                                value={nomeComposicao.hash}
                                onChange={(e) => setNomeComposicao(prev => ({
                                    ...prev,
                                    hash: e.target.value.toUpperCase()
                                }))}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                placeholder="Ex: ABC123"
                                maxLength={8}
                            />
                        </div>
                    </div>

                    {/* Preview do nome */}
                    <div className={twMerge(
                        'mt-4 p-3 rounded-md border',
                        isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-100 border-gray-200'
                    )}>
                        <div className="text-sm">
                            <span className="font-medium">Preview do nome:</span>
                            <code className={twMerge(
                                'ml-2 px-2 py-1 rounded text-xs',
                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'
                            )}>
                                {nomeComposicao.cdPessoaFisica || 'cdPessoa'}_{nomeComposicao.numeroAtendimento || 'numAtendimento'}_{nomeComposicao.dataUpload}_{nomeComposicao.hash || 'hash'}.pdf
                            </code>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className={twMerge(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
                    dragActive
                        ? isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                        : isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50',
                    uploadState.isUploading && 'pointer-events-none opacity-60'
                )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="space-y-4">
                        <div className={twMerge(
                            'mx-auto w-12 h-12 flex items-center justify-center rounded-full',
                            isDark ? 'bg-gray-700' : 'bg-white'
                        )}>
                            <FolderOpen className={twMerge(
                                'h-6 w-6',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )} />
                        </div>

                        <div>
                            <p className={twMerge(
                                'text-lg font-medium mb-1',
                                isDark ? 'text-gray-200' : 'text-gray-900'
                            )}>
                                Arraste arquivos PDF aqui
                            </p>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                ou clique para selecionar
                            </p>
                        </div>

                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                            className="hidden"
                            id="file-upload"
                        />

                        <label
                            htmlFor="file-upload"
                            className={twMerge(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors',
                                isDark
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            )}
                        >
                            <Upload className="h-4 w-4" />
                            Selecionar Arquivos
                        </label>

                        <p className={twMerge(
                            'text-xs',
                            isDark ? 'text-gray-500' : 'text-gray-500'
                        )}>
                            Máximo 50MB por arquivo • Apenas PDFs
                        </p>
                    </div>
                </div>

                {/* Validation Errors */}
                {Object.keys(validationErrors).length > 0 && (
                    <div className={twMerge(
                        'p-4 rounded-lg border',
                        isDark
                            ? 'bg-red-900/20 border-red-500/50'
                            : 'bg-red-50 border-red-200'
                    )}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className={twMerge(
                                'h-4 w-4',
                                isDark ? 'text-red-400' : 'text-red-600'
                            )} />
                            <span className={twMerge(
                                'text-sm font-medium',
                                isDark ? 'text-red-200' : 'text-red-800'
                            )}>
                                Arquivos com problemas:
                            </span>
                        </div>
                        <ul className="space-y-1">
                            {Object.entries(validationErrors).map(([ filename, error ]) => (
                                <li key={filename} className={twMerge(
                                    'text-sm',
                                    isDark ? 'text-red-300' : 'text-red-700'
                                )}>
                                    <strong>{filename}:</strong> {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Selected Files */}
                {uploadState.files.length > 0 && (
                    <div className={twMerge(
                        'border rounded-lg',
                        isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-white'
                    )}>
                        <div className={twMerge(
                            'px-4 py-3 border-b',
                            isDark ? 'border-gray-600' : 'border-gray-200'
                        )}>
                            <h3 className="font-medium">
                                Arquivos Selecionados ({uploadState.files.length})
                            </h3>
                        </div>

                        <div className="p-4 space-y-3">
                            {uploadState.files.map((fileInfo) => (
                                <div
                                    key={fileInfo.id}
                                    className={twMerge(
                                        'flex items-center gap-3 p-3 rounded-lg',
                                        isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                                    )}
                                >
                                    <FileText className={twMerge(
                                        'h-5 w-5 flex-shrink-0',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )} />

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{fileInfo.customName}.pdf</p>
                                        <p className={twMerge(
                                            'text-sm',
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        )}>
                                            {(fileInfo.file.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {fileInfo.status === 'success' && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                        {fileInfo.status === 'uploading' && (
                                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                        )}
                                        {fileInfo.status === 'error' && (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        {fileInfo.status === 'pending' && (
                                            <button
                                                onClick={() => removeFile(fileInfo.id)}
                                                className={twMerge(
                                                    'p-1 rounded-full transition-colors',
                                                    isDark
                                                        ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                                                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                                )}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload Progress */}
                {uploadState.isUploading && (
                    <div className={twMerge(
                        'p-4 rounded-lg border',
                        isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-white'
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                            <span className="font-medium">Fazendo upload...</span>
                        </div>

                        <div className={twMerge(
                            'w-full bg-gray-200 rounded-full h-2',
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                        )}>
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadState.overallProgress}%` }}
                            />
                        </div>

                        <p className={twMerge(
                            'text-sm mt-2',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            {uploadState.overallProgress.toFixed(0)}% concluído
                        </p>
                    </div>
                )}

                {/* Success State */}
                {success && (
                    <div className={twMerge(
                        'p-4 rounded-lg border',
                        isDark
                            ? 'bg-green-900/20 border-green-500/50'
                            : 'bg-green-50 border-green-200'
                    )}>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className={twMerge(
                                'h-5 w-5',
                                isDark ? 'text-green-400' : 'text-green-600'
                            )} />
                            <span className={twMerge(
                                'font-medium',
                                isDark ? 'text-green-200' : 'text-green-800'
                            )}>
                                Upload concluído com sucesso!
                            </span>
                        </div>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-green-300' : 'text-green-700'
                        )}>
                            {uploadedFiles.length} arquivo{uploadedFiles.length !== 1 ? 's' : ''}
                            adicionado{uploadedFiles.length !== 1 ? 's' : ''} ao gerenciador
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className={twMerge(
                        'p-4 rounded-lg border',
                        isDark
                            ? 'bg-red-900/20 border-red-500/50'
                            : 'bg-red-50 border-red-200'
                    )}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className={twMerge(
                                'h-4 w-4',
                                isDark ? 'text-red-400' : 'text-red-600'
                            )} />
                            <span className={twMerge(
                                'font-medium',
                                isDark ? 'text-red-200' : 'text-red-800'
                            )}>
                                Erro no upload
                            </span>
                        </div>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-red-300' : 'text-red-700'
                        )}>
                            {error}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {uploadState.files.length > 0 && !success && (
                        <>
                            <Button
                                variant="primary"
                                onClick={uploadFiles}
                                disabled={uploadState.isUploading}
                                className="flex items-center gap-2"
                            >
                                {uploadState.isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Fazer Upload ({uploadState.files.length})
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={resetUpload}
                                disabled={uploadState.isUploading}
                            >
                                Limpar
                            </Button>
                        </>
                    )}

                    {success && (
                        <Button
                            variant="primary"
                            onClick={resetUpload}
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Fazer Novo Upload
                        </Button>
                    )}
                </div>
            </div>
        </PageWrapper>
    )
}

export default UploadGerenciadorPDFsPage
