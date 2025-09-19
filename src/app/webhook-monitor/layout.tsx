import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Monitor de Sinais Vitais | Telescope ADM',
    description: 'Monitoramento em tempo real de sinais vitais de pacientes via WebSocket'
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