'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { UploadFileInfo } from '@/types/pdf'
import {
    Upload,
    File,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
    Plus
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface UploadZoneProps {
    files: UploadFileInfo[]
    isDragOver: boolean
    isUploading: boolean
    onFilesSelect: (files: FileList) => void
    onFileRemove: (fileId: string) => void
    onCustomNameChange: (fileId: string, name: string) => void
    onDragEnter: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    className?: string
}

/**
 * Componente de zona de upload com drag & drop
 * Suporta múltiplos arquivos, preview e customização de nomes
 */
export const UploadZone: React.FC<UploadZoneProps> = ({
    files,
    isDragOver,
    isUploading,
    onFilesSelect,
    onFileRemove,
    onCustomNameChange,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    className
}) => {
    const { isDark } = useTheme()

    // Handler para input de arquivo
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (selectedFiles && selectedFiles.length > 0) {
            onFilesSelect(selectedFiles)
        }
        // Limpar input para permitir selecionar o mesmo arquivo novamente
        e.target.value = ''
    }

    // Obter ícone baseado no status
    const getStatusIcon = (status: UploadFileInfo[ 'status' ]) => {
        switch (status) {
            case 'pending':
                return <File className="w-4 h-4 text-gray-500" />
            case 'uploading':
                return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />
            default:
                return <File className="w-4 h-4 text-gray-500" />
        }
    }

    // Obter cor da barra de progresso
    const getProgressColor = (status: UploadFileInfo[ 'status' ]) => {
        switch (status) {
            case 'uploading':
                return 'bg-blue-500'
            case 'success':
                return 'bg-green-500'
            case 'error':
                return 'bg-red-500'
            default:
                return 'bg-gray-300'
        }
    }

    return (
        <div className={twMerge('space-y-6', className)}>
            {/* Zona de Drop */}
            <div
                className={twMerge(
                    'relative border-2 border-dashed rounded-lg transition-all duration-200',
                    'min-h-[200px] flex flex-col items-center justify-center p-8',
                    isDragOver
                        ? isDark
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-blue-500 bg-blue-50'
                        : isDark
                            ? 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                )}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <div className="text-center space-y-4">
                    {/* Ícone de Upload */}
                    <div className={twMerge(
                        'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
                        isDragOver
                            ? isDark ? 'bg-blue-600' : 'bg-blue-500'
                            : isDark ? 'bg-gray-700' : 'bg-gray-200'
                    )}>
                        <Upload className={twMerge(
                            'w-8 h-8',
                            isDragOver ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-500'
                        )} />
                    </div>

                    {/* Texto instrucional */}
                    <div>
                        <p className={twMerge(
                            'text-lg font-medium mb-2',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            {isDragOver
                                ? 'Solte os arquivos aqui'
                                : 'Arraste arquivos PDF aqui'
                            }
                        </p>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            ou clique para selecionar
                        </p>
                    </div>

                    {/* Botão de seleção */}
                    <label className={twMerge(
                        'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200',
                        isDark
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    )}>
                        <Plus className="w-4 h-4" />
                        Selecionar Arquivos
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            multiple
                            className="hidden"
                            onChange={handleFileInput}
                            disabled={isUploading}
                        />
                    </label>

                    {/* Informações sobre limites */}
                    <p className={twMerge(
                        'text-xs',
                        isDark ? 'text-gray-500' : 'text-gray-400'
                    )}>
                        Máximo 50MB por arquivo • Apenas arquivos PDF
                    </p>
                </div>
            </div>

            {/* Lista de arquivos selecionados */}
            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className={twMerge(
                        'text-lg font-medium',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                        Arquivos Selecionados ({files.length})
                    </h3>

                    <div className="space-y-3">
                        {files.map((fileInfo) => (
                            <div
                                key={fileInfo.id}
                                className={twMerge(
                                    'p-4 rounded-lg border transition-all duration-200',
                                    fileInfo.status === 'error'
                                        ? isDark
                                            ? 'border-red-700 bg-red-900/20'
                                            : 'border-red-200 bg-red-50'
                                        : fileInfo.status === 'success'
                                            ? isDark
                                                ? 'border-green-700 bg-green-900/20'
                                                : 'border-green-200 bg-green-50'
                                            : isDark
                                                ? 'border-gray-700 bg-gray-800/50'
                                                : 'border-gray-200 bg-white'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Status Icon */}
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(fileInfo.status)}
                                    </div>

                                    {/* Informações do arquivo */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={twMerge(
                                                'text-sm font-medium truncate',
                                                isDark ? 'text-white' : 'text-gray-900'
                                            )}>
                                                {fileInfo.file.name}
                                            </span>
                                            <span className={twMerge(
                                                'text-xs px-2 py-1 rounded',
                                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                            )}>
                                                {(fileInfo.file.size / (1024 * 1024)).toFixed(1)} MB
                                            </span>
                                        </div>

                                        {/* Campo de nome customizado */}
                                        <input
                                            type="text"
                                            value={fileInfo.customName}
                                            onChange={(e) => onCustomNameChange(fileInfo.id, e.target.value)}
                                            placeholder="Nome personalizado (opcional)"
                                            disabled={fileInfo.status === 'uploading' || fileInfo.status === 'success'}
                                            className={twMerge(
                                                'w-full px-3 py-2 text-sm border rounded transition-colors',
                                                'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                                isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
                                                (fileInfo.status === 'uploading' || fileInfo.status === 'success') && 'opacity-60 cursor-not-allowed'
                                            )}
                                        />

                                        {/* Barra de progresso */}
                                        {fileInfo.status === 'uploading' && (
                                            <div className="mt-2">
                                                <div className={twMerge(
                                                    'w-full h-2 rounded-full overflow-hidden',
                                                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                                                )}>
                                                    <div
                                                        className={twMerge(
                                                            'h-full transition-all duration-300',
                                                            getProgressColor(fileInfo.status)
                                                        )}
                                                        style={{ width: `${fileInfo.progress}%` }}
                                                    />
                                                </div>
                                                <p className={twMerge(
                                                    'text-xs mt-1',
                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                )}>
                                                    {fileInfo.progress}% enviado
                                                </p>
                                            </div>
                                        )}

                                        {/* Mensagem de erro */}
                                        {fileInfo.status === 'error' && fileInfo.error && (
                                            <p className="text-sm text-red-500 mt-2">
                                                {fileInfo.error}
                                            </p>
                                        )}

                                        {/* Mensagem de sucesso */}
                                        {fileInfo.status === 'success' && (
                                            <p className="text-sm text-green-500 mt-2">
                                                Upload concluído com sucesso!
                                            </p>
                                        )}
                                    </div>

                                    {/* Botão de remoção */}
                                    {fileInfo.status !== 'uploading' && (
                                        <button
                                            onClick={() => onFileRemove(fileInfo.id)}
                                            className={twMerge(
                                                'p-2 rounded-lg transition-colors flex-shrink-0',
                                                isDark
                                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400'
                                                    : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'
                                            )}
                                            title="Remover arquivo"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
