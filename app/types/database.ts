export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
        Relationships: [
          {
            foreignKeyName: "request_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_requests_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_requests_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_requests_urgent"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          bible_verse_text: string | null
          committee_id: string
          contact_whatsapp: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          delivery_date: string | null
          event_date: string
          event_info: string
          event_name: string
          event_time: string | null
          id: string
          include_bible_verse: boolean | null
          material_type: string
          planning_start_date: string | null
          priority_score: number | null
          status: string
          updated_at: string | null
          visible_in_public_calendar: boolean
        }
        Insert: {
          bible_verse_text?: string | null
          committee_id: string
          contact_whatsapp: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          delivery_date?: string | null
          event_date: string
          event_info: string
          event_name: string
          event_time?: string | null
          id?: string
          include_bible_verse?: boolean | null
          material_type: string
          planning_start_date?: string | null
          priority_score?: number | null
          status?: string
          updated_at?: string | null
          visible_in_public_calendar?: boolean
        }
        Update: {
          bible_verse_text?: string | null
          committee_id?: string
          contact_whatsapp?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          delivery_date?: string | null
          event_date?: string
          event_info?: string
          event_name?: string
          event_time?: string | null
          id?: string
          include_bible_verse?: boolean | null
          material_type?: string
          planning_start_date?: string | null
          priority_score?: number | null
          status?: string
          updated_at?: string | null
          visible_in_public_calendar?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "requests_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string
          role_level: number | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          role_level?: number | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          role_level?: number | null
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
          deleted_at: string | null
          deletion_reason: string | null
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
        Relationships: [
          {
            foreignKeyName: "requests_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Insert: {
          days_since_created?: never
          days_until_delivery?: never
          event_date?: string | null
          id?: string | null
          material_type?: string | null
          priority_score?: number | null
          status?: string | null
        }
        Update: {
          days_since_created?: never
          days_until_delivery?: never
          event_date?: string | null
          id?: string | null
          material_type?: string | null
          priority_score?: number | null
          status?: string | null
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
    Functions: {
      test_password: {
        Args: { email_param: string; password_param: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
