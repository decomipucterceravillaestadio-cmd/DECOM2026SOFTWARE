// Database types
export type { Database, Json } from './database'

// Auth types
export type {
  AuthUser,
  AuthResponse,
  LoginCredentials,
  LoginResponse,
  UserRole as AuthUserRole,
} from './auth'

// Enums
export enum RequestStatus {
  Pendiente = "Pendiente",
  En_planificacion = "En_planificacion",
  En_diseño = "En_diseño",
  Lista = "Lista",
  Entregada = "Entregada",
}

export enum MaterialType {
  Flyer = "Flyer",
  Banner = "Banner",
  Video = "Video",
  Redes = "Redes Sociales",
  Otro = "Otro",
}

export enum UserRole {
  Miembro = "miembro",
  Comite = "comite",
  DecomAdmin = "decom_admin",
}

// Interfaces
export interface Committee {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  committee_id?: string;
}

export interface Request {
  id: string;
  committee_id: string;
  committee_name?: string;
  event_name: string;
  event_description?: string;
  event_date: string;
  planning_start_date: string;
  delivery_date: string;
  material_type: string;
  contact_whatsapp?: string;
  include_bible_verse?: boolean;
  bible_verse?: string;
  status: string;
  priority_score?: number;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface RequestHistory {
  id: string;
  request_id: string;
  old_status: string;
  new_status: string;
  changed_by_id: string;
  changed_at: string;
  notes?: string;
}

// DTOs
export interface CreateRequestDTO {
  committee_id: string;
  event_name: string;
  event_description: string;
  event_date: string;
  material_type: string;
  contact_whatsapp?: string;
  include_bible_verse?: boolean;
  bible_verse?: string;
}

export interface UpdateRequestDTO {
  status?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
