'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Users,
    UserPlus,
    Search,
    Mail,
    Grid,
    List,
    Edit3,
    Trash2,
    AlertCircle,
    Loader2,
    RefreshCw,
    Key
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useUserShield } from '@/hooks/useUserShield'
import { UserShieldUser } from '@/services/userShieldService'
import EditUserModal from '@/components/usuarios/EditUserModal'
import ResetPasswordModal from '@/components/usuarios/ResetPasswordModal'
import AddUserModal from '@/components/usuarios/AddUserModal'
import DeleteUserModal from '@/components/usuarios/DeleteUserModal'

/**
 * Página de Gerenciamento de Usuários
 * 
 * @description
 * Exibe lista de usuários cadastrados no sistema UserShield com opções de:
 * - Visualização em lista ou grade
 * - Busca por nome, email, username, função ou departamento  
 * - Editar e excluir usuários
 * - Atualização manual da lista
 * - Exibição de perfis e permissões
 * 
 * @datasource API UserShield via /api/usershield/usuarios
 */
export default function UsuariosPage() {
    const { isDark } = useTheme()
    useLayout()
    const [ mounted, setMounted ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ viewMode, setViewMode ] = useState<'grid' | 'list'>('list')
    const [ editingUser, setEditingUser ] = useState<UserShieldUser | null>(null)
    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false)
    const [ resetPasswordUser, setResetPasswordUser ] = useState<UserShieldUser | null>(null)
    const [ isResetPasswordOpen, setIsResetPasswordOpen ] = useState(false)
    const [ isAddUserOpen, setIsAddUserOpen ] = useState(false)
    const [ deleteUser, setDeleteUser ] = useState<UserShieldUser | null>(null)
    const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false)

    // Hook para gerenciar dados do UserShield
    const { usuarios, loadingUsuarios, errorUsuarios, listarUsuarios } = useUserShield()
    const [ usuariosFiltrados, setUsuariosFiltrados ] = useState(usuarios)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Filtrar usuários baseado no termo de pesquisa
    useEffect(() => {
        const filterStart = Date.now()
        
        if (!searchTerm.trim()) {
            setUsuariosFiltrados(usuarios)
            console.log(`⏱️ [PERF Page] Filter (sem termo): ${Date.now() - filterStart}ms`)
            return
        }

        const termo = searchTerm.toLowerCase()
        const filtrados = usuarios.filter((user: any) =>
            user.name?.toLowerCase().includes(termo) ||
            user.email?.toLowerCase().includes(termo) ||
            user.userName?.toLowerCase().includes(termo) ||
            user.role?.toLowerCase().includes(termo) ||
            user.department?.toLowerCase().includes(termo) ||
            user.perfis?.some((perfil: any) =>
                perfil.nomePerfil?.toLowerCase().includes(termo)
            )
        )
        setUsuariosFiltrados(filtrados)
        console.log(`⏱️ [PERF Page] Filter (com termo): ${Date.now() - filterStart}ms - Resultados: ${filtrados.length}`)
    }, [ searchTerm, usuarios ])

    // Funções de gerenciamento
    const handleRefresh = async () => {
        console.log('🔄 [Page] handleRefresh chamado - recarregando usuários com FORCE REFRESH...')
        await listarUsuarios(true) // Force refresh para invalidar cache
        console.log('✅ [Page] listarUsuarios concluído')
    }

    const handleEditUser = (user: UserShieldUser) => {
        setEditingUser(user)
        setIsEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setEditingUser(null)
    }

    const handleEditSuccess = async () => {
        console.log('🔄 [Page] handleEditSuccess chamado - aguardando 1s para refresh...')
        
        // Aguardar 1 segundo para a API processar completamente
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('🔄 [Page] Iniciando refresh após delay...')
        await handleRefresh()
        console.log('✅ [Page] Refresh concluído, fechando modal...')
        setIsEditModalOpen(false)
        setEditingUser(null)
    }

    const handleResetPassword = (user: UserShieldUser) => {
        setResetPasswordUser(user)
        setIsResetPasswordOpen(true)
    }

    const handleCloseResetPassword = () => {
        setIsResetPasswordOpen(false)
        setResetPasswordUser(null)
    }

    const handleResetSuccess = async () => {
        // Pode chamar refresh se quiser atualizar algum dado
        // await handleRefresh()
        console.log('✅ Senha resetada com sucesso')
    }

    const handleAddUserSuccess = async () => {
        console.log('✅ Usuário criado com sucesso')
        await handleRefresh()
    }

    const handleDeleteUser = (user: UserShieldUser) => {
        setDeleteUser(user)
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setDeleteUser(null)
    }

    const handleDeleteSuccess = async () => {
        console.log('✅ Usuário excluído com sucesso')
        await handleRefresh()
    }

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
            {/* Header */}
            <div className="w-full shrink-0 px-4 pt-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className={twMerge(
                            'text-xl sm:text-2xl font-bold truncate',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            👥 Gerenciamento de Usuários
                        </h1>
                        <p className={twMerge(
                            'mt-1 text-sm',
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        )}>
                            Sistema completo de gerenciamento de usuários e permissões
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsAddUserOpen(true)}
                            className={twMerge(
                                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all',
                                'bg-blue-500 text-white hover:bg-blue-600'
                            )}
                        >
                            <UserPlus className="w-5 h-5 usuarios-userplus-icon" />
                            <span className="hidden sm:inline">Adicionar Usuário</span>
                            <span className="sm:hidden">Adicionar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className={twMerge(
                'flex-1 flex flex-col mx-4 mb-4 rounded-2xl border overflow-hidden shadow-lg',
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            )}>
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex flex-col h-full space-y-4">
                        {/* Cabeçalho da seção e controles - fixos no topo */}
                        <div className="flex flex-col gap-3 shrink-0">
                            {/* Linha 1: Título e botão de atualizar */}
                            <div className="flex items-start sm:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h2 className={twMerge(
                                        'text-lg sm:text-xl font-bold',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        👥 Usuários Cadastrados
                                    </h2>
                                    <p className={twMerge(
                                        'text-sm mt-1',
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    )}>
                                        {usuariosFiltrados.length} usuários encontrados
                                        {searchTerm && ' • Resultados da busca'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    disabled={loadingUsuarios}
                                    className={twMerge(
                                        'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shrink-0',
                                        'bg-gray-100/80 border-gray-300 hover:bg-gray-200/80 hover:border-blue-500/50',
                                        'dark:bg-gray-700/80 dark:border-gray-600 dark:hover:bg-gray-600/80 dark:hover:border-blue-400/50',
                                        'transition-all duration-300',
                                        'disabled:opacity-50 disabled:cursor-not-allowed'
                                    )}
                                    title="Atualizar lista"
                                    aria-label="Atualizar lista de usuários"
                                >
                                    <RefreshCw className={twMerge('w-5 h-5 navbar-refresh-icon', loadingUsuarios && 'animate-spin')} />
                                    <span className="hidden sm:inline">Atualizar</span>
                                </button>
                            </div>

                            {/* Linha 2: Busca e controles de visualização */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                {/* Barra de busca */}
                                <div className="relative flex-1">
                                    <Search className={twMerge(
                                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 usuarios-search-icon',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )} />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome, email, função..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={twMerge(
                                            'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                                            isDark
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        )}
                                    />
                                </div>

                                {/* Toggle visualização */}
                                <div className={twMerge(
                                    'flex gap-2 shrink-0'
                                )}>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={twMerge(
                                            'p-2 rounded-lg transition-all border',
                                            viewMode === 'list'
                                                ? isDark
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-primary text-primary-foreground border-primary'
                                                : isDark
                                                    ? 'hover:bg-gray-700 text-gray-400 border-gray-600'
                                                    : 'hover:bg-gray-50 text-gray-600 border-gray-300'
                                        )}
                                        title="Visualização em lista"
                                    >
                                        <List className="w-5 h-5 usuarios-list-icon" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={twMerge(
                                            'p-2 rounded-lg transition-all border',
                                            viewMode === 'grid'
                                                ? isDark
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-primary text-primary-foreground border-primary'
                                                : isDark
                                                    ? 'hover:bg-gray-700 text-gray-400 border-gray-600'
                                                    : 'hover:bg-gray-50 text-gray-600 border-gray-300'
                                        )}
                                        title="Visualização em grade"
                                    >
                                        <Grid className="w-5 h-5 usuarios-grid-icon" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mensagem de erro */}
                        {errorUsuarios && (
                            <div className={twMerge(
                                'flex items-center gap-3 p-4 rounded-lg border shrink-0',
                                isDark
                                    ? 'bg-red-900/20 border-red-800 text-red-200'
                                    : 'bg-red-50 border-red-200 text-red-700'
                            )}>
                                <AlertCircle className="w-5 h-5 shrink-0 usuarios-alert-icon" />
                                <div>
                                    <p className="font-medium">Erro ao carregar usuários</p>
                                    <p className="text-sm opacity-80">{errorUsuarios}</p>
                                </div>
                            </div>
                        )}

                        {/* Lista de usuários - com scroll */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loadingUsuarios ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : usuariosFiltrados.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users className={twMerge(
                                        'w-16 h-16 mb-4',
                                        isDark ? 'text-gray-600' : 'text-gray-400'
                                    )} />
                                    <p className={twMerge(
                                        'text-lg font-medium',
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    )}>
                                        {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                                    </p>
                                    {searchTerm && (
                                        <p className={twMerge(
                                            'text-sm mt-1',
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        )}>
                                            Tente ajustar os termos de busca
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className={twMerge(
                                    'grid gap-3 pb-4',
                                    viewMode === 'grid' && 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                )}>
                                    {usuariosFiltrados.map((user: any) => (
                                        <React.Fragment key={user.id}>
                                            {viewMode === 'list' ? (
                                                // List View
                                                <div
                                                    className={twMerge(
                                                    'flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md',
                                                    isDark
                                                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                )}
                                            >
                                                {/* Avatar e Info Principal */}
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={twMerge(
                                                        'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0',
                                                        isDark 
                                                            ? 'bg-blue-600 text-white' 
                                                            : 'bg-blue-600 text-white'
                                                    )}>
                                                        {user.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className={twMerge(
                                                            'font-semibold truncate',
                                                            isDark ? 'text-white' : 'text-gray-900'
                                                        )}>
                                                            {user.name || 'Nome não disponível'}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Mail className={twMerge(
                                                                'w-4 h-4 usuarios-mail-icon',
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                            )} />
                                                            <p className={twMerge(
                                                                'text-sm truncate',
                                                                isDark ? 'text-gray-300' : 'text-gray-600'
                                                            )}>
                                                                {user.email || 'Email não disponível'}
                                                            </p>
                                                        </div>
                                                        {user.userName && (
                                                            <p className={twMerge(
                                                                'text-xs mt-1',
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                            )}>
                                                                @{user.userName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Perfis */}
                                                {user.perfis && user.perfis.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 sm:max-w-[200px]">
                                                        {user.perfis.slice(0, 3).map((perfil: any) => (
                                                            <span
                                                                key={perfil.idPerfil}
                                                                className={twMerge(
                                                                    'px-2 py-1 text-xs rounded-md',
                                                                    isDark
                                                                        ? 'bg-blue-900/30 text-blue-200'
                                                                        : 'bg-blue-50 text-blue-700'
                                                                )}
                                                            >
                                                                {perfil.nomePerfil}
                                                            </span>
                                                        ))}
                                                        {user.perfis.length > 3 && (
                                                            <span key="more-badge" className={twMerge(
                                                                'px-2 py-1 text-xs rounded-md',
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                            )}>
                                                                +{user.perfis.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Ações */}
                                                <div className="flex gap-2 sm:ml-auto">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className={twMerge(
                                                            'p-2 rounded-lg transition-all',
                                                            isDark
                                                                ? 'hover:bg-blue-900/50 text-blue-400'
                                                                : 'hover:bg-blue-50 text-blue-600'
                                                        )}
                                                        title="Editar usuário"
                                                    >
                                                        <Edit3 className="w-5 h-5 usuarios-edit-icon" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        className={twMerge(
                                                            'p-2 rounded-lg transition-all',
                                                            isDark
                                                                ? 'hover:bg-yellow-900/50 text-yellow-400'
                                                                : 'hover:bg-yellow-50 text-yellow-600'
                                                        )}
                                                        title="Resetar senha"
                                                    >
                                                        <Key className="w-5 h-5 usuarios-key-icon" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className={twMerge(
                                                            'p-2 rounded-lg transition-all',
                                                            isDark
                                                                ? 'hover:bg-red-900/50 text-red-400'
                                                                : 'hover:bg-red-50 text-red-600'
                                                        )}
                                                        title="Excluir usuário"
                                                    >
                                                        <Trash2 className="w-5 h-5 usuarios-trash-icon" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Grid View
                                            <div
                                                className={twMerge(
                                                    'flex flex-col p-4 rounded-lg border transition-all hover:shadow-md',
                                                    isDark
                                                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                )}
                                            >
                                                {/* Avatar e Nome */}
                                                <div className="flex flex-col items-center text-center mb-3">
                                                    <div className={twMerge(
                                                        'w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-2',
                                                        isDark 
                                                            ? 'bg-blue-600 text-white' 
                                                            : 'bg-blue-600 text-white'
                                                    )}>
                                                        {user.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <h3 className={twMerge(
                                                        'font-semibold text-sm truncate w-full',
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    )}>
                                                        {user.name || 'Nome não disponível'}
                                                    </h3>
                                                    <p className={twMerge(
                                                        'text-xs truncate w-full mt-1',
                                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                                    )}>
                                                        {user.email || 'Email não disponível'}
                                                    </p>
                                                    {user.userName && (
                                                        <p className={twMerge(
                                                            'text-xs mt-1',
                                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                                        )}>
                                                            @{user.userName}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Perfis */}
                                                {user.perfis && user.perfis.length > 0 && (
                                                    <div className="flex flex-col gap-2 mb-3 flex-1">
                                                        <p className={twMerge(
                                                            'text-xs font-medium',
                                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                                        )}>
                                                            Perfis:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.perfis.slice(0, 3).map((perfil: any) => (
                                                                <span
                                                                    key={perfil.idPerfil}
                                                                    className={twMerge(
                                                                        'px-2 py-1 text-xs rounded-md',
                                                                        isDark
                                                                            ? 'bg-blue-900/30 text-blue-200'
                                                                            : 'bg-blue-50 text-blue-700'
                                                                    )}
                                                                >
                                                                    {perfil.nomePerfil}
                                                                </span>
                                                            ))}
                                                            {user.perfis.length > 3 && (
                                                                <span key="more-badge" className={twMerge(
                                                                    'px-2 py-1 text-xs rounded-md',
                                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                                )}>
                                                                    +{user.perfis.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Ações */}
                                                <div className="flex gap-2 pt-3 border-t border-border">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className={twMerge(
                                                            'flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all',
                                                            isDark
                                                                ? 'hover:bg-blue-900/50 text-blue-400'
                                                                : 'hover:bg-blue-50 text-blue-600'
                                                        )}
                                                        title="Editar"
                                                    >
                                                        <Edit3 className="w-5 h-5 usuarios-edit-icon" />
                                                        <span className="text-xs font-medium">Editar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        className={twMerge(
                                                            'flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all',
                                                            isDark
                                                                ? 'hover:bg-yellow-900/50 text-yellow-400'
                                                                : 'hover:bg-yellow-50 text-yellow-600'
                                                        )}
                                                        title="Resetar"
                                                    >
                                                        <Key className="w-5 h-5 usuarios-key-icon" />
                                                        <span className="text-xs font-medium">Resetar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className={twMerge(
                                                            'flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all',
                                                            isDark
                                                                ? 'hover:bg-red-900/50 text-red-400'
                                                                : 'hover:bg-red-50 text-red-600'
                                                        )}
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-5 h-5 usuarios-trash-icon" />
                                                        <span className="text-xs font-medium">Excluir</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal de Edição de Usuário */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Modal de Reset de Senha */}
            {resetPasswordUser && (
                <ResetPasswordModal
                    user={{
                        id: resetPasswordUser.id,
                        name: resetPasswordUser.name || 'Usuário',
                        userName: resetPasswordUser.userName || 'usuario',
                        email: resetPasswordUser.email
                    }}
                    isOpen={isResetPasswordOpen}
                    onClose={handleCloseResetPassword}
                    onSuccess={handleResetSuccess}
                />
            )}

            {/* Modal de Adicionar Usuário */}
            <AddUserModal
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                onSuccess={handleAddUserSuccess}
            />

            {/* Modal de Exclusão de Usuário */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onSuccess={handleDeleteSuccess}
                user={deleteUser}
            />
        </div>
    )
}
