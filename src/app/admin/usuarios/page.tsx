'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Users,
    KeyRound,
    UserPlus,
    Search,
    Mail,
    Grid,
    List,
    Edit3,
    Trash2,
    AlertCircle,
    Loader2,
    RefreshCw
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useUserShield } from '@/hooks/useUserShield'

// Componente para renderizar conteúdo de cada aba
const TabContent = ({ activeTab, searchTerm, setSearchTerm, isLoading, viewMode, setViewMode, usuarios, loadingUsuarios, errorUsuarios, onRefresh }: {
    activeTab: string,
    searchTerm: string,
    setSearchTerm: (term: string) => void,
    isLoading: boolean,
    viewMode: 'grid' | 'list',
    setViewMode: (mode: 'grid' | 'list') => void,
    usuarios: any[],
    loadingUsuarios: boolean,
    errorUsuarios: string | null,
    onRefresh: () => void
}) => {
    const { isDark } = useTheme()

    switch (activeTab) {
        case 'cadastrados':
            return (
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
                                    'text-xs sm:text-sm mt-0.5',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    {usuarios.length} usuários encontrados
                                    {searchTerm && ` • ${usuarios.length} resultados da busca`}
                                </p>
                            </div>

                            {/* Botão de atualizar */}
                            <button
                                onClick={onRefresh}
                                disabled={loadingUsuarios}
                                className={twMerge(
                                    'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 hover:scale-105',
                                    isDark
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:hover:scale-100'
                                        : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:hover:scale-100'
                                )}
                            >
                                <RefreshCw className={twMerge(
                                    'w-4 h-4 navbar-settings-icon',
                                    loadingUsuarios && 'animate-spin'
                                )} />
                                <span className="hidden sm:inline">Atualizar</span>
                            </button>
                        </div>

                        {/* Linha 2: Barra de busca e controles de visualização */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none navbar-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email, @username, função ou departamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={twMerge(
                                        'pl-9 pr-10 h-10 w-full rounded-lg border text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-xs sm:placeholder:text-sm',
                                        isDark 
                                            ? 'bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                                    )}
                                />
                                {isLoading && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin navbar-bell-icon" />
                                )}
                            </div>

                            <div className="flex gap-1.5 shrink-0">
                                <button
                                    onClick={() => setViewMode('list')}
                                    title="Visualização em lista"
                                    className={twMerge(
                                        'p-2.5 rounded-lg transition-all hover:scale-105',
                                        viewMode === 'list'
                                            ? isDark 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                                : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : isDark 
                                                ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    )}
                                >
                                    <List className="w-5 h-5 navbar-message-icon" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    title="Visualização em grade"
                                    className={twMerge(
                                        'p-2.5 rounded-lg transition-all hover:scale-105',
                                        viewMode === 'grid'
                                            ? isDark 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                                : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : isDark 
                                                ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    )}
                                >
                                    <Grid className="w-5 h-5 navbar-settings-icon" />
                                </button>
                            </div>
                        </div>

                        {/* Mensagem de erro */}
                        {errorUsuarios && (
                            <div className={twMerge(
                                'p-4 rounded-lg border-l-4 border-red-500',
                                isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                            )}>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    <p className="font-medium">Erro ao carregar usuários</p>
                                </div>
                                <p className="text-sm mt-1">{errorUsuarios}</p>
                            </div>
                        )}
                    </div>

                    {/* Lista de usuários - ocupa o espaço restante e permite scroll */}
                    <div className="flex-1 overflow-y-auto">
                        <div className={twMerge(
                            'grid gap-3',
                            viewMode === 'grid' 
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                : 'grid-cols-1'
                        )}>
                            {loadingUsuarios ? (
                                <div className="flex items-center justify-center py-8 col-span-full">
                                    <Loader2 className="w-8 h-8 animate-spin navbar-bell-icon" />
                                    <span className={twMerge(
                                        'ml-2 text-sm',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>Carregando usuários...</span>
                                </div>
                            ) : usuarios.length === 0 ? (
                                <div className="text-center py-8 col-span-full">
                                    <Users className="w-12 h-12 mx-auto navbar-settings-icon mb-4" />
                                    <p className={twMerge(
                                        'text-sm',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>Nenhum usuário encontrado</p>
                                </div>
                            ) : usuarios.map((user) => (
                                viewMode === 'list' ? (
                                    // Visualização em Lista
                                    <div
                                        key={user.id}
                                        className={twMerge(
                                            'p-4 rounded-lg border transition-all hover:shadow-md',
                                            isDark
                                                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className={twMerge(
                                                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0',
                                                    user.status === 'Ativo'
                                                        ? isDark 
                                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30'
                                                            : 'bg-green-100 text-green-700 border-2 border-green-200'
                                                        : isDark
                                                            ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30'
                                                            : 'bg-red-100 text-red-700 border-2 border-red-200'
                                                )}>
                                                    <Users className="w-6 h-6 navbar-settings-icon" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className={twMerge(
                                                        'font-semibold truncate',
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    )}>
                                                        {user.name}
                                                    </h3>
                                                    <p className={twMerge(
                                                        'text-sm flex items-center gap-1 truncate',
                                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                                    )}>
                                                        <Mail className="w-3 h-3 navbar-message-icon shrink-0" />
                                                        {user.email}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className={twMerge(
                                                            'text-xs px-2.5 py-1 rounded-full font-medium',
                                                            user.role === 'Administrador' || user.role === 'default_fullstackdev'
                                                                ? isDark
                                                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                                                                : user.role === 'Diretor' || user.role === 'Gerencial'
                                                                    ? isDark
                                                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                                    : user.role === 'Farmacia'
                                                                        ? isDark
                                                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                                        : user.role === 'Nursing'
                                                                            ? isDark
                                                                                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                                                                : 'bg-pink-100 text-pink-700 border border-pink-200'
                                                                            : isDark
                                                                                ? 'bg-gray-600/30 text-gray-300 border border-gray-600/40'
                                                                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                                                        )}>
                                                            {user.role}
                                                        </span>
                                                        <span className={twMerge(
                                                            'text-xs',
                                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                                        )}>
                                                            @{user.userName} • {user.department}
                                                        </span>
                                                        {user.lastLogin && (
                                                            <span className={twMerge(
                                                                'text-xs',
                                                                isDark ? 'text-gray-500' : 'text-gray-500'
                                                            )}>
                                                                Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Mostrar perfis adicionais se houver */}
                                                    {user.perfis && user.perfis.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {user.perfis.map((perfil: any, index: number) => (
                                                                <span
                                                                    key={`${perfil.id}-${index}`}
                                                                    className={twMerge(
                                                                        'text-xs px-2.5 py-1 rounded-full border font-medium transition-colors',
                                                                        isDark
                                                                            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                                                                            : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                                                                    )}
                                                                >
                                                                    {perfil.nomePerfil}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <button 
                                                    title="Editar usuário"
                                                    className={twMerge(
                                                        'p-2 rounded-lg transition-all hover:scale-105',
                                                        isDark
                                                            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                                                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                                    )}
                                                >
                                                    <Edit3 className="w-4 h-4 navbar-settings-icon" />
                                                </button>
                                                <button 
                                                    title="Excluir usuário"
                                                    className={twMerge(
                                                        'p-2 rounded-lg transition-all hover:scale-105',
                                                        isDark
                                                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                    )}
                                                >
                                                    <Trash2 className="w-4 h-4 navbar-settings-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Visualização em Grade (Card)
                                    <div
                                        key={user.id}
                                        className={twMerge(
                                            'p-5 rounded-xl border transition-all hover:shadow-xl flex flex-col h-full',
                                            isDark
                                                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                                                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                        )}
                                    >
                                        {/* Avatar e Status Badge */}
                                        <div className="flex flex-col items-center mb-4">
                                            <div className="relative">
                                                <div className={twMerge(
                                                    'w-20 h-20 rounded-full flex items-center justify-center transition-all',
                                                    user.status === 'Ativo'
                                                        ? isDark 
                                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40'
                                                            : 'bg-green-100 text-green-700 border-2 border-green-300'
                                                        : isDark
                                                            ? 'bg-red-500/20 text-red-400 border-2 border-red-500/40'
                                                            : 'bg-red-100 text-red-700 border-2 border-red-300'
                                                )}>
                                                    <Users className="w-10 h-10 navbar-settings-icon" />
                                                </div>
                                                {/* Status badge */}
                                                <div className={twMerge(
                                                    'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                                    user.status === 'Ativo'
                                                        ? isDark
                                                            ? 'bg-green-500 border-gray-800'
                                                            : 'bg-green-500 border-white'
                                                        : isDark
                                                            ? 'bg-red-500 border-gray-800'
                                                            : 'bg-red-500 border-white'
                                                )}>
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nome e Email */}
                                        <div className="text-center mb-3">
                                            <h3 className={twMerge(
                                                'font-bold text-base mb-1.5 line-clamp-1',
                                                isDark ? 'text-white' : 'text-gray-900'
                                            )}>
                                                {user.name}
                                            </h3>
                                            <div className={twMerge(
                                                'flex items-center justify-center gap-1.5 mb-3',
                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                            )}>
                                                <Mail className="w-3.5 h-3.5 navbar-message-icon shrink-0" />
                                                <span className="text-xs truncate max-w-full">{user.email}</span>
                                            </div>

                                            {/* Badge de Role - Destacado */}
                                            <div className="flex justify-center">
                                                <span className={twMerge(
                                                    'text-xs px-3 py-1.5 rounded-full font-semibold',
                                                    user.role === 'Administrador' || user.role === 'default_fullstackdev'
                                                        ? isDark
                                                            ? 'bg-purple-500/25 text-purple-200 border border-purple-500/40'
                                                            : 'bg-purple-100 text-purple-800 border border-purple-300'
                                                        : user.role === 'Diretor' || user.role === 'Gerencial'
                                                            ? isDark
                                                                ? 'bg-blue-500/25 text-blue-200 border border-blue-500/40'
                                                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                                                            : user.role === 'Farmacia'
                                                                ? isDark
                                                                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40'
                                                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                                : user.role === 'Nursing'
                                                                    ? isDark
                                                                        ? 'bg-pink-500/25 text-pink-200 border border-pink-500/40'
                                                                        : 'bg-pink-100 text-pink-800 border border-pink-300'
                                                                    : isDark
                                                                        ? 'bg-gray-600/30 text-gray-200 border border-gray-600/50'
                                                                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                                                )}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Informações Adicionais - Compactas */}
                                        <div className={twMerge(
                                            'flex flex-col gap-1.5 py-3 border-y mb-3',
                                            isDark ? 'border-gray-700' : 'border-gray-200'
                                        )}>
                                            <div className="flex items-center justify-between px-2">
                                                <span className={twMerge(
                                                    'text-xs font-medium',
                                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                                )}>Username:</span>
                                                <span className={twMerge(
                                                    'text-xs font-semibold',
                                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                                )}>@{user.userName}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-2">
                                                <span className={twMerge(
                                                    'text-xs font-medium',
                                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                                )}>Depto:</span>
                                                <span className={twMerge(
                                                    'text-xs font-semibold truncate max-w-[60%]',
                                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                                )}>{user.department}</span>
                                            </div>
                                            {user.lastLogin && (
                                                <div className="flex items-center justify-between px-2">
                                                    <span className={twMerge(
                                                        'text-xs font-medium',
                                                        isDark ? 'text-gray-500' : 'text-gray-500'
                                                    )}>Último login:</span>
                                                    <span className={twMerge(
                                                        'text-xs font-semibold',
                                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                                    )}>{new Date(user.lastLogin).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Perfis Adicionais */}
                                        {user.perfis && user.perfis.length > 0 && (
                                            <div className="mb-4">
                                                <p className={twMerge(
                                                    'text-xs font-semibold mb-2 text-center',
                                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                                )}>Perfis</p>
                                                <div className="flex flex-wrap gap-1.5 justify-center">
                                                    {user.perfis.map((perfil: any, index: number) => (
                                                        <span
                                                            key={`${perfil.id}-${index}`}
                                                            className={twMerge(
                                                                'text-xs px-2.5 py-1 rounded-full border font-medium transition-all hover:scale-105',
                                                                isDark
                                                                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/30'
                                                                    : 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100'
                                                            )}
                                                        >
                                                            {perfil.nomePerfil}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Botões de Ação - Spacer para empurrar pro final */}
                                        <div className="mt-auto pt-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    title="Editar usuário"
                                                    className={twMerge(
                                                        'flex-1 py-2.5 px-3 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 font-medium text-sm',
                                                        isDark
                                                            ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30'
                                                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                                    )}
                                                >
                                                    <Edit3 className="w-4 h-4 navbar-settings-icon" />
                                                    <span>Editar</span>
                                                </button>
                                                <button 
                                                    title="Excluir usuário"
                                                    className={twMerge(
                                                        'flex-1 py-2.5 px-3 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 font-medium text-sm',
                                                        isDark
                                                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                                                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                                    )}
                                                >
                                                    <Trash2 className="w-4 h-4 navbar-settings-icon" />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
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
    useLayout()
    const [ mounted, setMounted ] = useState(false)
    const [ activeTab, setActiveTab ] = useState('cadastrados')
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ viewMode, setViewMode ] = useState<'grid' | 'list'>('list')

    // Hook para gerenciar dados do UserShield
    const { usuarios, loadingUsuarios, errorUsuarios, listarUsuarios } = useUserShield()
    const [ usuariosFiltrados, setUsuariosFiltrados ] = useState(usuarios)

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
                user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.perfis?.some(perfil =>
                    perfil.nomePerfil.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
            setUsuariosFiltrados(filtered)
        }
    }, [ searchTerm, usuarios ])

    // Função para atualizar dados
    const handleRefresh = async () => {
        try {
            await listarUsuarios()
        } catch (error) {
            console.error('Erro ao atualizar usuários:', error)
        }
    }

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
                        {/* Área para futuros botões de ação */}
                    </div>
                </div>
            </div>



            {/* Abas */}
            <div className={twMerge(
                'flex-1 flex flex-col mx-4 mb-4 rounded-2xl border overflow-hidden shadow-lg',
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
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <TabContent
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        isLoading={loadingUsuarios}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        usuarios={usuariosFiltrados}
                        loadingUsuarios={loadingUsuarios}
                        errorUsuarios={errorUsuarios}
                        onRefresh={handleRefresh}
                    />
                </main>
            </div>
        </div>
    )
}
