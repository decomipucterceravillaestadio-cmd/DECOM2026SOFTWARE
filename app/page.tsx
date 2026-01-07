import Link from 'next/link'
import { Button } from './components/UI/Button'
import { Card } from './components/UI/Card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-decom-primary to-decom-secondary flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <h1 className="text-xl font-bold text-decom-primary">Sistema DECOM</h1>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-900">
              Gestión de Comunicaciones
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistema de solicitudes de material publicitario para IPUC Villa Estado
            </p>
          </div>

          {/* Icons */}
          <div className="flex justify-center gap-6 text-6xl">
            <span>📋</span>
            <span>🎨</span>
            <span>📱</span>
            <span>✨</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link href="/new-request" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                ➕ Nueva Solicitud
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                🔐 Iniciar Sesión
              </Button>
            </Link>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-center space-y-3">
              <div className="text-4xl">📝</div>
              <h3 className="font-bold text-lg text-gray-900">Solicitud Simple</h3>
              <p className="text-sm text-gray-600">
                Completa un formulario sencillo con los detalles de tu evento
              </p>
            </Card>

            <Card className="p-6 text-center space-y-3">
              <div className="text-4xl">⚡</div>
              <h3 className="font-bold text-lg text-gray-900">Proceso Rápido</h3>
              <p className="text-sm text-gray-600">
                El equipo de DECOM revisará tu solicitud y te contactará por WhatsApp
              </p>
            </Card>

            <Card className="p-6 text-center space-y-3">
              <div className="text-4xl">🎯</div>
              <h3 className="font-bold text-lg text-gray-900">Resultados Profesionales</h3>
              <p className="text-sm text-gray-600">
                Recibe diseños de calidad adaptados a las necesidades de tu evento
              </p>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-16 bg-blue-50 rounded-xl p-8">
            <h3 className="font-bold text-2xl text-gray-900 mb-6">
              ¿Qué puedes solicitar?
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <span className="font-medium text-gray-700">Flyers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🖼️</span>
                <span className="font-medium text-gray-700">Banners</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎥</span>
                <span className="font-medium text-gray-700">Videos</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <span className="font-medium text-gray-700">Redes Sociales</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>Sistema DECOM © 2026 - IPUC Villa Estado</p>
          <p className="text-xs text-gray-500 mt-2">
            Gestión de Comunicaciones - Iglesia Pentecostal Unida de Colombia
          </p>
        </div>
      </footer>
    </div>
  )
}
