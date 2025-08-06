'use client'

import React from 'react'
import DivHeader from '@/components/ui/DivHeader'
import AbasAnswers from '@/components/nps/AbasAnswers'

const ConsultasPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <DivHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 rounded-lg shadow-xl">
                    <AbasAnswers />
                </div>
            </div>
        </div>
    )
}

export default ConsultasPage
