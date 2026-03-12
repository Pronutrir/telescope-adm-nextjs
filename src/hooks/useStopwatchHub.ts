'use client'

import { useState, useEffect, useRef } from 'react'
import { HubConnectionBuilder, HubConnection, HttpTransportType } from '@microsoft/signalr'
import { IStopwatchTodayHub } from '@/types/stopwatch'
import { SERVICES_CONFIG } from '@/config/env'

const STOPWATCH_HUB_URL = `${SERVICES_CONFIG.APITASY}/stopwatch-hub`

export type HubStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface UseStopwatchHubReturn {
  hubData: IStopwatchTodayHub | null
  status: HubStatus
  hasDelays: boolean
}

export function useStopwatchHub(): UseStopwatchHubReturn {
  const [hubData, setHubData] = useState<IStopwatchTodayHub | null>(null)
  const [status, setStatus] = useState<HubStatus>('disconnected')
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    let cancelled = false
    let started = false

    const connection = new HubConnectionBuilder()
      .withUrl(STOPWATCH_HUB_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build()

    connectionRef.current = connection

    connection.onreconnecting(() => { if (!cancelled) setStatus('connecting') })
    connection.onreconnected(() => { if (!cancelled) setStatus('connected') })
    connection.onclose(() => { if (!cancelled) setStatus('disconnected') })

    setStatus('connecting')
    connection
      .start()
      .then(() => {
        started = true
        if (cancelled) {
          // start() completou mas o componente já desmontou — para agora
          connection.stop().catch(() => {})
          return
        }
        setStatus('connected')
        connection.on('ReceiveMessage', (message: string | IStopwatchTodayHub) => {
          if (!cancelled && typeof message !== 'string') {
            setHubData(message)
          }
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      // Só chama stop() se start() já completou — senão o .then() acima cuida disso
      if (started) {
        connection.stop().catch(() => {})
      }
    }
  }, [])

  const hasDelays = hubData
    ? hubData.acolhimento.percent.negative > 0
      || hubData.recepcao.percent.negative > 0
      || hubData.triagem.percent.negative > 0
      || hubData.farmacia.satelite.percent.negative > 0
      || hubData.farmacia.producao.percent.negative > 0
      || hubData.acomodacao.percent.negative > 0
    : false

  return { hubData, status, hasDelays }
}
