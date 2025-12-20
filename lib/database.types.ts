// Database types for Creative Kids Music
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workshops: {
        Row: {
          id: string
          title: string
          date: string
          start_time: string
          end_time: string
          location: string
          address: string
          description: string | null
          capacity: number
          price_cents: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          start_time?: string
          end_time?: string
          location?: string
          address?: string
          description?: string | null
          capacity?: number
          price_cents?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          address?: string
          description?: string | null
          capacity?: number
          price_cents?: number
          is_active?: boolean
          created_at?: string
        }
      }
      workshop_registrations: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          status: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
          waitlist_position: number | null
          parent_name: string
          parent_email: string
          parent_phone: string | null
          workshop_ids: string[]
          payment_status: 'unpaid' | 'paid' | 'partial' | 'waived'
          payment_method: string | null
          tuition_assistance: boolean
          assistance_notes: string | null
          total_amount_cents: number | null
          amount_paid_cents: number
          payment_date: string | null
          payment_notes: string | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          email_unsubscribed: boolean
          how_heard: string | null
          excited_about: string | null
          message: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
          waitlist_position?: number | null
          parent_name: string
          parent_email: string
          parent_phone?: string | null
          workshop_ids: string[]
          payment_status?: 'unpaid' | 'paid' | 'partial' | 'waived'
          payment_method?: string | null
          tuition_assistance?: boolean
          assistance_notes?: string | null
          total_amount_cents?: number | null
          amount_paid_cents?: number
          payment_date?: string | null
          payment_notes?: string | null
          terms_accepted: boolean
          terms_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
          waitlist_position?: number | null
          parent_name?: string
          parent_email?: string
          parent_phone?: string | null
          workshop_ids?: string[]
          payment_status?: 'unpaid' | 'paid' | 'partial' | 'waived'
          payment_method?: string | null
          tuition_assistance?: boolean
          assistance_notes?: string | null
          total_amount_cents?: number | null
          amount_paid_cents?: number
          payment_date?: string | null
          payment_notes?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
        }
      }
      workshop_children: {
        Row: {
          id: string
          registration_id: string
          child_name: string
          child_age: number
          child_school: string | null
          discount_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          child_name: string
          child_age: number
          child_school?: string | null
          discount_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          child_name?: string
          child_age?: number
          child_school?: string | null
          discount_cents?: number
          created_at?: string
        }
      }
      camp_registrations: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          parent_name: string
          parent_email: string
          parent_phone: string
          emergency_name: string
          emergency_phone: string
          emergency_relationship: string | null
          payment_status: 'unpaid' | 'paid' | 'partial' | 'waived'
          payment_method: string | null
          tuition_assistance: boolean
          assistance_notes: string | null
          total_amount_cents: number | null
          amount_paid_cents: number
          payment_date: string | null
          payment_notes: string | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          email_unsubscribed: boolean
          how_heard: string | null
          excited_about: string | null
          message: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          parent_name: string
          parent_email: string
          parent_phone: string
          emergency_name: string
          emergency_phone: string
          emergency_relationship?: string | null
          payment_status?: 'unpaid' | 'paid' | 'partial' | 'waived'
          payment_method?: string | null
          tuition_assistance?: boolean
          assistance_notes?: string | null
          total_amount_cents?: number | null
          amount_paid_cents?: number
          payment_date?: string | null
          payment_notes?: string | null
          terms_accepted: boolean
          terms_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled'
          parent_name?: string
          parent_email?: string
          parent_phone?: string
          emergency_name?: string
          emergency_phone?: string
          emergency_relationship?: string | null
          payment_status?: 'unpaid' | 'paid' | 'partial' | 'waived'
          payment_method?: string | null
          tuition_assistance?: boolean
          assistance_notes?: string | null
          total_amount_cents?: number | null
          amount_paid_cents?: number
          payment_date?: string | null
          payment_notes?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
        }
      }
      camp_children: {
        Row: {
          id: string
          registration_id: string
          child_name: string
          child_age: number
          child_grade: string | null
          child_school: string | null
          allergies: string | null
          medical_conditions: string | null
          special_needs: string | null
          discount_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          child_name: string
          child_age: number
          child_grade?: string | null
          child_school?: string | null
          allergies?: string | null
          medical_conditions?: string | null
          special_needs?: string | null
          discount_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          child_name?: string
          child_age?: number
          child_grade?: string | null
          child_school?: string | null
          allergies?: string | null
          medical_conditions?: string | null
          special_needs?: string | null
          discount_cents?: number
          created_at?: string
        }
      }
      waitlist_signups: {
        Row: {
          id: string
          created_at: string
          status: 'new' | 'contacted' | 'converted'
          parent_name: string
          parent_email: string
          child_name: string | null
          child_grade: string | null
          child_school: string | null
          num_children: number
          message: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          status?: 'new' | 'contacted' | 'converted'
          parent_name: string
          parent_email: string
          child_name?: string | null
          child_grade?: string | null
          child_school?: string | null
          num_children?: number
          message?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          status?: 'new' | 'contacted' | 'converted'
          parent_name?: string
          parent_email?: string
          child_name?: string | null
          child_grade?: string | null
          child_school?: string | null
          num_children?: number
          message?: string | null
          admin_notes?: string | null
        }
      }
      email_log: {
        Row: {
          id: string
          created_at: string
          recipient_email: string
          email_type: string
          subject: string | null
          entity_type: string | null
          entity_id: string | null
          status: 'sent' | 'failed' | 'bounced'
          provider_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          recipient_email: string
          email_type: string
          subject?: string | null
          entity_type?: string | null
          entity_id?: string | null
          status?: 'sent' | 'failed' | 'bounced'
          provider_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          recipient_email?: string
          email_type?: string
          subject?: string | null
          entity_type?: string | null
          entity_id?: string | null
          status?: 'sent' | 'failed' | 'bounced'
          provider_id?: string | null
        }
      }
      activity_log: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          user_email: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          user_email?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          user_email?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
        }
      }
      magic_links: {
        Row: {
          id: string
          email: string
          token: string
          expires_at: string
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          token: string
          expires_at: string
          used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          token?: string
          expires_at?: string
          used_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_workshop_spots_remaining: {
        Args: { workshop_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Workshop = Database['public']['Tables']['workshops']['Row']
export type WorkshopInsert = Database['public']['Tables']['workshops']['Insert']
export type WorkshopUpdate = Database['public']['Tables']['workshops']['Update']

export type WorkshopRegistration = Database['public']['Tables']['workshop_registrations']['Row']
export type WorkshopRegistrationInsert = Database['public']['Tables']['workshop_registrations']['Insert']
export type WorkshopRegistrationUpdate = Database['public']['Tables']['workshop_registrations']['Update']

export type WorkshopChild = Database['public']['Tables']['workshop_children']['Row']
export type WorkshopChildInsert = Database['public']['Tables']['workshop_children']['Insert']
export type WorkshopChildUpdate = Database['public']['Tables']['workshop_children']['Update']

export type CampRegistration = Database['public']['Tables']['camp_registrations']['Row']
export type CampRegistrationInsert = Database['public']['Tables']['camp_registrations']['Insert']
export type CampRegistrationUpdate = Database['public']['Tables']['camp_registrations']['Update']

export type CampChild = Database['public']['Tables']['camp_children']['Row']
export type CampChildInsert = Database['public']['Tables']['camp_children']['Insert']
export type CampChildUpdate = Database['public']['Tables']['camp_children']['Update']

export type WaitlistSignup = Database['public']['Tables']['waitlist_signups']['Row']
export type WaitlistSignupInsert = Database['public']['Tables']['waitlist_signups']['Insert']
export type WaitlistSignupUpdate = Database['public']['Tables']['waitlist_signups']['Update']

export type EmailLog = Database['public']['Tables']['email_log']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
export type MagicLink = Database['public']['Tables']['magic_links']['Row']

// Registration with children (joined)
export type WorkshopRegistrationWithChildren = WorkshopRegistration & {
  children: WorkshopChild[]
}

export type CampRegistrationWithChildren = CampRegistration & {
  children: CampChild[]
}
