'use client'

import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconHeart,
  IconUsers,
  IconPalette,
  IconTarget
} from '@tabler/icons-react'
import { Card } from '@/app/components/UI/Card'

export default function AboutDecomPage() {
  const router = useRouter()

  const features = [
    {
      icon: <IconPalette className="w-8 h-8 text-decom-primary" />,
      title: 'Material Gráfico Profesional',
      description: 'Creamos flyers, banners, videos y contenido para redes sociales con la más alta calidad.'
    },
    {
      icon: <IconUsers className="w-8 h-8 text-decom-primary" />,
      title: 'Equipo Especializado',
      description: 'Contamos con diseñadores gráficos y productores audiovisuales comprometidos con la visión de IPUC.'
    },
    {
      icon: <IconTarget className="w-8 h-8 text-decom-primary" />,
      title: 'Enfoque en Resultados',
      description: 'Cada material está diseñado para comunicar efectivamente el mensaje y lograr los objetivos propuestos.'
    },
    {
      icon: <IconHeart className="w-8 h-8 text-decom-primary" />,
      title: 'Apoyo a Ministerios',
      description: 'Apoyamos todos los ministerios y eventos de la iglesia con materiales que reflejan nuestros valores.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 pb-4 justify-between bg-gradient-to-r from-decom-primary to-decom-primary-light shadow-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Acerca de DECOM
        </h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-decom-primary-light to-decom-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <IconPalette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Departamento de Comunicación
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Creamos y producimos material gráfico para comunicar la visión y valores de la Iglesia Pentecostal Unida de Colombia.
          </p>
        </div>

        {/* Mission */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Nuestra Misión</h2>
          <p className="text-gray-700 leading-relaxed">
            Ser el puente entre la visión de Dios para IPUC y su comunicación efectiva a través de medios gráficos y audiovisuales que inspiren, informen y conecten con nuestra comunidad.
          </p>
        </Card>

        {/* Features Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Lo que hacemos</h2>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Contacto</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> decom@ipuc.org.co</p>
            <p><strong>Teléfono:</strong> (57) 300 123 4567</p>
            <p><strong>Ubicación:</strong> Sede Principal IPUC</p>
          </div>
        </Card>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Sistema DECOM v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2024 Iglesia Pentecostal Unida de Colombia
          </p>
        </div>
      </div>
    </div>
  )
}