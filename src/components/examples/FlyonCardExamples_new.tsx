'use client'

import React from 'react'
import { FlyonCard, CardBody, CardTitle, CardActions, CardButton, WelcomeCard } from '@/components/ui/FlyonCard'
import { FlyonSidebar } from '@/components/ui/FlyonSidebar'
import {
    Users,
    TrendingUp,
    Activity,
    Settings,
    ArrowRight,
    Star,
    Shield,
    Zap,
    Layout,
    Sidebar
} from 'lucide-react'

const FlyonCardExamples: React.FC = () => {
    return (
        <div className="content-distributed">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                    FlyonUI Components
                </h2>
                <p className="text-muted-foreground text-lg">
                    Componentes FlyonUI refatorados e integrados ao Telescope ADM
                </p>
            </div>

            {/* FlyonUI Sidebar Demo */}
            <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Sidebar className="w-6 h-6" />
                    FlyonUI Sidebar Component
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sidebar Preview Card */}
                    <FlyonCard variant="telescope" size="lg" elevation="xl">
                        <CardBody>
                            <CardTitle gradient level={4}>Sidebar Colapsível</CardTitle>
                            <p className="mb-4 text-muted-foreground">
                                Sidebar responsivo baseado no FlyonUI com funcionalidades de minificação, dropdown menus e navegação móvel.
                            </p>
                            <div className="bg-accent/20 rounded-lg p-4 mb-4">
                                <h5 className="font-semibold mb-2">Funcionalidades:</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Sidebar minificável no desktop</li>
                                    <li>• Menu mobile responsivo</li>
                                    <li>• Dropdown menus com hover</li>
                                    <li>• Animações suaves</li>
                                    <li>• Integração com tema Telescope</li>
                                </ul>
                            </div>
                            <CardActions>
                                <CardButton variant="primary" icon={Layout}>
                                    Ver Componente
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>

                    {/* Sidebar Demo Container */}
                    <FlyonCard variant="glass" size="lg" elevation="xl">
                        <CardBody padding="none">
                            <div className="relative h-80 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-card-elevated/90">
                                    {/* Mini Sidebar Demo */}
                                    <div className="relative h-full">
                                        <FlyonSidebar defaultMinified={true} className="relative h-full" />
                                        <div className="absolute top-4 left-20 right-4 p-4">
                                            <div className="text-sm text-muted-foreground">
                                                Preview do sidebar minificado
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </FlyonCard>
                </div>
            </div>

            {/* Card Examples Grid */}
            <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    FlyonUI Card Examples
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <WelcomeCard />

                    {/* Card com variante primary */}
                    <FlyonCard variant="primary" size="sm" elevation="lg">
                        <CardBody>
                            <CardTitle gradient>Analytics Dashboard</CardTitle>
                            <p className="mb-4 text-muted-foreground">
                                Access comprehensive analytics and insights to track your performance metrics and user engagement.
                            </p>
                            <CardActions>
                                <CardButton variant="primary" icon={TrendingUp}>
                                    View Analytics
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>

                    {/* Card com variante glass */}
                    <FlyonCard variant="glass" size="sm" elevation="xl">
                        <CardBody>
                            <CardTitle level={4}>User Management</CardTitle>
                            <p className="mb-4 text-muted-foreground">
                                Manage users, roles and permissions with advanced security features.
                            </p>
                            <CardActions>
                                <CardButton variant="outline" icon={Users}>
                                    Manage Users
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>

                    {/* Card com variante secondary */}
                    <FlyonCard variant="secondary" size="sm" elevation="md">
                        <CardBody>
                            <CardTitle>System Status</CardTitle>
                            <p className="mb-4 text-muted-foreground">
                                Monitor system health and performance metrics in real-time.
                            </p>
                            <CardActions>
                                <CardButton variant="secondary" icon={Activity}>
                                    View Status
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>

                    {/* Card with features showcase */}
                    <FlyonCard variant="telescope" size="sm" elevation="lg">
                        <CardBody>
                            <CardTitle gradient>Advanced Features</CardTitle>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    <span className="text-sm">Security Enhanced</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-secondary" />
                                    <span className="text-sm">High Performance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-warning" />
                                    <span className="text-sm">Premium Quality</span>
                                </div>
                            </div>
                            <CardActions>
                                <CardButton variant="ghost" icon={ArrowRight} iconPosition="right">
                                    Explore
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>

                    {/* Settings Card */}
                    <FlyonCard variant="primary" size="sm" elevation="xl">
                        <CardBody>
                            <CardTitle>Settings</CardTitle>
                            <p className="mb-4 text-muted-foreground text-sm">
                                Configure your preferences and system settings.
                            </p>
                            <CardActions justify="between">
                                <CardButton variant="outline" size="sm" icon={Settings}>
                                    Configure
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>
                </div>
            </div>

            {/* Usage Examples */}
            <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Como Usar</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Code Example Card */}
                    <FlyonCard variant="telescope" elevation="lg">
                        <CardBody>
                            <CardTitle level={4}>Exemplo de Código</CardTitle>
                            <div className="bg-accent/10 rounded-lg p-4 mt-4">
                                <pre className="text-sm overflow-x-auto">
                                    <code>{`// FlyonCard
<FlyonCard variant="primary" size="sm">
  <CardBody>
    <CardTitle>Título</CardTitle>
    <p>Conteúdo do card...</p>
    <CardActions>
      <CardButton variant="primary">
        Ação
      </CardButton>
    </CardActions>
  </CardBody>
</FlyonCard>

// FlyonSidebar
<FlyonSidebar defaultMinified={false} />`}
                                    </code>
                                </pre>
                            </div>
                        </CardBody>
                    </FlyonCard>

                    {/* Integration Guide */}
                    <FlyonCard variant="secondary" elevation="lg">
                        <CardBody>
                            <CardTitle level={4}>Guia de Integração</CardTitle>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">1</span>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold">Import Components</h5>
                                        <p className="text-sm text-muted-foreground">Importe os componentes FlyonUI do diretório @/components/ui</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">2</span>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold">Configure Props</h5>
                                        <p className="text-sm text-muted-foreground">Use as propriedades variant, size e elevation para customizar</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">3</span>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold">Theme Integration</h5>
                                        <p className="text-sm text-muted-foreground">Os componentes já estão integrados ao sistema de temas</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </FlyonCard>
                </div>
            </div>
        </div>
    )
}

export default FlyonCardExamples
