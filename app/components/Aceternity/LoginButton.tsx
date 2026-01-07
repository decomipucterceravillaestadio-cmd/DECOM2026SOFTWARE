import React from 'react';
import { motion } from 'framer-motion';

interface LoginButtonProps {
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function LoginButton({
  label,
  onClick,
  isLoading = false,
  disabled = false,
  type = 'button',
}: LoginButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className="w-full py-3 px-4 rounded-lg font-semibold text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-decom-primary via-decom-primary to-decom-primary/80" />
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={!disabled && !isLoading ? { x: '100%' } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        )}
        <span>{isLoading ? 'Iniciando sesión...' : label}</span>
      </div>
    </motion.button>
  );
}