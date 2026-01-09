'use client';

import React from 'react';
import { UserRole, ROLE_LABELS, ROLE_LEVELS } from '@/app/types/auth';

export interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
}

/**
 * Componente para mostrar visualmente el rol de un usuario
 * con estilos diferenciados según el nivel jerárquico
 */
export function RoleBadge({ role, size = 'md', showLevel = false }: RoleBadgeProps) {
  // Colores basados en nivel jerárquico (de menor a mayor)
  const getRoleStyles = (role: UserRole) => {
    const level = ROLE_LEVELS[role];
    
    switch(level) {
      case 5: // Admin
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200';
      case 4: // Presidente
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200';
      case 3: // Tesorero
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200';
      case 2: // Secretario
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200';
      case 1: // Vocal
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200';
      default: // comite_member, decom_admin (legacy)
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };
  
  const getSizeStyles = () => {
    switch(size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-base px-4 py-2';
      case 'md':
      default:
        return 'text-sm px-3 py-1';
    }
  };
  
  const level = ROLE_LEVELS[role];
  const label = ROLE_LABELS[role];
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 
        rounded-full border font-medium
        ${getRoleStyles(role)} 
        ${getSizeStyles()}
      `}
      title={`Nivel de acceso: ${level}/5`}
    >
      {showLevel && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/50 text-xs font-bold">
          {level}
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}

/**
 * Componente para mostrar lista de roles con descripción
 * Útil para UI de gestión de usuarios o configuración
 */
export function RoleList() {
  const roles: UserRole[] = ['admin', 'presidente', 'tesorero', 'secretario', 'vocal'];
  
  const getDescription = (role: UserRole): string => {
    switch(role) {
      case 'admin':
        return 'Acceso completo a todas las funcionalidades del sistema';
      case 'presidente':
        return 'Gestión de usuarios y supervisión general';
      case 'tesorero':
        return 'Gestión financiera y reportes';
      case 'secretario':
        return 'Gestión de documentos y actas';
      case 'vocal':
        return 'Acceso básico a solicitudes y calendario';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <div 
          key={role}
          className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="mt-1">
            <RoleBadge role={role} showLevel />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getDescription(role)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Hook para obtener el ícono apropiado para cada rol
 * (Requiere biblioteca de íconos como lucide-react o heroicons)
 */
export function useRoleIcon(role: UserRole): string {
  const level = ROLE_LEVELS[role];
  
  switch(level) {
    case 5: return '👑'; // Admin
    case 4: return '🎖️'; // Presidente
    case 3: return '💼'; // Tesorero
    case 2: return '📝'; // Secretario
    case 1: return '👤'; // Vocal
    default: return '🔷'; // Legacy
  }
}
