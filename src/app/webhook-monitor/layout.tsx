import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Monitor de Sinais Vitais | Telescope ADM',
    description: 'Monitoramento de sinais vitais de pacientes'
}

export default function WebhookMonitorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="webhook-monitor-layout">
            {children}
        </div>
    )
}