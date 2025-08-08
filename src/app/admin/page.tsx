'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirecionar automaticamente para o dashboard
        router.replace('/admin/dashboard')
    }, [ router ])

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-950 dark:to-secondary-950 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
            </div>
        </div>
    )
}
