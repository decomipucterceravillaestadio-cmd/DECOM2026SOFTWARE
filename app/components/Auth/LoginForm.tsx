"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/app/components/UI/Button";
import { Card } from "@/app/components/UI/Card";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading: externalLoading = false, error: externalError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const isLoading = externalLoading || isSubmitting;

  const onFormSubmit = async (data: LoginFormData) => {
    try {
      clearErrors();
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Mock implementation for now
        console.log("Login attempt:", data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión";
      setError("root", { message });
    }
  };

  const formError = errors.root?.message || externalError;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#16233B] via-[#15539C] to-[#1a2847]">
      {/* Animated Background Beams Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Beam decorative elements */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-[#F49E2C]/10 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, 40, 0],
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
            x: [0, -40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo Section with animation */}
          <motion.div
            className="flex justify-center pt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Decorative animated border */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-[#F49E2C] via-[#F49E2C]/50 to-transparent rounded-full opacity-30 blur-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Logo Circle */}
              <div className="relative bg-gradient-to-br from-[#15539C] to-[#16233B] w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-2 border-[#F49E2C] overflow-hidden backdrop-blur-sm">
                <Image
                  src="/favicon.png"
                  alt="Logo IPUC Villa Estadio"
                  width={80}
                  height={80}
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Title Section with staggered animation */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-[#F49E2C] bg-clip-text text-transparent drop-shadow-lg">
              Sistema DECOM
            </h1>
            <p className="text-[#F49E2C] text-base font-semibold drop-shadow">
              IPUC Villa Estado - Gestión de Comunicaciones
            </p>
          </motion.div>

          {/* Error Message */}
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Form Card with hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card padding="lg" className="bg-white/95 backdrop-blur-md shadow-2xl border-t-4 border-[#F49E2C] overflow-hidden relative">
              {/* Subtle gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F49E2C]/50 to-transparent" />
              
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                {/* Email Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label htmlFor="email" className="block text-[#16233B] font-semibold text-sm">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className={`w-full px-4 py-3 pl-10 rounded-lg bg-white text-[#16233B] placeholder-gray-400 border-2 ${errors.email ? "border-red-300" : "border-[#15539C]/30 group-focus-within:border-[#15539C]"
                        } focus:outline-none focus:ring-2 focus:ring-[#15539C]/30 transition-all duration-300`}
                      {...register("email")}
                      disabled={isLoading}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#15539C] group-focus-within:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                  </div>
                  {errors.email && (
                    <motion.p
                      className="text-red-600 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="password" className="block text-[#16233B] font-semibold text-sm">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 pl-10 pr-12 rounded-lg bg-white text-[#16233B] placeholder-gray-400 border-2 ${errors.password ? "border-red-300" : "border-[#15539C]/30 group-focus-within:border-[#15539C]"
                        } focus:outline-none focus:ring-2 focus:ring-[#15539C]/30 transition-all duration-300`}
                      {...register("password")}
                      disabled={isLoading}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg group-focus-within:scale-110 transition-transform duration-300">🔒</span>
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#16233B] hover:text-[#15539C] transition-colors disabled:opacity-50"
                      disabled={isLoading}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p
                      className="text-red-600 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-[#15539C] to-[#16233B] border-b-4 border-[#F49E2C] hover:from-[#15539C]/90 hover:to-[#16233B]/90 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Card>
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.a
              href="#"
              className="text-[#F49E2C] hover:text-white text-sm font-semibold transition-colors drop-shadow inline-block"
              whileHover={{ x: 5 }}
            >
              ¿Olvidaste tu contraseña? →
            </motion.a>
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="text-center text-white/80 text-xs pt-6 border-t border-white/10 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <p>© 2026 IPUC Villa Estado - Iglesia Pentecostal Unida de Colombia</p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}
