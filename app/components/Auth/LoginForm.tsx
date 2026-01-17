"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/UI/Button";
import { Card } from "@/app/components/UI/Card";
import { IconMail, IconLock, IconEye, IconEyeOff, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen relative overflow-hidden bg-[#16233B] flex items-center justify-center font-sans">
      {/* Background with dynamic elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#16233B] via-[#1a2847] to-[#15539C]" />

        {/* Floating shapes */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#F49E2C]/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#15539C]/20 rounded-full blur-[150px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-10 text-center"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-4 bg-gradient-to-r from-decom-secondary/50 via-decom-secondary/20 to-transparent rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative bg-white p-4 rounded-[2rem] shadow-2xl border-4 border-decom-secondary/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/favicon.png"
                alt="Logo IPUC"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <h1 className="text-5xl font-black text-white tracking-tighter">
              DECOM<span className="text-decom-secondary">.</span>
            </h1>
            <p className="text-white/60 text-sm font-bold uppercase tracking-[0.3em]">
              IPUC Villa Estadio
            </p>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-decom-primary via-decom-secondary to-decom-secondary" />

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {formError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 overflow-hidden"
                >
                  <div className="bg-red-100 p-2 rounded-xl text-red-600">
                    <IconAlertCircle className="w-5 h-5 font-bold" />
                  </div>
                  <span className="text-sm font-bold text-red-800">{formError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-decom-primary-light ml-1">
                  Email Corporativo
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-decom-secondary transition-colors duration-300">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="email@ipucvillaestadio.com"
                    className={cn(
                      "w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-decom-primary font-bold placeholder-gray-400 transition-all duration-300 outline-none",
                      "focus:bg-white focus:border-decom-secondary focus:ring-4 focus:ring-decom-secondary/10",
                      errors.email && "border-red-200 bg-red-50/30"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-[11px] font-bold text-red-500 ml-1">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-decom-primary-light">
                    Contraseña
                  </label>
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-decom-secondary hover:underline">
                    ¿Olvidaste?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-decom-secondary transition-colors duration-300">
                    <IconLock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className={cn(
                      "w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-14 text-decom-primary font-bold placeholder-gray-400 transition-all duration-300 outline-none",
                      "focus:bg-white focus:border-decom-secondary focus:ring-4 focus:ring-decom-secondary/10",
                      errors.password && "border-red-200 bg-red-50/30"
                    )}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-decom-secondary transition-colors"
                  >
                    {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] font-bold text-red-500 ml-1">{errors.password.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  variant="secondary"
                  className="py-6 rounded-2xl text-lg font-black shadow-2xl shadow-decom-secondary/30 relative group overflow-hidden"
                >
                  <span className="relative z-10">{isLoading ? "Verificando..." : "Ingresar al Portal"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-decom-secondary via-[#f6b052] to-decom-secondary translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">
            © 2026 DECOM Platform • IPUC Villa Estadio
          </p>
        </motion.div>
      </div>
    </div>
  );
}
