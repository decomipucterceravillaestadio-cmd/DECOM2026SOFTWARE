import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoginInput } from './LoginInput';
import { LoginButton } from './LoginButton';
import { IconArrowLeft } from '@tabler/icons-react';

interface AceternitiyLoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function AceternitiyLoginForm({
  onSubmit,
  isLoading = false,
  error: externalError,
}: AceternitiyLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoaderActive = isLoading || isSubmitting;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#16233B] via-[#15539C] to-[#1a2847]">
      {/* Botón de regreso a inicio */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all backdrop-blur-sm border border-white/20 hover:border-white/40"
        title="Ir a página principal"
      >
        <IconArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Volver</span>
      </button>
      {/* Animated Background Beams Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Beam 1 - Top left */}
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
        
        {/* Beam 2 - Bottom right */}
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

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card Container with glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F49E2C]/50 to-transparent" />
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center space-y-3"
          >
            {/* Logo with rotating border */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute w-32 h-32 rounded-full border border-[#F49E2C]/20"
              />
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-24 h-24 bg-gradient-to-br from-[#15539C] to-[#16233B] rounded-2xl flex items-center justify-center shadow-2xl border-2 border-[#F49E2C] overflow-hidden"
              >
                <Image
                  src="/IPUC_COLOR para fondo oscuro (2).png"
                  alt="Logo IPUC Villa Estadio"
                  width={80}
                  height={80}
                  className="object-contain p-2"
                  priority
                />
              </motion.div>
            </div>

            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-white via-white to-[#F49E2C] bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sistema DECOM
            </motion.h1>
            
            <motion.p 
              className="text-[#F49E2C] text-base font-semibold drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              IPUC Villa Estado
            </motion.p>
            <motion.p 
              className="text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Gestión de Comunicaciones
            </motion.p>
          </motion.div>

          {/* Error Message */}
          {externalError && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-lg bg-red-500/20 border border-red-400/50 backdrop-blur-sm"
            >
              <p className="text-sm font-medium text-red-200 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {externalError}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-white text-sm font-semibold mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  disabled={isLoaderActive}
                  className={`w-full px-4 py-3 pl-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/50 border-2 ${
                    errors.email
                      ? "border-red-400/50"
                      : "border-white/20 group-focus-within:border-[#F49E2C]"
                  } focus:outline-none focus:ring-2 focus:ring-[#F49E2C]/30 transition-all duration-300 disabled:opacity-50`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#15539C] group-focus-within:text-[#F49E2C] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                </span>
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-300 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-white text-sm font-semibold mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  disabled={isLoaderActive}
                  className={`w-full px-4 py-3 pl-12 pr-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/50 border-2 ${
                    errors.password
                      ? "border-red-400/50"
                      : "border-white/20 group-focus-within:border-[#F49E2C]"
                  } focus:outline-none focus:ring-2 focus:ring-[#F49E2C]/30 transition-all duration-300 disabled:opacity-50`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#15539C] group-focus-within:text-[#F49E2C] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </span>
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
                  disabled={isLoaderActive}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-[#15539C]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#15539C]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.261l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M15.171 13.576l1.473 1.473A10.014 10.014 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-4.512 1.074l1.781 1.781A9.016 9.016 0 0110 4c4.478 0 8.268 2.943 9.542 7a9.958 9.958 0 01-.364 1.576z" /></svg>
                  )}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-300 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LoginButton
                label={isLoaderActive ? "Iniciando sesión..." : "Iniciar Sesión"}
                type="submit"
                isLoading={isLoaderActive}
                disabled={isLoaderActive}
              />
            </motion.div>
          </form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4 text-center"
          >
            <motion.a
              href="#"
              className="text-[#F49E2C] hover:text-white text-sm font-semibold transition-colors block"
              whileHover={{ x: 5 }}
            >
              ¿Olvidaste tu contraseña? →
            </motion.a>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/50">
                © 2026 IPUC Villa Estado • Sistema DECOM
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}