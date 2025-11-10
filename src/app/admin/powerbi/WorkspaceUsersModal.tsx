'use client'

import React, { useState, useEffect } from 'react'
import { X, Users, Shield, Package } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getPowerBIWorkspaceUsers } from '@/app/actions/powerbi/embed'

interface WorkspaceUser {
  identifier: string
  displayName: string
  emailAddress: string | null
  groupUserAccessRight: string
  principalType: string
}

interface WorkspaceUsersModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WorkspaceUsersModal: React.FC<WorkspaceUsersModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<WorkspaceUser[]>([])
  const [groups, setGroups] = useState<WorkspaceUser[]>([])
  const [apps, setApps] = useState<WorkspaceUser[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadWorkspaceUsers()
    }
  }, [isOpen])

  const loadWorkspaceUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getPowerBIWorkspaceUsers()
      
      if (result.sucesso) {
        setUsers(result.users)
        setGroups(result.groups)
        setApps(result.apps)
      } else {
        setError(result.erro || 'Erro ao carregar usuários')
      }
    } catch (err) {
      setError('Erro ao carregar usuários do workspace')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getAccessRightBadge = (accessRight: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      Member: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      Contributor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      Viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    }

    const color = colors[accessRight as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {accessRight}
      </span>
    )
  }

  const renderUserList = (title: string, icon: React.ReactNode, list: WorkspaceUser[]) => {
    if (list.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title} ({list.length})
          </h3>
        </div>
        
        <div className="space-y-2">
          {list.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.displayName}
                  </p>
                  {item.emailAddress && (
                    <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.emailAddress}
                    </p>
                  )}
                  {item.identifier !== item.displayName && !item.emailAddress && (
                    <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.identifier}
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  {getAccessRightBadge(item.groupUserAccessRight)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              👥 Usuários e Grupos do Workspace
            </h2>
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
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Carregando usuários e grupos...
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

          {!loading && !error && (
            <>
              {renderUserList(
                'Usuários',
                <Users className="w-5 h-5 text-blue-500" />,
                users
              )}

              {renderUserList(
                'Grupos',
                <Shield className="w-5 h-5 text-green-500" />,
                groups
              )}

              {renderUserList(
                'Service Principals / Apps',
                <Package className="w-5 h-5 text-purple-500" />,
                apps
              )}

              {users.length === 0 && groups.length === 0 && apps.length === 0 && (
                <div className="text-center py-12">
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Nenhum usuário ou grupo encontrado no workspace.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
