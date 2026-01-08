'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  IconCalendar,
  IconClipboardList,
  IconSparkles,
  IconArrowRight,
  IconPalette,
  IconSend
} from '@tabler/icons-react'
import { Button } from './components/UI/Button'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#16233B] via-[#15539C] to-[#1a2847] text-white selection:bg-[#F49E2C]/30 overflow-hidden">

      {/* Animated Background Beams */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-[#F49E2C]/15 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#15539C]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 fixed top-0 w-full backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#15539C] to-[#16233B] border border-[#F49E2C] flex items-center justify-center">
              <Image
                src="/IPUC_COLOR para fondo oscuro (2).png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain p-1"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">DECOM IPUC VILLA ESTADIO</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login">
              <Button className="bg-[#F49E2C]/20 border border-[#F49E2C]/50 text-[#F49E2C] hover:bg-[#F49E2C]/30 font-semibold">
                Administración
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F49E2C]/20 border border-[#F49E2C]/50 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F49E2C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F49E2C]"></span>
              </span>
              <span className="text-sm font-semibold text-[#F49E2C]">Sistema de Gestión 2026</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-white via-white to-[#F49E2C] bg-clip-text text-transparent">
                Solicita Material Gráfico
              </span>
              <br />
              <span className="text-[#F49E2C]">Sin Complicaciones</span>
            </motion.h1>

            {/* Subtitle - Minimalizado */}
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto"
            >
              Agiliza y centraliza tus solicitudes de diseño
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/new-request" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full sm:w-auto h-14 px-8 text-lg rounded-lg bg-gradient-to-r from-[#15539C] to-[#16233B] border-b-4 border-[#F49E2C] text-white font-bold shadow-lg hover:shadow-2xl transition-all">
                    <IconClipboardList className="mr-2 w-5 h-5" />
                    Nueva Solicitud
                  </Button>
                </motion.div>
              </Link>
              <Link href="/calendar" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full sm:w-auto h-14 px-8 text-lg rounded-lg border-2 border-[#F49E2C]/50 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
                    <IconCalendar className="mr-2 w-5 h-5" />
                    Ver Calendario
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Minimalizado */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-[#F49E2C]/50 transition-all group cursor-pointer overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F49E2C]/10 rounded-full blur-2xl group-hover:blur-xl transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#F49E2C]/20 flex items-center justify-center text-[#F49E2C] mb-4">
                  <IconSend className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Solicitudes Simplificadas</h3>
                <p className="text-white/70 text-sm">
                  Formularios guiados para asegurar toda la información necesaria
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-[#F49E2C]/50 transition-all group cursor-pointer overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F49E2C]/10 rounded-full blur-2xl group-hover:blur-xl transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#F49E2C]/20 flex items-center justify-center text-[#F49E2C] mb-4">
                  <IconCalendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Agenda Clara</h3>
                <p className="text-white/70 text-sm">
                  Visualiza la carga de trabajo y planifica con anticipación
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-[#F49E2C]/50 transition-all group cursor-pointer overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F49E2C]/10 rounded-full blur-2xl group-hover:blur-xl transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#F49E2C]/20 flex items-center justify-center text-[#F49E2C] mb-4">
                  <IconPalette className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Diseño Profesional</h3>
                <p className="text-white/70 text-sm">
                  Estándares de calidad consistentes para toda la iglesia
                </p>
              </div>
            </motion.div>

            {/* CTA Admin - Span 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-1 bg-gradient-to-br from-[#15539C]/30 to-[#16233B]/30 rounded-2xl p-8 border border-[#F49E2C]/30 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Panel Admin</h3>
                <p className="text-white/70 text-sm mb-4">
                  Gestiona tareas y monitorea progreso
                </p>
                <Link href="/login">
                  <motion.div whileHover={{ x: 5 }}>
                    <Button className="bg-[#F49E2C] text-[#16233B] hover:bg-[#F49E2C]/90 font-bold w-full">
                      Ingresar
                      <IconArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F49E2C]/20 border border-[#F49E2C]/50 flex items-center justify-center">
              <IconSparkles className="w-4 h-4 text-[#F49E2C]" />
            </div>
            <span className="font-semibold text-white/80">DECOM System</span>
          </div>
          <p>© 2026 Departamento de Comunicaciones IPUC</p>
        </div>
      </footer>
    </div>
  )
}
