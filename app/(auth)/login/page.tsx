'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AceternitiyLoginForm } from '@/app/components/Aceternity'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // IMPORTANTE: incluir cookies en la petición
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al iniciar sesión')
      }

      const data = await response.json()
      console.log('Login exitoso:', data)

      // Esperar un momento para que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Forzar navegación completa (no usar router.push)
      window.location.href = '/admin'
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(message)
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AceternitiyLoginForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  )
}