export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      committees: {
        Row: {
          id: string
          name: string
          description: string | null
          color_badge: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color_badge?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color_badge?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          id: string
          committee_id: string
          event_name: string
          event_description: string | null
          event_date: string
          planning_start_date: string
          delivery_date: string
          material_type: string
          contact_whatsapp: string | null
          include_bible_verse: boolean | null
          bible_verse: string | null
          status: string
          priority_score: number | null
          created_by_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          committee_id: string
          event_name: string
          event_description?: string | null
          event_date: string
          planning_start_date: string
          delivery_date: string
          material_type: string
          contact_whatsapp?: string | null
          include_bible_verse?: boolean | null
          bible_verse?: string | null
          status?: string
          priority_score?: number | null
          created_by_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          committee_id?: string
          event_name?: string
          event_description?: string | null
          event_date?: string
          planning_start_date?: string
          delivery_date?: string
          material_type?: string
          contact_whatsapp?: string | null
          include_bible_verse?: boolean | null
          bible_verse?: string | null
          status?: string
          priority_score?: number | null
          created_by_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          }
        ]
      }
      request_history: {
        Row: {
          id: string
          request_id: string
          old_status: string
          new_status: string
          changed_by_id: string | null
          changed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          request_id: string
          old_status: string
          new_status: string
          changed_by_id?: string | null
          changed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          request_id?: string
          old_status?: string
          new_status?: string
          changed_by_id?: string | null
          changed_at?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          full_name: string | null
          role: string
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          role_level: number | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          full_name?: string | null
          role?: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          role_level?: number | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          full_name?: string | null
          role?: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          role_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}