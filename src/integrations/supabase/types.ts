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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addon_prices: {
        Row: {
          addon_key: string | null
          freezone_id: string | null
          id: string
          price: number | null
        }
        Insert: {
          addon_key?: string | null
          freezone_id?: string | null
          id?: string
          price?: number | null
        }
        Update: {
          addon_key?: string | null
          freezone_id?: string | null
          id?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "addon_prices_freezone_id_fkey"
            columns: ["freezone_id"]
            isOneToOne: false
            referencedRelation: "freezones"
            referencedColumns: ["freezone_id"]
          },
        ]
      }
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
          user_id: string
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
          user_id: string
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
          user_id?: string
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
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          question: string
          response: string
          response_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          question?: string
          response?: string
          response_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id: string
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry_tag: string | null
          member_count: number | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_tag?: string | null
          member_count?: number | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_tag?: string | null
          member_count?: number | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          profile_id: string
          role: string | null
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          profile_id: string
          role?: string | null
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          profile_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          body: string
          comments_count: number | null
          created_at: string
          id: string
          image_url: string | null
          industry_tag: string
          likes_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          comments_count?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          industry_tag: string
          likes_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          comments_count?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          industry_tag?: string
          likes_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_users: {
        Row: {
          about_you: string | null
          business_stage: string | null
          business_type: string
          company_name: string
          employee_count: string | null
          id: string
          industries: string[]
          industry: string
          joined_at: string
          updated_at: string
          user_id: string
          username: string
          website_or_linkedin: string | null
        }
        Insert: {
          about_you?: string | null
          business_stage?: string | null
          business_type: string
          company_name: string
          employee_count?: string | null
          id?: string
          industries?: string[]
          industry: string
          joined_at?: string
          updated_at?: string
          user_id: string
          username: string
          website_or_linkedin?: string | null
        }
        Update: {
          about_you?: string | null
          business_stage?: string | null
          business_type?: string
          company_name?: string
          employee_count?: string | null
          id?: string
          industries?: string[]
          industry?: string
          joined_at?: string
          updated_at?: string
          user_id?: string
          username?: string
          website_or_linkedin?: string | null
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
      flags: {
        Row: {
          created_at: string | null
          details: string | null
          entity_id: string
          entity_type: string
          id: string
          reason: string | null
          reported_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          entity_id: string
          entity_type: string
          id?: string
          reason?: string | null
          reported_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          reason?: string | null
          reported_by?: string | null
          status?: string | null
        }
        Relationships: []
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
      freezones: {
        Row: {
          admin_fee_percent: number | null
          base_license_yearly: number | null
          freezone_id: string | null
          id: string
          name: string | null
          office_flex_fee_yearly: number | null
          office_small_office_fee_yearly: number | null
          requires_physical_office: boolean | null
          vat_percent: number | null
          visa_fee_per: number | null
        }
        Insert: {
          admin_fee_percent?: number | null
          base_license_yearly?: number | null
          freezone_id?: string | null
          id?: string
          name?: string | null
          office_flex_fee_yearly?: number | null
          office_small_office_fee_yearly?: number | null
          requires_physical_office?: boolean | null
          vat_percent?: number | null
          visa_fee_per?: number | null
        }
        Update: {
          admin_fee_percent?: number | null
          base_license_yearly?: number | null
          freezone_id?: string | null
          id?: string
          name?: string | null
          office_flex_fee_yearly?: number | null
          office_small_office_fee_yearly?: number | null
          requires_physical_office?: boolean | null
          vat_percent?: number | null
          visa_fee_per?: number | null
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
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          fields: Json | null
          file_name: string | null
          file_url: string | null
          firstname: string | null
          form_name: string
          id: string
          lastname: string | null
          notes: string | null
          phone: string | null
          service: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          fields?: Json | null
          file_name?: string | null
          file_url?: string | null
          firstname?: string | null
          form_name: string
          id?: string
          lastname?: string | null
          notes?: string | null
          phone?: string | null
          service?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          fields?: Json | null
          file_name?: string | null
          file_url?: string | null
          firstname?: string | null
          form_name?: string
          id?: string
          lastname?: string | null
          notes?: string | null
          phone?: string | null
          service?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: []
      }
      marketplace_images: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_name: string | null
          id: string
          item_id: string
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          item_id: string
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          item_id?: string
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_images_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          location: string | null
          post_id: string | null
          price: number | null
          profile_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          location?: string | null
          post_id?: string | null
          price?: number | null
          profile_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          location?: string | null
          post_id?: string | null
          price?: number | null
          profile_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          payload: Json
          profile_id: string
          read: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          payload: Json
          profile_id: string
          read?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          payload?: Json
          profile_id?: string
          read?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_submissions: {
        Row: {
          contact_info: Json
          created_at: string
          id: string
          request_id: string | null
          status: string
          updated_at: string
          uploaded_documents: Json
          user_email: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          contact_info?: Json
          created_at?: string
          id?: string
          request_id?: string | null
          status?: string
          updated_at?: string
          uploaded_documents?: Json
          user_email: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          contact_info?: Json
          created_at?: string
          id?: string
          request_id?: string | null
          status?: string
          updated_at?: string
          uploaded_documents?: Json
          user_email?: string
          user_id?: string | null
          user_name?: string
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
      post_attachments: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_name: string | null
          id: string
          post_id: string
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          post_id: string
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          post_id?: string
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_attachments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          community_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_marketplace: boolean | null
          likes_count: number | null
          metadata: Json | null
          pinned: boolean | null
          profile_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          comments_count?: number | null
          community_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_marketplace?: boolean | null
          likes_count?: number | null
          metadata?: Json | null
          pinned?: boolean | null
          profile_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          comments_count?: number | null
          community_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_marketplace?: boolean | null
          likes_count?: number | null
          metadata?: Json | null
          pinned?: boolean | null
          profile_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          headline: string | null
          id: string
          services: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          services?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          services?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_quotes: {
        Row: {
          alternative_packages: Json | null
          cost_breakdown: Json | null
          created_at: string
          entity_type: string | null
          estimated_cost: number | null
          id: string
          is_freezone: boolean | null
          quote_name: string
          recommended_package: Json | null
          selected_activities: string[]
          shareholders: number
          status: string
          tenure: number
          total_visas: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alternative_packages?: Json | null
          cost_breakdown?: Json | null
          created_at?: string
          entity_type?: string | null
          estimated_cost?: number | null
          id?: string
          is_freezone?: boolean | null
          quote_name?: string
          recommended_package?: Json | null
          selected_activities?: string[]
          shareholders?: number
          status?: string
          tenure?: number
          total_visas?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alternative_packages?: Json | null
          cost_breakdown?: Json | null
          created_at?: string
          entity_type?: string | null
          estimated_cost?: number | null
          id?: string
          is_freezone?: boolean | null
          quote_name?: string
          recommended_package?: Json | null
          selected_activities?: string[]
          shareholders?: number
          status?: string
          tenure?: number
          total_visas?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
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
          user_id: string
        }
        Insert: {
          created_at?: string
          document_uploaded?: boolean | null
          id?: string
          request_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_uploaded?: boolean | null
          id?: string
          request_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      stripe_charges: {
        Row: {
          amount: number | null
          created: string | null
          currency: string | null
          customer: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_intent: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created?: string | null
          currency?: string | null
          customer?: string | null
          description?: string | null
          id: string
          metadata?: Json | null
          payment_intent?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created?: string | null
          currency?: string | null
          customer?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_intent?: string | null
          status?: string | null
        }
        Relationships: []
      }
      stripe_checkout_sessions: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          created: string | null
          currency: string | null
          customer: string | null
          id: string
          metadata: Json | null
          payment_intent: string | null
          status: string | null
        }
        Insert: {
          amount_subtotal?: number | null
          amount_total?: number | null
          created?: string | null
          currency?: string | null
          customer?: string | null
          id: string
          metadata?: Json | null
          payment_intent?: string | null
          status?: string | null
        }
        Update: {
          amount_subtotal?: number | null
          amount_total?: number | null
          created?: string | null
          currency?: string | null
          customer?: string | null
          id?: string
          metadata?: Json | null
          payment_intent?: string | null
          status?: string | null
        }
        Relationships: []
      }
      stripe_payment_intents: {
        Row: {
          amount: number | null
          created: string | null
          currency: string | null
          id: string
          metadata: Json | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created?: string | null
          currency?: string | null
          id: string
          metadata?: Json | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      sub_services: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          name: string
          price: number | null
          required_documents: string[] | null
          service_id: string
          timeline: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          name: string
          price?: number | null
          required_documents?: string[] | null
          service_id: string
          timeline?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          price?: number | null
          required_documents?: string[] | null
          service_id?: string
          timeline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_documents: {
        Row: {
          content_type: string | null
          field_name: string
          file_name: string
          id: string
          size_bytes: number | null
          storage_path: string
          submission_id: string
          uploaded_at: string
        }
        Insert: {
          content_type?: string | null
          field_name: string
          file_name: string
          id?: string
          size_bytes?: number | null
          storage_path: string
          submission_id: string
          uploaded_at?: string
        }
        Update: {
          content_type?: string | null
          field_name?: string
          file_name?: string
          id?: string
          size_bytes?: number | null
          storage_path?: string
          submission_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_documents_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          contact_info: Json
          created_at: string
          id: string
          notes: string | null
          payload: Json | null
          payment_amount: number | null
          payment_currency: string | null
          payment_intent_id: string | null
          payment_metadata: Json | null
          payment_status: string | null
          request_id: string | null
          service_id: string
          status: string
          sub_service_id: string | null
          total_price: number | null
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          contact_info?: Json
          created_at?: string
          id?: string
          notes?: string | null
          payload?: Json | null
          payment_amount?: number | null
          payment_currency?: string | null
          payment_intent_id?: string | null
          payment_metadata?: Json | null
          payment_status?: string | null
          request_id?: string | null
          service_id: string
          status?: string
          sub_service_id?: string | null
          total_price?: number | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          contact_info?: Json
          created_at?: string
          id?: string
          notes?: string | null
          payload?: Json | null
          payment_amount?: number | null
          payment_currency?: string | null
          payment_intent_id?: string | null
          payment_metadata?: Json | null
          payment_status?: string | null
          request_id?: string | null
          service_id?: string
          status?: string
          sub_service_id?: string | null
          total_price?: number | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_sub_service_id_fkey"
            columns: ["sub_service_id"]
            isOneToOne: false
            referencedRelation: "sub_services"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_estimates: {
        Row: {
          created_at: string
          description: string | null
          entity_type: string
          estimated_days: number
          freezone_name: string | null
          id: string
          is_business_day: boolean | null
          process_step: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_type: string
          estimated_days: number
          freezone_name?: string | null
          id?: string
          is_business_day?: boolean | null
          process_step: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_type?: string
          estimated_days?: number
          freezone_name?: string | null
          id?: string
          is_business_day?: boolean | null
          process_step?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          feedback_text: string | null
          id: string
          rating: number
          submitted_on: string
          user_id: string
        }
        Insert: {
          feedback_text?: string | null
          id?: string
          rating: number
          submitted_on?: string
          user_id: string
        }
        Update: {
          feedback_text?: string | null
          id?: string
          rating?: number
          submitted_on?: string
          user_id?: string
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
      freezone_public_info: {
        Row: {
          created_at: string | null
          description: string | null
          faqs: Json | null
          freezone_name: string | null
          id: string | null
          key_benefits: string[] | null
          office_location: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          faqs?: Json | null
          freezone_name?: string | null
          id?: string | null
          key_benefits?: string[] | null
          office_location?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          faqs?: Json | null
          freezone_name?: string | null
          id?: string | null
          key_benefits?: string[] | null
          office_location?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      can_view_profile_field: {
        Args: { field_name: string; profile_user_id: string }
        Returns: boolean
      }
      check_admin_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_initial_admin: {
        Args: { admin_email: string }
        Returns: undefined
      }
      generate_request_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_application_payment_status_admin: {
        Args: { p_request_id: string }
        Returns: {
          charge_amount: number
          charge_created: string
          charge_currency: string
          charge_id: string
          charge_status: string
          checkout_amount: number
          checkout_created: string
          checkout_currency: string
          checkout_session_id: string
          checkout_status: string
          payment_intent_id: string
          payment_status: string
          request_id: string
          submission_created: string
          submission_status: string
          user_email: string
          user_name: string
        }[]
      }
      get_application_payment_status_secure: {
        Args: { p_request_id?: string }
        Returns: {
          charge_amount: number
          charge_created: string
          charge_currency: string
          charge_id: string
          charge_status: string
          checkout_amount: number
          checkout_created: string
          checkout_currency: string
          checkout_session_id: string
          checkout_status: string
          payment_intent_id: string
          payment_status: string
          request_id: string
          submission_created: string
          submission_status: string
          user_email: string
          user_name: string
        }[]
      }
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          email: string
          full_name: string
          headline: string
          id: string
          services: string[]
          updated_at: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          details?: Json
          event_type: string
          ip_address?: string
          severity?: string
          user_agent?: string
          user_id?: string
        }
        Returns: undefined
      }
      setup_initial_admin: {
        Args: Record<PropertyKey, never>
        Returns: string
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
