// Generado con el conector de Supabase (generate_typescript_types).
// Regenerar cuando cambie el schema.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      books: {
        Row: {
          author: string;
          created_at: string;
          genre: string;
          id: string;
          note: string | null;
          progress_percent: number | null;
          rating: number | null;
          status: string;
          title: string;
        };
        Insert: {
          author: string;
          created_at?: string;
          genre: string;
          id?: string;
          note?: string | null;
          progress_percent?: number | null;
          rating?: number | null;
          status: string;
          title: string;
        };
        Update: {
          author?: string;
          created_at?: string;
          genre?: string;
          id?: string;
          note?: string | null;
          progress_percent?: number | null;
          rating?: number | null;
          status?: string;
          title?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          body_markdown: string;
          category: string;
          created_at: string;
          id: string;
          minutes: number;
          published: boolean;
          published_at: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          body_markdown?: string;
          category: string;
          created_at?: string;
          id?: string;
          minutes?: number;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          body_markdown?: string;
          category?: string;
          created_at?: string;
          id?: string;
          minutes?: number;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      now_status: {
        Row: {
          headline: string;
          id: number;
          ticker_items: string[];
          updated_at: string;
          week_summary: string;
        };
        Insert: {
          headline: string;
          id?: number;
          ticker_items?: string[];
          updated_at?: string;
          week_summary: string;
        };
        Update: {
          headline?: string;
          id?: number;
          ticker_items?: string[];
          updated_at?: string;
          week_summary?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          code: string;
          created_at: string;
          description: string;
          id: string;
          sort_order: number;
          stack: string;
          status: string;
          title: string;
          url: string | null;
          year_label: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description: string;
          id?: string;
          sort_order?: number;
          stack: string;
          status: string;
          title: string;
          url?: string | null;
          year_label: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string;
          id?: string;
          sort_order?: number;
          stack?: string;
          status?: string;
          title?: string;
          url?: string | null;
          year_label?: string;
        };
        Relationships: [];
      };
      training_logs: {
        Row: {
          created_at: string;
          description: string;
          distance_km: number | null;
          duration: string | null;
          id: string;
          kind: string;
          logged_on: string;
          upcoming: boolean;
        };
        Insert: {
          created_at?: string;
          description: string;
          distance_km?: number | null;
          duration?: string | null;
          id?: string;
          kind: string;
          logged_on: string;
          upcoming?: boolean;
        };
        Update: {
          created_at?: string;
          description?: string;
          distance_km?: number | null;
          duration?: string | null;
          id?: string;
          kind?: string;
          logged_on?: string;
          upcoming?: boolean;
        };
        Relationships: [];
      };
      uses_items: {
        Row: {
          category: string;
          id: string;
          name: string;
          sort_order: number;
          tag: string;
        };
        Insert: {
          category: string;
          id?: string;
          name: string;
          sort_order?: number;
          tag: string;
        };
        Update: {
          category?: string;
          id?: string;
          name?: string;
          sort_order?: number;
          tag?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
