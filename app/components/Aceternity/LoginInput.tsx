import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconLock, IconLockOpen } from '@tabler/icons-react';

interface LoginInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function LoginInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
}: LoginInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-decom-text-dark">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={isPassword ? 'current-password' : 'off'}
          className={`w-full px-4 py-3 rounded-lg bg-white border-2 transition-all duration-200 focus:outline-none text-base ${error
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
              : 'border-gray-200 focus:border-decom-primary focus:ring-2 focus:ring-decom-primary/20'
            } disabled:bg-gray-100 disabled:cursor-not-allowed text-decom-text-dark placeholder-gray-400`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-decom-primary transition-colors"
            disabled={disabled}
          >
            {showPassword ? (
              <IconLockOpen size={20} />
            ) : (
              <IconLock size={20} />
            )}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}