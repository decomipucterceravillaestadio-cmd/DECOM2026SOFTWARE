'use client';

import React from 'react';
import { UserRole, ROLE_LABELS, ROLE_LEVELS } from '@/app/types/auth';
import { cn } from '@/lib/utils';

export interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
  className?: string;
}

/**
 * Componente para mostrar visualmente el rol de un usuario
 * con estilos diferenciados según el nivel jerárquico
 */
export function RoleBadge({ role, size = 'md', showLevel = false, className }: RoleBadgeProps) {
  // Colores basados en nivel jerárquico (de menor a mayor)
  const getRoleStyles = (role: UserRole) => {
    const level = ROLE_LEVELS[role];

    switch (level) {
      case 5: // Admin
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 4: // Presidente
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 3: // Tesorero
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 2: // Secretario
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 1: // Vocal
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: // comite_member, decom_admin (legacy)
        return 'bg-dashboard-text-secondary/10 text-dashboard-text-secondary border-dashboard-text-secondary/20';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px] px-2 py-0.5 uppercase tracking-wider font-black';
      case 'lg':
        return 'text-sm px-4 py-1.5 uppercase tracking-widest font-black';
      case 'md':
      default:
        return 'text-[12px] px-3 py-1 uppercase tracking-widest font-black';
    }
  };

  const level = ROLE_LEVELS[role];
  const label = ROLE_LABELS[role];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all duration-300",
        getRoleStyles(role),
        getSizeStyles(),
        className
      )}
      title={`Nivel de acceso: ${level}/5`}
    >
      {showLevel && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px] font-black">
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
    switch (role) {
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
    <div className="space-y-4">
      {roles.map((role) => (
        <div
          key={role}
          className="flex items-start gap-4 rounded-xl border border-dashboard-card-border p-4 bg-dashboard-card hover:border-decom-secondary/30 hover:shadow-lg transition-all"
        >
          <div className="mt-0.5 shrink-0">
            <RoleBadge role={role} showLevel size="md" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-dashboard-text-secondary">
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

  switch (level) {
    case 5: return '👑'; // Admin
    case 4: return '🎖️'; // Presidente
    case 3: return '💼'; // Tesorero
    case 2: return '📝'; // Secretario
    case 1: return '👤'; // Vocal
    default: return '🔷'; // Legacy
  }
}
