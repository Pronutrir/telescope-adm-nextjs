'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
// import DivHeader from '@/components/ui/DivHeader'
// import AbasAnswers from '@/components/nps/AbasAnswers'

const ConsultasPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    NPS - Consultas
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Net Promoter Score das consultas
                </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Análise NPS
                </h2>
                <p className="text-gray-600 mb-6">Aqui ficará a análise do Net Promoter Score das consultas.</p>

                {/* Placeholder para os componentes que virão */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200/50">
                    <p className="text-gray-500 text-center">
                        Componentes AbasAnswers e DivHeader serão integrados aqui
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConsultasPage
