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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string
          id: string
          is_default: boolean | null
          label: string | null
          state: string | null
          street: string
          user_id: string
          zip: string | null
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          state?: string | null
          street: string
          user_id: string
          zip?: string | null
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          state?: string | null
          street?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
      artisans: {
        Row: {
          active: boolean | null
          bio: string | null
          created_at: string
          heritage: string | null
          id: string
          location: string | null
          name: string
          photo: string | null
          products_count: number | null
          rating: number | null
          role: string | null
          slug: string
          studio_images: string[] | null
          total_sales: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          heritage?: string | null
          id?: string
          location?: string | null
          name: string
          photo?: string | null
          products_count?: number | null
          rating?: number | null
          role?: string | null
          slug: string
          studio_images?: string[] | null
          total_sales?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          created_at?: string
          heritage?: string | null
          id?: string
          location?: string | null
          name?: string
          photo?: string | null
          products_count?: number | null
          rating?: number | null
          role?: string | null
          slug?: string
          studio_images?: string[] | null
          total_sales?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          personalization: string | null
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          personalization?: string | null
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          personalization?: string | null
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      collection_products: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          best_for: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          metadata: Json | null
          name: string
          slug: string
          status: string | null
          updated_at: string
        }
        Insert: {
          best_for?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          metadata?: Json | null
          name: string
          slug: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          best_for?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          metadata?: Json | null
          name?: string
          slug?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          change_amount: number
          created_at: string
          id: string
          product_id: string
          product_name: string
          reason: string | null
        }
        Insert: {
          change_amount: number
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          reason?: string | null
        }
        Update: {
          change_amount?: number
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_settings: {
        Row: {
          id: string
          points_per_dollar: number | null
          redemption_options: Json | null
          tier_thresholds: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          points_per_dollar?: number | null
          redemption_options?: Json | null
          tier_thresholds?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          points_per_dollar?: number | null
          redemption_options?: Json | null
          tier_thresholds?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          personalization: string | null
          price: number
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          sku: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          personalization?: string | null
          price: number
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity?: number
          sku?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          personalization?: string | null
          price?: number
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_current: boolean | null
          location: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_timeline_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivery_fee: number | null
          discount: number | null
          gift_message: string | null
          gift_recipient: string | null
          gift_wrap_fee: number | null
          gift_wrap_style: string | null
          grand_total: number | null
          id: string
          order_number: string
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: string | null
          shipping_carrier: string | null
          shipping_method: string | null
          slot: string | null
          status: string
          subtotal: number | null
          tax: number | null
          tracking_number: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivery_fee?: number | null
          discount?: number | null
          gift_message?: string | null
          gift_recipient?: string | null
          gift_wrap_fee?: number | null
          gift_wrap_style?: string | null
          grand_total?: number | null
          id?: string
          order_number: string
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: string | null
          shipping_carrier?: string | null
          shipping_method?: string | null
          slot?: string | null
          status?: string
          subtotal?: number | null
          tax?: number | null
          tracking_number?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_fee?: number | null
          discount?: number | null
          gift_message?: string | null
          gift_recipient?: string | null
          gift_wrap_fee?: number | null
          gift_wrap_style?: string | null
          grand_total?: number | null
          id?: string
          order_number?: string
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: string | null
          shipping_carrier?: string | null
          shipping_method?: string | null
          slot?: string | null
          status?: string
          subtotal?: number | null
          tax?: number | null
          tracking_number?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_type: string
          created_at: string
          expiry: string
          id: string
          is_default: boolean | null
          last4: string
          user_id: string
        }
        Insert: {
          card_type: string
          created_at?: string
          expiry: string
          id?: string
          is_default?: boolean | null
          last4: string
          user_id: string
        }
        Update: {
          card_type?: string
          created_at?: string
          expiry?: string
          id?: string
          is_default?: boolean | null
          last4?: string
          user_id?: string
        }
        Relationships: []
      }
      points_history: {
        Row: {
          change_amount: number
          created_at: string
          id: string
          profile_id: string | null
          reason: string
        }
        Insert: {
          change_amount: number
          created_at?: string
          id?: string
          profile_id?: string | null
          reason: string
        }
        Update: {
          change_amount?: number
          created_at?: string
          id?: string
          profile_id?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_products: {
        Row: {
          id: string
          portal_id: string
          product_id: string
        }
        Insert: {
          id?: string
          portal_id: string
          product_id: string
        }
        Update: {
          id?: string
          portal_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_products_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      portals: {
        Row: {
          active: boolean | null
          client: string
          created_at: string
          discount_pct: number | null
          id: string
          logo: string | null
          name: string
          portal_orders: number | null
          primary_color: string | null
          revenue: number | null
          slug: string
          updated_at: string
          views: number | null
          welcome_message: string | null
        }
        Insert: {
          active?: boolean | null
          client: string
          created_at?: string
          discount_pct?: number | null
          id?: string
          logo?: string | null
          name: string
          portal_orders?: number | null
          primary_color?: string | null
          revenue?: number | null
          slug: string
          updated_at?: string
          views?: number | null
          welcome_message?: string | null
        }
        Update: {
          active?: boolean | null
          client?: string
          created_at?: string
          discount_pct?: number | null
          id?: string
          logo?: string | null
          name?: string
          portal_orders?: number | null
          primary_color?: string | null
          revenue?: number | null
          slug?: string
          updated_at?: string
          views?: number | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          artisan_id: string | null
          category_id: string | null
          category_name: string | null
          created_at: string
          description: string | null
          details: string[] | null
          id: string
          images: string[] | null
          is_best_seller: boolean | null
          is_new_arrival: boolean | null
          name: string
          occasion: string[] | null
          price: number
          rating: number | null
          recipient: string[] | null
          review_count: number | null
          short_desc: string | null
          slug: string
          specifications: Json | null
          stock: number | null
          story: string | null
          updated_at: string
          vibe: string[] | null
        }
        Insert: {
          active?: boolean | null
          artisan_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          description?: string | null
          details?: string[] | null
          id?: string
          images?: string[] | null
          is_best_seller?: boolean | null
          is_new_arrival?: boolean | null
          name: string
          occasion?: string[] | null
          price: number
          rating?: number | null
          recipient?: string[] | null
          review_count?: number | null
          short_desc?: string | null
          slug: string
          specifications?: Json | null
          stock?: number | null
          story?: string | null
          updated_at?: string
          vibe?: string[] | null
        }
        Update: {
          active?: boolean | null
          artisan_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          description?: string | null
          details?: string[] | null
          id?: string
          images?: string[] | null
          is_best_seller?: boolean | null
          is_new_arrival?: boolean | null
          name?: string
          occasion?: string[] | null
          price?: number
          rating?: number | null
          recipient?: string[] | null
          review_count?: number | null
          short_desc?: string | null
          slug?: string
          specifications?: Json | null
          stock?: number | null
          story?: string | null
          updated_at?: string
          vibe?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_notes: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          points: number | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          points?: number | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          points?: number | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promos: {
        Row: {
          code: string
          created_at: string
          discount: string
          expires_at: string | null
          id: string
          status: string | null
          usage_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount: string
          expires_at?: string | null
          id?: string
          status?: string | null
          usage_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount?: string
          expires_at?: string | null
          id?: string
          status?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_reply: string | null
          comment: string | null
          created_at: string
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          product_id: string
          rating: number
          replied_at: string | null
          status: string | null
          user_email: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          admin_reply?: string | null
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          product_id: string
          rating: number
          replied_at?: string | null
          status?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          admin_reply?: string | null
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          product_id?: string
          rating?: number
          replied_at?: string | null
          status?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          active: boolean | null
          base_price: number | null
          created_at: string
          id: string
          name: string
          surcharge_fixed: number | null
          surcharge_midnight: number | null
        }
        Insert: {
          active?: boolean | null
          base_price?: number | null
          created_at?: string
          id?: string
          name: string
          surcharge_fixed?: number | null
          surcharge_midnight?: number | null
        }
        Update: {
          active?: boolean | null
          base_price?: number | null
          created_at?: string
          id?: string
          name?: string
          surcharge_fixed?: number | null
          surcharge_midnight?: number | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          currency: string | null
          email: string | null
          id: string
          is_maintenance_mode: boolean | null
          settings_json: Json | null
          store_name: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          currency?: string | null
          email?: string | null
          id?: string
          is_maintenance_mode?: boolean | null
          settings_json?: Json | null
          store_name?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          currency?: string | null
          email?: string | null
          id?: string
          is_maintenance_mode?: boolean | null
          settings_json?: Json | null
          store_name?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_occasions: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string
          occasion_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          name: string
          occasion_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string
          occasion_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          email: string | null
          id: string
          message: string
          order_id: string | null
          priority: string | null
          replies: Json | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          id?: string
          message: string
          order_id?: string | null
          priority?: string | null
          replies?: Json | null
          status?: string | null
          subject: string
          ticket_number: string
          updated_at?: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          order_id?: string | null
          priority?: string | null
          replies?: Json | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_returns: {
        Row: {
          created_at: string
          id: string
          order_id: string
          raw_order_id: string | null
          reason: string
          return_number: string
          status: string | null
          updated_at: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          raw_order_id?: string | null
          reason: string
          return_number: string
          status?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          raw_order_id?: string | null
          reason?: string
          return_number?: string
          status?: string | null
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_returns_raw_order_id_fkey"
            columns: ["raw_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
