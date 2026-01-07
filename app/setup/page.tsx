'use client'

import Link from 'next/link'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { useState } from 'react'

export default function SetupPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const testUsers = [
    {
      id: 'admin',
      email: 'admin@decom.test',
      password: 'DecomAdmin123!',
      role: 'Admin del Sistema',
    },
    {
      id: 'manager',
      email: 'manager@decom.test',
      password: 'ManagerDecom123!',
      role: 'Coordinador DECOM',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-decom-primary to-decom-secondary flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <h1 className="text-xl font-bold text-decom-primary">DECOM</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-20">
        <Card padding="lg" className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Configuración de Usuarios</h2>
            <p className="text-gray-600">
              Sigue estos pasos para crear los usuarios de prueba en Supabase
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Paso 1: Ve a Supabase Dashboard</h3>
              <p className="text-blue-700 text-sm mb-3">
                Accede a tu proyecto en:
              </p>
              <div className="bg-white p-2 rounded border border-blue-300 font-mono text-sm text-blue-600">
                https://app.supabase.com → Tu Proyecto → Authentication → Users
              </div>
            </div>

            {/* Users to Create */}
            {testUsers.map((user) => (
              <div key={user.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">{user.role}</h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
                    <code className="text-sm font-mono text-gray-700">{user.email}</code>
                    <button
                      onClick={() => copyToClipboard(user.email, `email-${user.id}`)}
                      className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      {copied === `email-${user.id}` ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
                    <code className="text-sm font-mono text-gray-700">{user.password}</code>
                    <button
                      onClick={() => copyToClipboard(user.password, `pass-${user.id}`)}
                      className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      {copied === `pass-${user.id}` ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Paso 2: Crea los usuarios</h3>
              <ol className="text-green-700 text-sm space-y-2 list-decimal list-inside">
                <li>Click en "Create new user"</li>
                <li>Pega el email (arriba está el botón de copiar)</li>
                <li>Pega la contraseña</li>
                <li>Marca la casilla "Auto confirm user"</li>
                <li>Click en "Create user"</li>
                <li>Repite para el segundo usuario</li>
              </ol>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">⏱️ Paso 3: Espera y recarga</h3>
              <p className="text-amber-700 text-sm">
                Una vez creados los usuarios en Supabase, espera 5-10 segundos y luego regresa al login para probar.
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex gap-3 pt-4">
            <Link href="/login" className="flex-1">
              <Button className="w-full bg-decom-primary hover:bg-decom-primary/90 text-white font-medium py-2 rounded-lg transition-colors">
                ← Volver a Login
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="ghost" className="w-full">
                Ver Formulario →
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 border-t pt-4">
            <p>Una vez completado el setup, podrás hacer login en el sistema.</p>
            <p className="text-gray-500 mt-2">
              Sistema DECOM - Gestión de Comunicaciones © {new Date().getFullYear()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
