'use client'

import React, { useState } from 'react'
import AnswersList from './AnswersList'
import AnswersDashboard from './AnswersDashboard'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nps-tabpanel-${index}`}
            aria-labelledby={`nps-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    )
}

const AbasAnswers: React.FC = () => {
    const [ value, setValue ] = useState(0)

    const handleTabClick = (newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            {/* Tabs Header */}
            <div className="bg-gray-700 border-b border-gray-600">
                <nav className="flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => handleTabClick(0)}
                        className={`
                            py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200
                            ${value === 0
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }
                        `}
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Respostas</span>
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabClick(1)}
                        className={`
                            py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200
                            ${value === 1
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }
                        `}
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Dashboard</span>
                        </div>
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <CustomTabPanel value={value} index={0}>
                <AnswersList />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <AnswersDashboard />
            </CustomTabPanel>
        </>
    )
}

export default AbasAnswers
