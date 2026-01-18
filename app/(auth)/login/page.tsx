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
      console.log('🔐 Iniciando login con email:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // IMPORTANTE: incluir cookies en la petición
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = 'Error al iniciar sesión'
        
        try {
          const data = await response.json()
          console.log('📦 Error response data:', data)
          errorMessage = data.message || data.error || errorMessage
        } catch (parseError) {
          // Si no se puede parsear JSON, usar mensaje basado en status
          console.log('⚠️ Could not parse error response:', parseError)
          const text = await response.text()
          console.log('⚠️ Raw response text:', text)
          switch (response.status) {
            case 400:
              errorMessage = 'Datos de entrada inválidos'
              break
            case 401:
              errorMessage = 'Correo electrónico o contraseña incorrectos'
              break
            case 403:
              errorMessage = 'Acceso denegado'
              break
            case 429:
              errorMessage = 'Demasiados intentos. Inténtalo más tarde'
              break
            case 500:
              errorMessage = 'Error interno del servidor. Inténtalo más tarde'
              break
            default:
              errorMessage = `Error ${response.status}: ${response.statusText || 'Desconocido'}`
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Login exitoso:', data)

      // Esperar un momento para que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Forzar navegación completa (no usar router.push)
      window.location.href = '/admin'
    } catch (err) {
      console.log('❌ Catch block entered with error type:', typeof err)
      console.log('❌ Error object:', err)
      
      let message = 'Error desconocido al iniciar sesión'
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        message = 'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo'
        console.error('🌐 Connection error:', err)
      } else if (err instanceof Error) {
        message = err.message
        console.error('❌ Auth error:', { message: err.message, stack: err.stack, name: err.name })
      } else if (typeof err === 'string') {
        message = err
        console.error('❌ String error:', err)
      } else if (err && typeof err === 'object' && 'message' in err) {
        message = String(err.message)
        console.error('❌ Object error:', err)
      } else {
        console.error('❌ Unknown error type:', err)
        message = 'Error desconocido. Revisa la consola para más detalles.'
      }
      
      setError(message)
      console.error('Final login error:', { message, originalError: err, errorType: typeof err })
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