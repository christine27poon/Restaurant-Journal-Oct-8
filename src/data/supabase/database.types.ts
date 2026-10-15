/**
 * Generated from the Supabase schema (supabase/migrations). Regenerate after schema changes
 * (Supabase CLI: `supabase gen types typescript --project-id <ref>`). Don't edit by hand.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      place_list_items: {
        Row: {
          created_at: string
          id: string
          list_id: string
          place_id: string
          position: number
        }
        Insert: {
          created_at?: string
          id?: string
          list_id: string
          place_id: string
          position?: number
        }
        Update: {
          created_at?: string
          id?: string
          list_id?: string
          place_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: 'place_list_items_list_id_fkey'
            columns: ['list_id']
            isOneToOne: false
            referencedRelation: 'place_lists'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'place_list_items_place_id_fkey'
            columns: ['place_id']
            isOneToOne: false
            referencedRelation: 'places'
            referencedColumns: ['id']
          },
        ]
      }
      place_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          address: string | null
          city: string
          created_at: string
          cuisine: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          neighborhood: string | null
          price_tier: number | null
          source: Database['public']['Enums']['place_source_t']
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string
          created_at?: string
          cuisine?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          neighborhood?: string | null
          price_tier?: number | null
          source?: Database['public']['Enums']['place_source_t']
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          cuisine?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          neighborhood?: string | null
          price_tier?: number | null
          source?: Database['public']['Enums']['place_source_t']
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          display_name: string
          id: string
          last_name: string | null
          preferences: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          display_name: string
          id: string
          last_name?: string | null
          preferences?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          display_name?: string
          id?: string
          last_name?: string | null
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          dish_name: string | null
          feeling: Database['public']['Enums']['feeling_t'] | null
          health_tags: Database['public']['Enums']['health_tag_t'][]
          id: string
          note: string | null
          photo_url: string | null
          place_id: string
          price_tier: number | null
          rating: Database['public']['Enums']['rating_t']
          story: string | null
          updated_at: string
          user_id: string
          visited_at: string
          would_go_back: boolean | null
        }
        Insert: {
          created_at?: string
          dish_name?: string | null
          feeling?: Database['public']['Enums']['feeling_t'] | null
          health_tags?: Database['public']['Enums']['health_tag_t'][]
          id?: string
          note?: string | null
          photo_url?: string | null
          place_id: string
          price_tier?: number | null
          rating: Database['public']['Enums']['rating_t']
          story?: string | null
          updated_at?: string
          user_id?: string
          visited_at?: string
          would_go_back?: boolean | null
        }
        Update: {
          created_at?: string
          dish_name?: string | null
          feeling?: Database['public']['Enums']['feeling_t'] | null
          health_tags?: Database['public']['Enums']['health_tag_t'][]
          id?: string
          note?: string | null
          photo_url?: string | null
          place_id?: string
          price_tier?: number | null
          rating?: Database['public']['Enums']['rating_t']
          story?: string | null
          updated_at?: string
          user_id?: string
          visited_at?: string
          would_go_back?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'visits_place_id_fkey'
            columns: ['place_id']
            isOneToOne: false
            referencedRelation: 'places'
            referencedColumns: ['id']
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          note: string | null
          place_id: string
          status: Database['public']['Enums']['wishlist_status_t']
          user_id: string
          visited_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          place_id: string
          status?: Database['public']['Enums']['wishlist_status_t']
          user_id?: string
          visited_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          place_id?: string
          status?: Database['public']['Enums']['wishlist_status_t']
          user_id?: string
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'wishlist_items_place_id_fkey'
            columns: ['place_id']
            isOneToOne: false
            referencedRelation: 'places'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      seed_sample_journal: { Args: never; Returns: undefined }
    }
    Enums: {
      feeling_t: 'energized' | 'satisfied' | 'comfortable' | 'sleepy' | 'still_hungry'
      health_tag_t:
        'light' | 'veggie_forward' | 'protein_rich' | 'fresh' | 'comforting' | 'indulgent'
      place_source_t: 'seed' | 'custom'
      rating_t: 'loved' | 'fine' | 'not_for_me'
      wishlist_status_t: 'want' | 'visited'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
