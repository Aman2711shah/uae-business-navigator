export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          application_id: string
          created_at: string
          freezone_name: string
          id: string
          legal_entity_type: string
          number_of_shareholders: number
          number_of_visas: number
          package_id: number | null
          package_name: string
          package_type: string
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          freezone_name: string
          id?: string
          legal_entity_type: string
          number_of_shareholders?: number
          number_of_visas?: number
          package_id?: number | null
          package_name: string
          package_type: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          freezone_name?: string
          id?: string
          legal_entity_type?: string
          number_of_shareholders?: number
          number_of_visas?: number
          package_id?: number | null
          package_name?: string
          package_type?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      business_setup_costs: {
        Row: {
          category: string
          extra_fee: number | null
          freezone_fee: number | null
          id: number
          item_name: string | null
          License_fee: number | null
        }
        Insert: {
          category: string
          extra_fee?: number | null
          freezone_fee?: number | null
          id: number
          item_name?: string | null
          License_fee?: number | null
        }
        Update: {
          category?: string
          extra_fee?: number | null
          freezone_fee?: number | null
          id?: number
          item_name?: string | null
          License_fee?: number | null
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          created_at: string
          id: number
          question: string
          response: string
          response_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          question: string
          response: string
          response_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          question?: string
          response?: string
          response_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_requirements: {
        Row: {
          created_at: string
          document_description: string | null
          document_name: string
          document_type: string
          freezone_name: string
          id: string
          is_required: boolean
          legal_entity_type: string
          template_url: string | null
        }
        Insert: {
          created_at?: string
          document_description?: string | null
          document_name: string
          document_type?: string
          freezone_name: string
          id?: string
          is_required?: boolean
          legal_entity_type: string
          template_url?: string | null
        }
        Update: {
          created_at?: string
          document_description?: string | null
          document_name?: string
          document_type?: string
          freezone_name?: string
          id?: string
          is_required?: boolean
          legal_entity_type?: string
          template_url?: string | null
        }
        Relationships: []
      }
      document_uploads: {
        Row: {
          application_id: string | null
          document_requirement_id: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          upload_status: string
          uploaded_at: string
        }
        Insert: {
          application_id?: string | null
          document_requirement_id?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          upload_status?: string
          uploaded_at?: string
        }
        Update: {
          application_id?: string | null
          document_requirement_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          upload_status?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_uploads_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_uploads_document_requirement_id_fkey"
            columns: ["document_requirement_id"]
            isOneToOne: false
            referencedRelation: "document_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      freezone_costs: {
        Row: {
          additional_fee: number
          base_license_cost: number
          created_at: string | null
          freezone_name: string
          id: number
          license_type: string
          minimum_cost: number
          no_of_activity: number
          updated_at: string | null
          visa_cost: number
        }
        Insert: {
          additional_fee: number
          base_license_cost: number
          created_at?: string | null
          freezone_name: string
          id?: number
          license_type: string
          minimum_cost: number
          no_of_activity: number
          updated_at?: string | null
          visa_cost: number
        }
        Update: {
          additional_fee?: number
          base_license_cost?: number
          created_at?: string | null
          freezone_name?: string
          id?: number
          license_type?: string
          minimum_cost?: number
          no_of_activity?: number
          updated_at?: string | null
          visa_cost?: number
        }
        Relationships: []
      }
      freezone_info: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          faqs: Json | null
          freezone_name: string
          id: string
          key_benefits: string[] | null
          office_location: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          faqs?: Json | null
          freezone_name: string
          id?: string
          key_benefits?: string[] | null
          office_location?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          faqs?: Json | null
          freezone_name?: string
          id?: string
          key_benefits?: string[] | null
          office_location?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          activities_allowed: number
          base_cost: number
          created_at: string | null
          freezone_name: string
          id: number
          included_services: string | null
          max_visas: number
          package_name: string
          package_type: string
          per_visa_cost: number | null
          price_aed: number
          shareholders_allowed: number
          tenure_years: number
          updated_at: string | null
        }
        Insert: {
          activities_allowed?: number
          base_cost: number
          created_at?: string | null
          freezone_name: string
          id?: number
          included_services?: string | null
          max_visas?: number
          package_name: string
          package_type: string
          per_visa_cost?: number | null
          price_aed: number
          shareholders_allowed?: number
          tenure_years?: number
          updated_at?: string | null
        }
        Update: {
          activities_allowed?: number
          base_cost?: number
          created_at?: string | null
          freezone_name?: string
          id?: number
          included_services?: string | null
          max_visas?: number
          package_name?: string
          package_type?: string
          per_visa_cost?: number | null
          price_aed?: number
          shareholders_allowed?: number
          tenure_years?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string
          document_uploaded: boolean | null
          id: string
          request_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          document_uploaded?: boolean | null
          id?: string
          request_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          document_uploaded?: boolean | null
          id?: string
          request_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          feedback_text: string | null
          id: string
          rating: number
          submitted_on: string
          user_id: string | null
        }
        Insert: {
          feedback_text?: string | null
          id?: string
          rating: number
          submitted_on?: string
          user_id?: string | null
        }
        Update: {
          feedback_text?: string | null
          id?: string
          rating?: number
          submitted_on?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          target_user_id: string
          new_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      create_initial_admin: {
        Args: { admin_email: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
