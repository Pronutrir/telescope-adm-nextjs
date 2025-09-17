'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Users,
    KeyRound,
    UserPlus,
    Search,
    Grid,
    List,
    Edit3,
    Trash2,
    Download,

    AlertCircle,
    Settings,
    Shield,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Loader2,
    Plus,
    Filter
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useUserShield } from '@/hooks/useUserShield'
import { Modal, useModal } from '@/components/ui/Modal'

// Componente para exibir detalhes completos do usuário
const UserDetailsContent = ({ user, isDark }: { user: any, isDark: boolean }) => {
    return (
        <div className="space-y-6">
            {/* Cabeçalho do usuário */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <div className={twMerge(
                        'w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl',
                        user.status === 'Ativo'
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                    )}>
                        {user.name.split(' ').map((n: string) => n[ 0 ]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className={twMerge(
                        'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2',
                        user.status === 'Ativo'
                            ? 'bg-green-500 border-green-200'
                            : 'bg-red-500 border-red-200',
                        isDark ? 'border-gray-800' : 'border-white'
                    )}></div>
                </div>
                <div>
                    <h3 className={twMerge(
                        'text-xl font-bold',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                        {user.name}
                    </h3>
                    <p className={twMerge(
                        'text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                        {user.userName && `@${user.userName} • `}
                        {user.role || 'Usuário'}
                    </p>
                </div>
            </div>

            {/* Informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className={twMerge(
                        'text-lg font-semibold flex items-center gap-2',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                        <Users className="w-5 h-5 navbar-settings-icon" />
                        Informações Básicas
                    </h4>

                    <div className="space-y-3">
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                ID do Usuário
                            </label>
                            <p className={twMerge(
                                'text-sm px-3 py-2 rounded-lg font-mono',
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            )}>
                                {user.id}
                            </p>
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Nome Completo
                            </label>
                            <p className={twMerge(
                                'text-sm px-3 py-2 rounded-lg',
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            )}>
                                {user.name}
                            </p>
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Email
                            </label>
                            <p className={twMerge(
                                'text-sm px-3 py-2 rounded-lg flex items-center gap-2',
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            )}>
                                <Mail className="w-4 h-4 navbar-settings-icon" />
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Nome de Usuário
                            </label>
                            <p className={twMerge(
                                'text-sm px-3 py-2 rounded-lg',
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            )}>
                                {user.userName || 'Não informado'}
                            </p>
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Status
                            </label>
                            <span className={twMerge(
                                'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium',
                                user.status === 'Ativo'
                                    ? isDark
                                        ? 'bg-green-900/30 text-green-300 border border-green-700'
                                        : 'bg-green-100 text-green-700 border border-green-200'
                                    : isDark
                                        ? 'bg-red-900/30 text-red-300 border border-red-700'
                                        : 'bg-red-100 text-red-700 border border-red-200'
                            )}>
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className={twMerge(
                        'text-lg font-semibold flex items-center gap-2',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                        <Shield className="w-5 h-5 navbar-settings-icon" />
                        Permissões e Acesso
                    </h4>

                    <div className="space-y-3">
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Função Principal
                            </label>
                            <span className={twMerge(
                                'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium',
                                user.role?.includes('Administrador')
                                    ? isDark
                                        ? 'bg-purple-900/30 text-purple-300 border border-purple-700'
                                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : user.role?.includes('Gestor') || user.role?.includes('Gerente')
                                        ? isDark
                                            ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : user.role?.includes('Supervisor')
                                            ? isDark
                                                ? 'bg-orange-900/30 text-orange-300 border border-orange-700'
                                                : 'bg-orange-100 text-orange-700 border border-orange-200'
                                            : isDark
                                                ? 'bg-gray-800 text-gray-300 border border-gray-700'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            )}>
                                <Shield className="w-4 h-4 mr-2 navbar-settings-icon" />
                                {user.role || 'Usuário'}
                            </span>
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Departamento
                            </label>
                            <p className={twMerge(
                                'text-sm px-3 py-2 rounded-lg flex items-center gap-2',
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            )}>
                                <MapPin className="w-4 h-4 navbar-settings-icon" />
                                {user.department || 'Não informado'}
                            </p>
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-1',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Último Acesso
                            </label>
                            <p className={twMerge(
                                'text-sm px-3 py-2 rounded-lg flex items-center gap-2',
                                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            )}>
                                <Calendar className="w-4 h-4 navbar-settings-icon" />
                                {user.lastLogin || 'Nunca acessou'}
                            </p>
                        </div>

                        {/* Perfis adicionais */}
                        {user.perfis && user.perfis.length > 0 && (
                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Perfis Adicionais ({user.perfis.length})
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {user.perfis.map((perfil: any) => (
                                        <span
                                            key={perfil.id}
                                            className={twMerge(
                                                'px-3 py-1 rounded-full text-xs font-medium border',
                                                isDark
                                                    ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700'
                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                            )}
                                        >
                                            {perfil.nomePerfil}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dados técnicos (JSON Raw) */}
            <div>
                <h4 className={twMerge(
                    'text-lg font-semibold flex items-center gap-2 mb-3',
                    isDark ? 'text-white' : 'text-gray-900'
                )}>
                    <Settings className="w-5 h-5 navbar-settings-icon" />
                    Dados Técnicos
                </h4>
                <div className={twMerge(
                    'p-4 rounded-lg border',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                )}>
                    <pre className={twMerge(
                        'text-xs font-mono overflow-auto max-h-40',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}

// Componente para renderizar conteúdo de cada aba
const TabContent = ({ activeTab, searchTerm, setSearchTerm, isLoading, viewMode, setViewMode, usuarios, usuariosFiltrados, loadingUsuarios, errorUsuarios, onViewUserDetails }: {
    activeTab: string,
    searchTerm: string,
    setSearchTerm: (term: string) => void,
    isLoading: boolean,
    viewMode: 'grid' | 'list',
    setViewMode: (mode: 'grid' | 'list') => void,
    usuarios: any[],
    usuariosFiltrados: any[],
    loadingUsuarios: boolean,
    errorUsuarios: string | null,
    onViewUserDetails: (user: any) => void
}) => {
    const { isDark } = useTheme()

    switch (activeTab) {
        case 'cadastrados':
            return (
                <div className="space-y-6">
                    {/* Cabeçalho da seção */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className={twMerge(
                                'text-xl font-bold flex items-center gap-2',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                👥 Usuários Cadastrados
                                {!loadingUsuarios && (
                                    <span className={twMerge(
                                        'text-sm px-3 py-1 rounded-full font-medium',
                                        isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                    )}>
                                        {usuariosFiltrados.length}
                                        {searchTerm && usuarios.length !== usuariosFiltrados.length && ` de ${usuarios.length}`}
                                    </span>
                                )}
                            </h2>
                            <div className={twMerge(
                                'text-sm mt-1 flex items-center gap-4',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                {loadingUsuarios ? (
                                    <span>Carregando dados da UserShield API...</span>
                                ) : (
                                    <>
                                        <span>
                                            {usuariosFiltrados.length} usuários
                                            {searchTerm && ` encontrados para "${searchTerm}"`}
                                        </span>
                                        {usuarios.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    {usuarios.filter(u => u.status === 'Ativo').length} ativos
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {usuarios.filter(u => u.role?.includes('Administrador')).length} administradores
                                                </span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Controles de busca e visualização */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 navbar-search-icon" />
                            <input
                                type="text"
                                placeholder="🔍 Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={twMerge(
                                    'pl-10 h-12 w-full rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                                    isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                )}
                            />
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin navbar-bell-icon" />
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={twMerge(
                                    'p-3 rounded-lg transition-colors',
                                    viewMode === 'list'
                                        ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                )}
                            >
                                <List className="w-5 h-5 navbar-message-icon" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={twMerge(
                                    'p-3 rounded-lg transition-colors',
                                    viewMode === 'grid'
                                        ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                )}
                            >
                                <Grid className="w-5 h-5 navbar-settings-icon" />
                            </button>
                        </div>
                    </div>                    {/* Mensagem de erro */}
                    {errorUsuarios && (
                        <div className={twMerge(
                            'p-4 rounded-lg border-l-4 border-red-500',
                            isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                        )}>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 navbar-bell-icon" />
                                <p className="font-medium">Erro ao carregar usuários</p>
                            </div>
                            <p className="text-sm mt-1">{errorUsuarios}</p>
                        </div>
                    )}

                    {/* Lista/Grid de usuários */}
                    <div className={twMerge(
                        'grid gap-4',
                        viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                            : 'grid-cols-1'
                    )}>
                        {loadingUsuarios ? (
                            <div className="col-span-full flex items-center justify-center py-12">
                                <div className="text-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3 navbar-bell-icon" />
                                    <p className={twMerge(
                                        'text-lg font-medium',
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    )}>
                                        Carregando usuários...
                                    </p>
                                    <p className={twMerge(
                                        'text-sm mt-1',
                                        isDark ? 'text-gray-500' : 'text-gray-500'
                                    )}>
                                        Obtendo dados reais da UserShield API
                                    </p>
                                </div>
                            </div>
                        ) : usuariosFiltrados.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <Users className="w-16 h-16 mx-auto text-gray-400 mb-6 navbar-settings-icon" />
                                <h3 className={twMerge(
                                    'text-lg font-semibold mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                                </h3>
                                <p className={twMerge(
                                    'text-sm mb-4',
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                )}>
                                    {searchTerm
                                        ? `Não encontramos usuários que correspondam a "${searchTerm}"`
                                        : 'Não há usuários cadastrados no sistema no momento'
                                    }
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className={twMerge(
                                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                            isDark
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        )}
                                    >
                                        Limpar pesquisa
                                    </button>
                                )}
                            </div>
                        ) : usuariosFiltrados.map((user) => (
                            <div
                                key={user.id}
                                className={twMerge(
                                    'rounded-xl border transition-all hover:shadow-lg hover:scale-[1.01]',
                                    viewMode === 'grid' ? 'p-4' : 'p-6',
                                    isDark
                                        ? 'bg-gray-800/70 border-gray-700 hover:bg-gray-800'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                )}
                            >
                                <div className={twMerge(
                                    'flex justify-between',
                                    viewMode === 'grid' ? 'flex-col gap-3' : 'items-start'
                                )}>
                                    <div className={twMerge(
                                        'flex gap-4 flex-1',
                                        viewMode === 'grid' ? 'flex-col items-center text-center' : 'items-start'
                                    )}>
                                        {/* Avatar com status */}
                                        <div className="relative">
                                            <div className={twMerge(
                                                'rounded-full flex items-center justify-center text-white font-bold',
                                                viewMode === 'grid' ? 'w-16 h-16 text-xl' : 'w-14 h-14 text-lg',
                                                user.status === 'Ativo'
                                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                                    : 'bg-gradient-to-br from-red-500 to-red-600'
                                            )}>
                                                {user.name.split(' ').map((n: string) => n[ 0 ]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            {/* Indicador de status */}
                                            <div className={twMerge(
                                                'absolute -bottom-1 -right-1 rounded-full border-2',
                                                viewMode === 'grid' ? 'w-6 h-6' : 'w-5 h-5',
                                                user.status === 'Ativo'
                                                    ? 'bg-green-500 border-green-200'
                                                    : 'bg-red-500 border-red-200',
                                                isDark ? 'border-gray-800' : 'border-white'
                                            )}></div>
                                        </div>

                                        <div className={twMerge(
                                            'flex-1 min-w-0',
                                            viewMode === 'grid' ? 'w-full' : ''
                                        )}>
                                            {/* Nome e userName */}
                                            <div className={twMerge(
                                                'mb-2',
                                                viewMode === 'grid'
                                                    ? 'text-center'
                                                    : 'flex items-center gap-2'
                                            )}>
                                                <h3 className={twMerge(
                                                    'font-bold truncate',
                                                    viewMode === 'grid' ? 'text-base mb-1' : 'text-lg',
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                )}>
                                                    {user.name}
                                                </h3>
                                                {user.userName && (
                                                    <span className={twMerge(
                                                        'text-xs px-2 py-1 rounded-full font-medium',
                                                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                                    )}>
                                                        @{user.userName}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <p className={twMerge(
                                                'text-sm mb-3 truncate',
                                                viewMode === 'grid'
                                                    ? 'text-center'
                                                    : 'flex items-center gap-1',
                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                            )}>
                                                {viewMode === 'list' && <Mail className="w-4 h-4 shrink-0 navbar-settings-icon" />}
                                                {user.email}
                                            </p>

                                            {/* Tags de perfis/roles */}
                                            <div className={twMerge(
                                                'flex flex-wrap gap-2 mb-3',
                                                viewMode === 'grid' ? 'justify-center' : ''
                                            )}>
                                                {/* Role principal */}
                                                <span className={twMerge(
                                                    'text-xs px-3 py-1 rounded-full font-medium inline-flex items-center gap-1',
                                                    user.role?.includes('Administrador')
                                                        ? isDark
                                                            ? 'bg-purple-900/30 text-purple-300 border border-purple-700'
                                                            : 'bg-purple-100 text-purple-700 border border-purple-200'
                                                        : user.role?.includes('Gestor') || user.role?.includes('Gerente')
                                                            ? isDark
                                                                ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                            : user.role?.includes('Supervisor')
                                                                ? isDark
                                                                    ? 'bg-orange-900/30 text-orange-300 border border-orange-700'
                                                                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                                                                : isDark
                                                                    ? 'bg-gray-800 text-gray-300 border border-gray-700'
                                                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                )}>
                                                    <Shield className="w-3 h-3 navbar-settings-icon" />
                                                    {user.role || 'Usuário'}
                                                </span>

                                                {/* Status */}
                                                <span className={twMerge(
                                                    'text-xs px-3 py-1 rounded-full font-medium',
                                                    user.status === 'Ativo'
                                                        ? isDark
                                                            ? 'bg-green-900/30 text-green-300 border border-green-700'
                                                            : 'bg-green-100 text-green-700 border border-green-200'
                                                        : isDark
                                                            ? 'bg-red-900/30 text-red-300 border border-red-700'
                                                            : 'bg-red-100 text-red-700 border border-red-200'
                                                )}>
                                                    {user.status}
                                                </span>

                                                {/* Perfis adicionais - mais limitados no grid */}
                                                {user.perfis && user.perfis.length > 0 && (
                                                    user.perfis.slice(0, viewMode === 'grid' ? 1 : 2).map((perfil: any, index: number) => (
                                                        <span
                                                            key={perfil.id}
                                                            className={twMerge(
                                                                'text-xs px-2 py-1 rounded-full border',
                                                                isDark
                                                                    ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700'
                                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                                            )}
                                                        >
                                                            {perfil.nomePerfil}
                                                        </span>
                                                    ))
                                                )}
                                                {user.perfis && user.perfis.length > (viewMode === 'grid' ? 1 : 2) && (
                                                    <span className={twMerge(
                                                        'text-xs px-2 py-1 rounded-full border',
                                                        isDark
                                                            ? 'bg-gray-800 text-gray-300 border-gray-700'
                                                            : 'bg-gray-100 text-gray-600 border-gray-300'
                                                    )}>
                                                        +{user.perfis.length - (viewMode === 'grid' ? 1 : 2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Informações adicionais */}
                                            {viewMode === 'list' && (
                                                <div className="flex items-center gap-4 text-xs">
                                                    {user.department && (
                                                        <span className={twMerge(
                                                            'flex items-center gap-1',
                                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                                        )}>
                                                            <MapPin className="w-3 h-3 navbar-settings-icon" />
                                                            {user.department}
                                                        </span>
                                                    )}
                                                    {user.lastLogin && (
                                                        <span className={twMerge(
                                                            'flex items-center gap-1',
                                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                                        )}>
                                                            <Calendar className="w-3 h-3 navbar-settings-icon" />
                                                            Último acesso: {user.lastLogin}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {viewMode === 'grid' && (
                                                <div className="text-center text-xs space-y-1">
                                                    {user.department && (
                                                        <div className={twMerge(
                                                            'flex items-center justify-center gap-1',
                                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                                        )}>
                                                            <MapPin className="w-3 h-3 navbar-settings-icon" />
                                                            {user.department.length > 20 ? user.department.slice(0, 20) + '...' : user.department}
                                                        </div>
                                                    )}
                                                    {user.lastLogin && (
                                                        <div className={twMerge(
                                                            'flex items-center justify-center gap-1',
                                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                                        )}>
                                                            <Calendar className="w-3 h-3 navbar-settings-icon" />
                                                            {user.lastLogin}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className={twMerge(
                                        'flex items-center gap-1',
                                        viewMode === 'grid' ? 'justify-center' : 'ml-4'
                                    )}>
                                        <button
                                            className={twMerge(
                                                'p-2 rounded-lg transition-colors group',
                                                isDark
                                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            )}
                                            title="Editar usuário"
                                        >
                                            <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform navbar-settings-icon" />
                                        </button>
                                        <button
                                            className={twMerge(
                                                'p-2 rounded-lg transition-colors group',
                                                isDark
                                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                                    : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                                            )}
                                            title="Remover usuário"
                                        >
                                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform navbar-settings-icon" />
                                        </button>
                                        <button
                                            onClick={() => onViewUserDetails(user)}
                                            className={twMerge(
                                                'p-2 rounded-lg transition-colors group',
                                                isDark
                                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            )}
                                            title="Ver detalhes do usuário"
                                        >
                                            <Settings className="w-4 h-4 group-hover:scale-110 transition-transform navbar-settings-icon" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'credenciais':
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className={twMerge(
                            'text-xl font-bold',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            🔐 Gerenciamento de Credenciais
                        </h2>
                        <p className={twMerge(
                            'text-sm mt-1',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            Configure chaves de API, tokens de acesso e outras credenciais
                        </p>
                    </div>

                    <div className={twMerge(
                        'p-8 rounded-lg border-2 border-dashed text-center',
                        isDark
                            ? 'border-gray-700 bg-gray-800/30'
                            : 'border-gray-300 bg-gray-50'
                    )}>
                        <KeyRound className={twMerge(
                            'w-12 h-12 mx-auto mb-4 navbar-settings-icon',
                            isDark ? 'text-gray-600' : 'text-gray-400'
                        )} />
                        <p className={twMerge(
                            'text-lg font-medium mb-2',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Sistema de Credenciais
                        </p>
                        <p className={twMerge(
                            'text-sm mb-4',
                            isDark ? 'text-gray-500' : 'text-gray-500'
                        )}>
                            Funcionalidade em desenvolvimento. Em breve você poderá gerenciar chaves de API, tokens de acesso e outras credenciais de segurança.
                        </p>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Configurar Credenciais
                        </button>
                    </div>
                </div>
            )

        case 'novo':
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className={twMerge(
                            'text-xl font-bold',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            ➕ Adicionar Novo Usuário
                        </h2>
                        <p className={twMerge(
                            'text-sm mt-1',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            Preencha as informações para criar um novo usuário no sistema
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    className={twMerge(
                                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                    )}
                                    placeholder="Digite o nome completo"
                                />
                            </div>

                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={twMerge(
                                        'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                    )}
                                    placeholder="exemplo@empresa.com"
                                />
                            </div>

                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Função
                                </label>
                                <select className={twMerge(
                                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                                    isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                )}>
                                    <option value="">Selecione uma função</option>
                                    <option value="admin">Administrador</option>
                                    <option value="gestor">Gestor</option>
                                    <option value="usuario">Usuário</option>
                                </select>
                            </div>

                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Departamento
                                </label>
                                <select className={twMerge(
                                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
                                    isDark
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                )}>
                                    <option value="">Selecione um departamento</option>
                                    <option value="ti">TI</option>
                                    <option value="rh">RH</option>
                                    <option value="vendas">Vendas</option>
                                    <option value="financeiro">Financeiro</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                className={twMerge(
                                    'px-4 py-2 border rounded-lg font-medium transition-colors',
                                    isDark
                                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                )}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Criar Usuário
                            </button>
                        </div>
                    </form>
                </div>
            )

        default:
            return null
    }
}

export default function UsuariosPage() {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    const [ mounted, setMounted ] = useState(false)
    const [ activeTab, setActiveTab ] = useState('cadastrados')
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const [ viewMode, setViewMode ] = useState<'grid' | 'list'>('list')

    // Hook para gerenciar dados do UserShield
    const { usuarios, loadingUsuarios, errorUsuarios, listarUsuarios, buscarUsuarios } = useUserShield()
    const [ usuariosFiltrados, setUsuariosFiltrados ] = useState(usuarios)

    // Modal de detalhes do usuário
    const { isOpen: isUserDetailsOpen, openModal: openUserDetails, closeModal: closeUserDetails } = useModal()
    const [ selectedUser, setSelectedUser ] = useState<any>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Filtrar usuários baseado no termo de pesquisa
    useEffect(() => {
        if (!searchTerm.trim()) {
            setUsuariosFiltrados(usuarios)
        } else {
            const filtered = usuarios.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setUsuariosFiltrados(filtered)
        }
    }, [ searchTerm, usuarios ])

    const tabs = [
        {
            id: 'cadastrados',
            label: 'Usuários Cadastrados',
            icon: Users,
            count: usuarios.length
        },
        {
            id: 'credenciais',
            label: 'Credenciais',
            icon: KeyRound,
            count: 0
        },
        {
            id: 'novo',
            label: 'Novo Usuário',
            icon: UserPlus,
            count: null
        },
    ]

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
    }

    const handleViewUserDetails = (user: any) => {
        setSelectedUser(user)
        openUserDetails()
    }



    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col px-3 sm:px-4 py-4 gap-4 overflow-hidden">
            {/* Header */}
            <div className="w-full shrink-0">
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
                        {/* Área para futuros botões de ação */}
                    </div>
                </div>
            </div>



            {/* Abas */}
            <div className={twMerge(
                'rounded-2xl border overflow-hidden shadow-lg',
                isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            )}>
                {/* Mobile: Select Dropdown */}
                <div className="sm:hidden p-4 border-b border-border">
                    <select
                        aria-label="Selecionar uma aba"
                        className={twMerge(
                            'w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                            isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        )}
                        value={activeTab}
                        onChange={(e) => handleTabChange(e.target.value)}
                    >
                        {tabs.map(tab => (
                            <option key={tab.id} value={tab.id}>
                                {tab.label} {tab.count !== null && `(${tab.count})`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Desktop: Horizontal Tabs */}
                <div className="hidden sm:block p-2">
                    <nav className="flex gap-1 bg-muted/30 rounded-lg p-1" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={twMerge(
                                    'flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200',
                                    activeTab === tab.id
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : isDark
                                            ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                                )}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                <tab.icon className="h-4 w-4 navbar-settings-icon" />
                                <span className="hidden lg:block">{tab.label}</span>
                                <span className="lg:hidden">{tab.label.split(' ')[ 0 ]}</span>
                                {tab.count !== null && (
                                    <span className={twMerge(
                                        'ml-1 px-1.5 py-0.5 text-xs rounded-full font-medium',
                                        activeTab === tab.id
                                            ? 'bg-primary-foreground/20 text-primary-foreground'
                                            : isDark
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-200 text-gray-600'
                                    )}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Conteúdo da Aba */}
                <main className="p-6 md:p-8">
                    <div className="min-h-[400px]">
                        <TabContent
                            activeTab={activeTab}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            isLoading={isLoading}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            usuarios={usuarios}
                            usuariosFiltrados={usuariosFiltrados}
                            loadingUsuarios={loadingUsuarios}
                            errorUsuarios={errorUsuarios}
                            onViewUserDetails={handleViewUserDetails}
                        />
                    </div>
                </main>
            </div>

            {/* Modal de Detalhes do Usuário */}
            {selectedUser && (
                <Modal
                    isOpen={isUserDetailsOpen}
                    onClose={closeUserDetails}
                    title="Detalhes do Usuário"
                    size="lg"
                    animation="slide-down"
                >
                    <UserDetailsContent user={selectedUser} isDark={isDark} />
                </Modal>
            )}
        </div>
    )
}
