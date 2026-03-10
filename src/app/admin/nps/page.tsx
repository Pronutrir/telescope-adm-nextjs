'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NpsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/nps/consultas')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
    </div>
  )
}
