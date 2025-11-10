'use client'

import React, { useState, useEffect } from 'react'
import { X, Folder, Check, Lock, Zap } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getPowerBIWorkspaces } from '@/app/actions/powerbi/embed'

interface Workspace {
  id: string
  name: string
  isReadOnly: boolean
  isOnDedicatedCapacity: boolean
  capacityId: string | null
  type: string
  state: string
  isOrphaned: boolean
  isCurrent: boolean
}

interface WorkspacesModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WorkspacesModal: React.FC<WorkspacesModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadWorkspaces()
    }
  }, [isOpen])

  const loadWorkspaces = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getPowerBIWorkspaces()
      
      if (result.sucesso) {
        setWorkspaces(result.workspaces)
        setCurrentWorkspaceId(result.currentWorkspaceId)
      } else {
        setError(result.erro || 'Erro ao carregar workspaces')
      }
    } catch (err) {
      setError('Erro ao carregar workspaces')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStateBadge = (workspace: Workspace) => {
    if (workspace.isCurrent) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Workspace Atual
        </span>
      )
    }

    const stateColors = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      Deleted: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }

    const color = stateColors[workspace.state as keyof typeof stateColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {workspace.state}
      </span>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🏢 Workspaces do Power BI
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Workspaces acessíveis pelo Service Principal
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 100px)' }}>
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Carregando workspaces...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
              <p className="text-red-800 dark:text-red-300">
                ❌ {error}
              </p>
            </div>
          )}

          {!loading && !error && workspaces.length === 0 && (
            <div className="text-center py-12">
              <Folder className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Nenhum workspace encontrado.
              </p>
            </div>
          )}

          {!loading && !error && workspaces.length > 0 && (
            <div className="space-y-3">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`p-4 rounded-lg border transition-all ${
                    workspace.isCurrent
                      ? isDark
                        ? 'bg-blue-900/20 border-blue-700 ring-2 ring-blue-500/50'
                        : 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/50'
                      : isDark
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Nome e Ícone */}
                      <div className="flex items-center gap-2 mb-2">
                        <Folder className={`w-5 h-5 flex-shrink-0 ${
                          workspace.isCurrent
                            ? 'text-blue-500'
                            : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <h3 className={`font-semibold truncate ${
                          workspace.isCurrent
                            ? 'text-blue-600 dark:text-blue-400'
                            : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {workspace.name}
                        </h3>
                      </div>

                      {/* ID */}
                      <p className={`text-xs font-mono mb-2 truncate ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        ID: {workspace.id}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {getStateBadge(workspace)}
                        
                        {workspace.isReadOnly && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Somente Leitura
                          </span>
                        )}
                        
                        {workspace.isOnDedicatedCapacity && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Capacidade Dedicada
                          </span>
                        )}

                        {workspace.isOrphaned && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            Órfão
                          </span>
                        )}

                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {workspace.type}
                        </span>
                      </div>

                      {/* Capacity ID */}
                      {workspace.capacityId && (
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Capacity ID: {workspace.capacityId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com estatísticas */}
        {!loading && !error && workspaces.length > 0 && (
          <div className={`sticky bottom-0 px-6 py-3 border-t ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Total: {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {workspaces.filter(w => w.isOnDedicatedCapacity).length} com capacidade dedicada
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
