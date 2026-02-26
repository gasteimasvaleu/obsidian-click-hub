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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bible_books: {
        Row: {
          abbrev: string
          book_order: number
          category: string
          chapters_count: number
          created_at: string | null
          id: string
          name: string
          testament: string
        }
        Insert: {
          abbrev: string
          book_order: number
          category: string
          chapters_count: number
          created_at?: string | null
          id?: string
          name: string
          testament: string
        }
        Update: {
          abbrev?: string
          book_order?: number
          category?: string
          chapters_count?: number
          created_at?: string | null
          id?: string
          name?: string
          testament?: string
        }
        Relationships: []
      }
      bible_chapters: {
        Row: {
          book_id: string
          chapter_number: number
          created_at: string | null
          id: string
          verses_count: number
        }
        Insert: {
          book_id: string
          chapter_number: number
          created_at?: string | null
          id?: string
          verses_count: number
        }
        Update: {
          book_id?: string
          chapter_number?: number
          created_at?: string | null
          id?: string
          verses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verses: {
        Row: {
          chapter_id: string
          created_at: string | null
          id: string
          text: string
          theological_comment: string | null
          verse_number: number
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          id?: string
          text: string
          theological_comment?: string | null
          verse_number: number
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          id?: string
          text?: string
          theological_comment?: string | null
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      coloring_drawings: {
        Row: {
          available: boolean
          category: string
          created_at: string
          description: string | null
          difficulty: string
          display_order: number
          id: string
          image_url: string
          title: string
        }
        Insert: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          display_order?: number
          id?: string
          image_url: string
          title: string
        }
        Update: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          display_order?: number
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
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
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          available: boolean | null
          banner_desktop: string | null
          banner_mobile: string | null
          course_id: string
          created_at: string
          description: string
          display_order: number
          id: string
          thumbnail: string | null
          title: string
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          banner_desktop?: string | null
          banner_mobile?: string | null
          course_id: string
          created_at?: string
          description: string
          display_order?: number
          id?: string
          thumbnail?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          banner_desktop?: string | null
          banner_mobile?: string | null
          course_id?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          thumbnail?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          available: boolean | null
          banner_desktop: string | null
          banner_mobile: string | null
          created_at: string
          description: string
          display_order: number
          id: string
          page_image_desktop: string | null
          page_image_mobile: string | null
          thumbnail: string | null
          title: string
          updated_at: string
          use_video: boolean | null
          video_desktop: string | null
          video_mobile: string | null
        }
        Insert: {
          available?: boolean | null
          banner_desktop?: string | null
          banner_mobile?: string | null
          created_at?: string
          description: string
          display_order?: number
          id?: string
          page_image_desktop?: string | null
          page_image_mobile?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string
          use_video?: boolean | null
          video_desktop?: string | null
          video_mobile?: string | null
        }
        Update: {
          available?: boolean | null
          banner_desktop?: string | null
          banner_mobile?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          page_image_desktop?: string | null
          page_image_mobile?: string | null
          thumbnail?: string | null
          title?: string
          updated_at?: string
          use_video?: boolean | null
          video_desktop?: string | null
          video_mobile?: string | null
        }
        Relationships: []
      }
      daily_devotionals: {
        Row: {
          available: boolean | null
          book_name: string
          chapter: number
          created_at: string | null
          devotional_date: string
          id: string
          introduction: string
          practical_applications: string
          prayer: string
          question: string
          reflection: string
          theme: string
          title: string
          updated_at: string | null
          verse_end: number | null
          verse_start: number
          verse_text: string
        }
        Insert: {
          available?: boolean | null
          book_name: string
          chapter: number
          created_at?: string | null
          devotional_date: string
          id?: string
          introduction: string
          practical_applications: string
          prayer: string
          question: string
          reflection: string
          theme: string
          title: string
          updated_at?: string | null
          verse_end?: number | null
          verse_start: number
          verse_text: string
        }
        Update: {
          available?: boolean | null
          book_name?: string
          chapter?: number
          created_at?: string | null
          devotional_date?: string
          id?: string
          introduction?: string
          practical_applications?: string
          prayer?: string
          question?: string
          reflection?: string
          theme?: string
          title?: string
          updated_at?: string | null
          verse_end?: number | null
          verse_start?: number
          verse_text?: string
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          available: boolean | null
          content_type: string
          created_at: string | null
          description: string
          duration: number | null
          file_url: string | null
          format: string | null
          id: string
          pages: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          available?: boolean | null
          content_type?: string
          created_at?: string | null
          description: string
          duration?: number | null
          file_url?: string | null
          format?: string | null
          id?: string
          pages?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          available?: boolean | null
          content_type?: string
          created_at?: string | null
          description?: string
          duration?: number | null
          file_url?: string | null
          format?: string | null
          id?: string
          pages?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          available: boolean | null
          color: string
          content_json: Json
          created_at: string | null
          description: string
          difficulty: string
          icon_name: string
          id: string
          title: string
          type: Database["public"]["Enums"]["game_type"]
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          color: string
          content_json: Json
          created_at?: string | null
          description: string
          difficulty: string
          icon_name: string
          id?: string
          title: string
          type: Database["public"]["Enums"]["game_type"]
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          color?: string
          content_json?: Json
          created_at?: string | null
          description?: string
          difficulty?: string
          icon_name?: string
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["game_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      home_highlights: {
        Row: {
          available: boolean
          created_at: string
          display_order: number
          id: string
          image_url: string
          link_to: string | null
          title: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          link_to?: string | null
          title?: string
        }
        Update: {
          available?: boolean
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          link_to?: string | null
          title?: string
        }
        Relationships: []
      }
      lesson_materials: {
        Row: {
          created_at: string
          display_order: number
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          lesson_id: string
          title: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          lesson_id: string
          title: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          lesson_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      module_lessons: {
        Row: {
          available: boolean | null
          created_at: string
          description: string
          display_order: number
          duration: number | null
          external_content_url: string | null
          id: string
          module_id: string
          thumbnail: string | null
          title: string
          updated_at: string
          video_source: string | null
          video_url: string | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          description: string
          display_order?: number
          duration?: number | null
          external_content_url?: string | null
          id?: string
          module_id: string
          thumbnail?: string | null
          title: string
          updated_at?: string
          video_source?: string | null
          video_url?: string | null
        }
        Update: {
          available?: boolean | null
          created_at?: string
          description?: string
          display_order?: number
          duration?: number | null
          external_content_url?: string | null
          id?: string
          module_id?: string
          thumbnail?: string | null
          title?: string
          updated_at?: string
          video_source?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_carousels: {
        Row: {
          available: boolean | null
          course_id: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          course_id: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          course_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_carousels_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      prayers: {
        Row: {
          available: boolean | null
          category: string
          content: string
          created_at: string | null
          display_order: number
          icon_name: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category: string
          content: string
          created_at?: string | null
          display_order?: number
          icon_name?: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string
          content?: string
          created_at?: string | null
          display_order?: number
          icon_name?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      story_thumbnails: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          hotmart_offer_id: string | null
          hotmart_product_id: string | null
          hotmart_transaction_id: string | null
          id: string
          phone: string | null
          signup_token: string | null
          signup_token_expires_at: string | null
          subscription_expires_at: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
          user_id: string | null
          whatsapp_optin: boolean | null
          whatsapp_optin_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          hotmart_offer_id?: string | null
          hotmart_product_id?: string | null
          hotmart_transaction_id?: string | null
          id?: string
          phone?: string | null
          signup_token?: string | null
          signup_token_expires_at?: string | null
          subscription_expires_at?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string | null
          whatsapp_optin?: boolean | null
          whatsapp_optin_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          hotmart_offer_id?: string | null
          hotmart_product_id?: string | null
          hotmart_transaction_id?: string | null
          id?: string
          phone?: string | null
          signup_token?: string | null
          signup_token_expires_at?: string | null
          subscription_expires_at?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string | null
          whatsapp_optin?: boolean | null
          whatsapp_optin_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          audio_url: string | null
          created_at: string
          email: string
          id: string
          image_url: string | null
          name: string
          rating: number
          testimonial: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          audio_url?: string | null
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          name: string
          rating: number
          testimonial: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          audio_url?: string | null
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          rating?: number
          testimonial?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_id: string | null
          activity_title: string | null
          activity_type: string
          completed_at: string
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          activity_title?: string | null
          activity_type: string
          completed_at?: string
          id?: string
          points_earned?: number
          user_id: string
        }
        Update: {
          activity_id?: string | null
          activity_title?: string | null
          activity_type?: string
          completed_at?: string
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_type: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_coloring_creations: {
        Row: {
          colored_image_url: string
          created_at: string
          drawing_id: string | null
          id: string
          is_from_photo: boolean
          original_image_url: string
          title: string
          user_id: string
        }
        Insert: {
          colored_image_url: string
          created_at?: string
          drawing_id?: string | null
          id?: string
          is_from_photo?: boolean
          original_image_url: string
          title?: string
          user_id: string
        }
        Update: {
          colored_image_url?: string
          created_at?: string
          drawing_id?: string | null
          id?: string
          is_from_photo?: boolean
          original_image_url?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coloring_creations_drawing_id_fkey"
            columns: ["drawing_id"]
            isOneToOne: false
            referencedRelation: "coloring_drawings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coloring_creations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devotional_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          devotional_id: string
          id: string
          marked_as_read: boolean | null
          updated_at: string | null
          user_id: string
          user_notes: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          devotional_id: string
          id?: string
          marked_as_read?: boolean | null
          updated_at?: string | null
          user_id: string
          user_notes?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          devotional_id?: string
          id?: string
          marked_as_read?: boolean | null
          updated_at?: string | null
          user_id?: string
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_devotional_progress_devotional_id_fkey"
            columns: ["devotional_id"]
            isOneToOne: false
            referencedRelation: "daily_devotionals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_prayers: {
        Row: {
          created_at: string | null
          id: string
          prayer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prayer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prayer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_prayers_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_verses: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          verse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_verses_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          bible_chapters_read: number | null
          coloring_completed: number
          created_at: string
          devotionals_completed: number | null
          ebooks_read: number
          favorite_verses_count: number | null
          games_completed: number
          id: string
          last_activity_date: string | null
          level: number
          streak_days: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bible_chapters_read?: number | null
          coloring_completed?: number
          created_at?: string
          devotionals_completed?: number | null
          ebooks_read?: number
          favorite_verses_count?: number | null
          games_completed?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bible_chapters_read?: number | null
          coloring_completed?: number
          created_at?: string
          devotionals_completed?: number | null
          ebooks_read?: number
          favorite_verses_count?: number | null
          games_completed?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_history: {
        Row: {
          chapter_id: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          chapter_id: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_history_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_verse_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string
          updated_at: string | null
          user_id: string
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note: string
          updated_at?: string | null
          user_id: string
          verse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string
          updated_at?: string | null
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_verse_notes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_verse: {
        Args: never
        Returns: {
          book_name: string
          chapter: number
          text: string
          verse_number: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      game_type: "quiz" | "memory" | "wordsearch" | "puzzle"
      subscription_status: "pending" | "active" | "cancelled" | "expired"
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
      game_type: ["quiz", "memory", "wordsearch", "puzzle"],
      subscription_status: ["pending", "active", "cancelled", "expired"],
    },
  },
} as const
