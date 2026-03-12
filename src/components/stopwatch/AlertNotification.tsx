'use client'

import React, { useState, useEffect } from 'react'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Notification {
  id: number
  setor: string
  paciente: string
  mensagem: string
  dt_registro: string
  confirmado: boolean
}

interface AlertNotificationProps {
  setor: string
  userId?: string
}

// Mapeamento tipoUsuario → enum da API (SetorDelayWarningView)
const SETOR_MAP: Record<string, string> = {
  'Recepção': 'Recepcao',
  'Recepcao': 'Recepcao',
  'Triagem': 'Triagem',
  'Farmacia': 'Farmacia',
  'Farmácia': 'Farmacia',
  'Nursing': 'Nursing',
  'Enfermagem': 'Nursing',
}

const VALID_SETORES = new Set(Object.values(SETOR_MAP))

export function AlertNotification({ setor, userId }: AlertNotificationProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState<number | null>(null)

  const today = new Date().toISOString()
  const pending = notifications.filter(n => !n.confirmado).length
  const apiSetor = SETOR_MAP[setor] ?? (VALID_SETORES.has(setor) ? setor : null)

  useEffect(() => {
    if (!apiSetor) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60_000)
    return () => clearInterval(interval)
  }, [apiSetor])

  async function fetchNotifications() {
    setLoading(true)
    try {
      if (!apiSetor) return
      const res = await fetch(`/api/stopwatch/notifications?setor=${encodeURIComponent(apiSetor)}&date=${encodeURIComponent(today)}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(Array.isArray(data) ? data : data.result ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function confirmNotification(id: number) {
    setConfirming(id)
    try {
      await fetch('/api/stopwatch/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userConfirm: userId,
          dt_registro: new Date().toISOString(),
          dt_atualizacao: new Date().toISOString(),
          id_DelayWarning: id,
        }),
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, confirmado: true } : n))
    } finally {
      setConfirming(null)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg border border-gray-700/50 bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
        aria-label="Notificações de atraso"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {pending > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {pending > 9 ? '9+' : pending}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <span className="text-sm font-semibold text-white">Alertas de Atraso</span>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-6">Sem alertas hoje</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 border-b border-gray-800 last:border-0',
                      n.confirmado ? 'opacity-50' : ''
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200 truncate">{n.paciente}</p>
                      <p className="text-xs text-gray-400">{n.mensagem}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {format(new Date(n.dt_registro), 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                    {!n.confirmado && (
                      <button
                        onClick={() => confirmNotification(n.id)}
                        disabled={confirming === n.id}
                        className="flex-shrink-0 p-1 rounded hover:bg-gray-700 transition-colors"
                        title="Confirmar recebimento"
                      >
                        {confirming === n.id
                          ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          : <CheckCheck className="w-4 h-4 text-emerald-400" />
                        }
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
