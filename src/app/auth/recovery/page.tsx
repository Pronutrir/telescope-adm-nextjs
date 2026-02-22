import { Suspense } from 'react'
import { RecoveryForm } from '@/components/ui/RecoveryForm'

// Suspense obrigatório pois RecoveryForm usa useSearchParams internamente
export default function RecoveryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando...</div>}>
      <RecoveryForm />
    </Suspense>
  )
}
