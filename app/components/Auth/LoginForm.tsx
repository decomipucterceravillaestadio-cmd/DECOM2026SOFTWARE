"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
    <div className="min-h-screen bg-gradient-to-b from-[#16233B] via-[#15539C] to-[#F5F5F5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo Section */}
        <div className="flex justify-center pt-4">
          <div className="relative">
            {/* Decorative circles */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#F49E2C] to-[#F49E2C]/50 rounded-full opacity-20 blur-lg"></div>
            
            {/* Logo Circle */}
            <div className="relative bg-gradient-to-br from-[#15539C] to-[#16233B] w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-2 border-[#F49E2C]">
              <span className="text-5xl">✝️</span>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Sistema DECOM
          </h1>
          <p className="text-[#F49E2C] text-base font-semibold drop-shadow">
            IPUC Villa Estado - Gestión de Comunicaciones
          </p>
        </div>

        {/* Error Message */}
        {formError && (
          <Card className="border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium">{formError}</span>
            </div>
          </Card>
        )}

        {/* Form Card */}
        <Card padding="lg" className="bg-white shadow-2xl border-t-4 border-[#F49E2C]">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[#16233B] font-semibold text-sm">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className={`w-full px-4 py-3 pl-10 rounded-lg bg-white text-[#16233B] placeholder-gray-400 border-2 ${
                    errors.email ? "border-red-300" : "border-[#15539C]"
                  } focus:outline-none focus:ring-2 focus:ring-[#15539C]/50 transition-all`}
                  {...register("email")}
                  disabled={isLoading}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📧</span>
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-[#16233B] font-semibold text-sm">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pl-10 pr-12 rounded-lg bg-white text-[#16233B] placeholder-gray-400 border-2 ${
                    errors.password ? "border-red-300" : "border-[#15539C]"
                  } focus:outline-none focus:ring-2 focus:ring-[#15539C]/50 transition-all`}
                  {...register("password")}
                  disabled={isLoading}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#16233B] hover:text-[#15539C] transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-6 bg-gradient-to-r from-[#15539C] to-[#16233B] border-b-4 border-[#F49E2C] hover:from-[#15539C]/90 hover:to-[#16233B]/90"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </Card>

        {/* Forgot Password Link */}
        <div className="text-center">
          <a 
            href="#" 
            className="text-[#F49E2C] hover:text-[#F49E2C]/80 text-sm font-semibold transition-colors drop-shadow"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Footer */}
        <footer className="text-center text-white text-xs pt-6 border-t border-white/20 drop-shadow">
          <p>© 2026 IPUC Villa Estado - Iglesia Pentecostal Unida de Colombia</p>
        </footer>
      </div>
    </div>
  );
}
