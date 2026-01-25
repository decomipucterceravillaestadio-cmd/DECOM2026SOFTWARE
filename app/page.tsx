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
  IconSend,
  IconCheck,
  IconDeviceLaptop,
  IconLayersIntersect,
  IconUsers
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
      staggerChildren: 0.12
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white selection:bg-[#F49E2C]/30 font-sans selection:text-white overflow-x-hidden">

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Modern Gradient Blobs */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#F49E2C]/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#15539C]/15 rounded-full blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-[#16233B]/30 rounded-full blur-[120px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-5xl">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 h-14 flex items-center justify-between shadow-2xl">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] p-1.5 border border-white/10 shadow-inner">
              <Image
                src="/favicon.png"
                alt="Logo"
                width={20}
                height={20}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xs sm:text-sm tracking-[0.05em] text-white uppercase">
              DECOM <span className="text-[#F49E2C] hidden sm:inline">| IPUC Villa Estadio</span>
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login">
              <button className="text-[10px] sm:text-xs font-semibold px-2 sm:px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white">
                Entrar
              </button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-[#F49E2C] hover:bg-[#F49E2C]/90 text-[#0A0F1D] font-bold text-[10px] sm:text-xs px-3 sm:px-5 rounded-lg border-none shadow-[0_0_15px_rgba(244,158,44,0.3)]">
                Admin
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Minimal Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#F49E2C] animate-pulse" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#F49E2C]/80">
                Sistema Operativo 2026
              </span>
            </motion.div>

            {/* Title with improved typography */}
            <motion.h1
              variants={fadeInUp}
              className="text-[8.5vw] sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-[1] sm:leading-[0.9] mb-6 sm:mb-8 flex flex-col items-center justify-center w-full"
            >
              <span className="text-white/95 text-center w-full block">
                DEPARTAMENTO
              </span>
              <span className="bg-gradient-to-r from-[#F49E2C] via-[#FFD294] to-[#F49E2C] bg-clip-text text-transparent text-center w-full block px-2">
                COMUNICACIONES
              </span>
            </motion.h1>

            {/* Subtitle - More readable and elegant */}
            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-lg md:text-xl text-white/50 mb-10 sm:mb-12 max-w-xl mx-auto font-medium leading-relaxed tracking-tight px-6 sm:px-0 text-center"
            >
              IPUC Villa Estadio-Bosconia
            </motion.p>

            {/* CTA Buttons - Premium feel */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link href="/new-request" className="w-full sm:w-auto">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full sm:w-auto h-14 px-10 text-base rounded-2xl bg-white text-[#0A0F1D] font-extrabold shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-white/90 transition-all border-none">
                    <IconSend className="mr-2 w-5 h-5" />
                    Nueva Solicitud
                  </Button>
                </motion.div>
              </Link>
              <Link href="/calendar" className="w-full sm:w-auto">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full sm:w-auto h-14 px-10 text-base rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all backdrop-blur-md">
                    <IconCalendar className="mr-2 w-5 h-5" />
                    Explorar Agenda
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features - Modern Cards */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-[#0A0F1D]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#F49E2C]/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F49E2C]/10 flex items-center justify-center text-[#F49E2C] mb-6 group-hover:scale-110 transition-transform">
                <IconDeviceLaptop stroke={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Solicitudes UX</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                Experiencia simplificada para enviar requerimientos en segundos, asegurando que nada se quede por fuera.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#F49E2C]/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#15539C]/10 flex items-center justify-center text-[#15539C] mb-6 group-hover:scale-110 transition-transform">
                <IconLayersIntersect stroke={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Control Total</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                Dashboard administrativo para orquestar cada pieza visual, fechas de entrega y estados en tiempo real.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#F49E2C]/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <IconUsers stroke={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Colaboración</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                Unifica el trabajo creativo bajo estándares profesionales. Coherencia visual para toda la congregación.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer - Minimalist & Clean */}
      <footer className="relative z-10 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#F49E2C]/10 flex items-center justify-center">
                  <IconSparkles className="w-3.5 h-3.5 text-[#F49E2C]" />
                </div>
                <span className="font-bold text-xs uppercase tracking-widest text-white/90">DECOM OS</span>
              </div>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] text-center md:text-left">
                Tecnología para el servicio del Reino
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">© 2026 IPUC BOSCONIA</p>
              <p className="text-[9px] font-black text-[#F49E2C]/40 hover:text-[#F49E2C] transition-colors cursor-pointer tracking-widest uppercase">
                Software by Juan Aguilar
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Padding for Nav if needed */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
