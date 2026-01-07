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
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al iniciar sesión')
      }

      // Redirigir al dashboard
      router.push('/admin/dashboard')
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