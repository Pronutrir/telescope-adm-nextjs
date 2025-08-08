'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function GerenciadorPage() {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent">
                        Gerenciador
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg">
                        Sistema de gerenciamento administrativo
                    </p>
                </div>

                <Card variant="telescope">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Painel de Controle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-telescope-icon">Aqui ficará o painel de controle administrativo.</p>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}
