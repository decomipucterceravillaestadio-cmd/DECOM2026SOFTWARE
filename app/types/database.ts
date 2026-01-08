export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      committees: {
        Row: {
          color_badge: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color_badge?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color_badge?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      request_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          new_status: string
          old_status: string | null
          request_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status: string
          old_status?: string | null
          request_id: string
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: string
          old_status?: string | null
          request_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          bible_verse_text: string | null
          committee_id: string
          contact_whatsapp: string
          created_at: string | null
          created_by: string
          delivery_date: string | null
          event_date: string
          event_time: string | null
          event_info: string
          event_name: string
          id: string
          include_bible_verse: boolean | null
          material_type: string
          planning_start_date: string | null
          priority_score: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          bible_verse_text?: string | null
          committee_id: string
          contact_whatsapp: string
          created_at?: string | null
          created_by: string
          delivery_date?: string | null
          event_date: string
          event_time?: string | null
          event_info: string
          event_name: string
          id?: string
          include_bible_verse?: boolean | null
          material_type: string
          planning_start_date?: string | null
          priority_score?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          bible_verse_text?: string | null
          committee_id?: string
          contact_whatsapp?: string
          created_at?: string | null
          created_by?: string
          delivery_date?: string | null
          event_date?: string
          event_time?: string | null
          event_info?: string
          event_name?: string
          id?: string
          include_bible_verse?: boolean | null
          material_type?: string
          planning_start_date?: string | null
          priority_score?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          preferred_committee_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          preferred_committee_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          preferred_committee_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_requests_detailed: {
        Row: {
          bible_verse_text: string | null
          committee_id: string | null
          committee_name: string | null
          contact_whatsapp: string | null
          created_at: string | null
          created_by: string | null
          created_by_email: string | null
          created_by_name: string | null
          delivery_date: string | null
          event_date: string | null
          event_info: string | null
          event_name: string | null
          id: string | null
          include_bible_verse: boolean | null
          material_type: string | null
          planning_start_date: string | null
          priority_score: number | null
          status: string | null
          status_change_count: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_requests_public: {
        Row: {
          days_since_created: number | null
          days_until_delivery: number | null
          event_date: string | null
          id: string | null
          material_type: string | null
          priority_score: number | null
          status: string | null
        }
        Relationships: []
      }
      v_requests_urgent: {
        Row: {
          committee_name: string | null
          days_until_delivery: number | null
          delivery_date: string | null
          event_date: string | null
          event_name: string | null
          id: string | null
          priority_score: number | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
