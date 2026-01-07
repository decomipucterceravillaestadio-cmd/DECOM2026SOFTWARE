import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoginInput } from './LoginInput';
import { LoginButton } from './LoginButton';
import { BackgroundBeams } from './BackgroundBeams';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Background Beams */}
      <BackgroundBeams />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center space-y-2"
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(139, 0, 0, 0.4)',
                    '0 0 0 20px rgba(139, 0, 0, 0)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="w-16 h-16 bg-gradient-to-br from-decom-primary to-decom-primary/80 rounded-2xl flex items-center justify-center"
              >
                <span className="text-3xl font-bold text-white">✝</span>
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold text-decom-text-dark">
              Sistema DECOM
            </h1>
            <p className="text-gray-600 text-sm">
              IPUC Villa Estado - Gestión de Comunicaciones
            </p>
          </motion.div>

          {/* Error Message */}
          {externalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-50 border-2 border-red-200"
            >
              <p className="text-sm font-medium text-red-700">{externalError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <LoginInput
              label="Correo Electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              disabled={isLoaderActive}
            />

            {/* Password Input */}
            <LoginInput
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              error={errors.password}
              disabled={isLoaderActive}
            />

            {/* Submit Button */}
            <LoginButton
              label="Iniciar Sesión"
              type="submit"
              isLoading={isLoaderActive}
              disabled={isLoaderActive}
            />
          </form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 text-center"
          >
            <a
              href="#"
              className="text-sm font-medium text-decom-primary hover:text-decom-primary/80 transition-colors block"
            >
              ¿Olvidaste tu contraseña?
            </a>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                © 2026 IPUC Villa Estado • Sistema DECOM
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}