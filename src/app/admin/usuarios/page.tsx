'use client'

import React from 'react'

export default function UsuariosPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    Usuários
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Gerenciamento de usuários do sistema
                </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Lista de Usuários
                </h2>
                <p className="text-gray-600">Aqui ficará a lista de usuários cadastrados.</p>
            </div>
        </div>
    )
}
