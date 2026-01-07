'use client'

import Link from 'next/link'
import { Button } from './components/UI/Button'
import { Card } from './components/UI/Card'
import { 
  IconCalendar, 
  IconClipboardList, 
  IconUsers,
  IconSparkles,
  IconArrowRight
} from '@tabler/icons-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-purple-600/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 mb-6">
              <IconSparkles className="w-12 h-12 text-violet-600" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Sistema <span className="text-violet-600">DECOM</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gestión de Solicitudes de Material Gráfico
            </p>
            
            <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">
              Centraliza y gestiona solicitudes de material publicitario para el 
              Departamento de Comunicaciones de la iglesia
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/new-request">
              <Button 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <IconClipboardList className="w-6 h-6 mr-2" />
                Nueva Solicitud
              </Button>
            </Link>
            
            <Link href="/calendar">
              <Button 
                variant="outline"
                className="border-2 border-violet-600 text-violet-600 hover:bg-violet-50 px-8 py-4 text-lg font-semibold"
              >
                <IconCalendar className="w-6 h-6 mr-2" />
                Ver Calendario
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <IconClipboardList className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Solicitudes Fáciles
                </h3>
                <p className="text-gray-600">
                  Formulario simple y guiado para enviar tus solicitudes de material gráfico
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <IconCalendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Calendario Transparente
                </h3>
                <p className="text-gray-600">
                  Ve la carga de trabajo actual y planifica mejor tus solicitudes
                </p>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <IconUsers className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Gestión Centralizada
                </h3>
                <p className="text-gray-600">
                  Reemplaza la comunicación informal por WhatsApp con un proceso estructurado
                </p>
              </div>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ¿Cómo funciona?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="text-violet-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Envía tu Solicitud
                  </h3>
                  <p className="text-gray-600">
                    Completa el formulario con los detalles de tu evento y material necesario
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="text-violet-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    DECOM Revisa y Diseña
                  </h3>
                  <p className="text-gray-600">
                    El equipo de comunicaciones trabaja en tu material siguiendo fechas clave
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="text-violet-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Recibe tu Material
                  </h3>
                  <p className="text-gray-600">
                    Te contactamos por WhatsApp cuando esté listo para entrega
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Login Link */}
          <div className="mt-16 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors"
            >
              <span className="text-sm">¿Eres administrador DECOM?</span>
              <span className="text-sm font-semibold flex items-center gap-1">
                Iniciar Sesión
                <IconArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Sistema DECOM - Departamento de Comunicaciones
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Gestión de Solicitudes de Material Gráfico © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
