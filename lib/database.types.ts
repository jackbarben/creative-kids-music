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
          status: 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'archived'
          waitlist_position: number | null
          user_id: string | null
          parent_name: string
          parent_email: string
          parent_phone: string | null
          parent_first_name: string | null
          parent_last_name: string | null
          parent_relationship: string | null
          emergency_name: string | null
          emergency_phone: string | null
          emergency_relationship: string | null
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
          liability_waiver_accepted: boolean
          liability_waiver_accepted_at: string | null
          media_consent_internal: boolean
          media_consent_marketing: boolean
          media_consent_accepted_at: string | null
          email_unsubscribed: boolean
          how_heard: string | null
          excited_about: string | null
          message: string | null
          admin_notes: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          archived_at: string | null
          archived_by: string | null
          archive_reason: string | null
          version: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'archived'
          waitlist_position?: number | null
          user_id?: string | null
          parent_name: string
          parent_email: string
          parent_phone?: string | null
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_relationship?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
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
          liability_waiver_accepted?: boolean
          liability_waiver_accepted_at?: string | null
          media_consent_internal?: boolean
          media_consent_marketing?: boolean
          media_consent_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          archived_at?: string | null
          archived_by?: string | null
          archive_reason?: string | null
          version?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'archived'
          waitlist_position?: number | null
          user_id?: string | null
          parent_name?: string
          parent_email?: string
          parent_phone?: string | null
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_relationship?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
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
          liability_waiver_accepted?: boolean
          liability_waiver_accepted_at?: string | null
          media_consent_internal?: boolean
          media_consent_marketing?: boolean
          media_consent_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          archived_at?: string | null
          archived_by?: string | null
          archive_reason?: string | null
          version?: number
        }
      }
      workshop_children: {
        Row: {
          id: string
          registration_id: string
          account_child_id: string | null
          child_name: string
          first_name: string | null
          last_name: string | null
          child_age: number
          child_school: string | null
          allergies: string | null
          dietary_restrictions: string | null
          medical_conditions: string | null
          discount_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          account_child_id?: string | null
          child_name: string
          first_name?: string | null
          last_name?: string | null
          child_age: number
          child_school?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          discount_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          account_child_id?: string | null
          child_name?: string
          first_name?: string | null
          last_name?: string | null
          child_age?: number
          child_school?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          discount_cents?: number
          created_at?: string
        }
      }
      camp_registrations: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'archived'
          user_id: string | null
          parent_name: string
          parent_email: string
          parent_phone: string
          parent_first_name: string | null
          parent_last_name: string | null
          parent_relationship: string | null
          parent2_first_name: string | null
          parent2_last_name: string | null
          parent2_relationship: string | null
          parent2_phone: string | null
          parent2_email: string | null
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
          liability_waiver_accepted: boolean
          liability_waiver_accepted_at: string | null
          behavior_agreement_accepted: boolean
          behavior_agreement_accepted_at: string | null
          media_consent_internal: boolean
          media_consent_marketing: boolean
          media_consent_accepted_at: string | null
          email_unsubscribed: boolean
          how_heard: string | null
          excited_about: string | null
          message: string | null
          admin_notes: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          archived_at: string | null
          archived_by: string | null
          archive_reason: string | null
          version: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'archived'
          user_id?: string | null
          parent_name: string
          parent_email: string
          parent_phone: string
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_relationship?: string | null
          parent2_first_name?: string | null
          parent2_last_name?: string | null
          parent2_relationship?: string | null
          parent2_phone?: string | null
          parent2_email?: string | null
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
          liability_waiver_accepted?: boolean
          liability_waiver_accepted_at?: string | null
          behavior_agreement_accepted?: boolean
          behavior_agreement_accepted_at?: string | null
          media_consent_internal?: boolean
          media_consent_marketing?: boolean
          media_consent_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          archived_at?: string | null
          archived_by?: string | null
          archive_reason?: string | null
          version?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'archived'
          user_id?: string | null
          parent_name?: string
          parent_email?: string
          parent_phone?: string
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_relationship?: string | null
          parent2_first_name?: string | null
          parent2_last_name?: string | null
          parent2_relationship?: string | null
          parent2_phone?: string | null
          parent2_email?: string | null
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
          liability_waiver_accepted?: boolean
          liability_waiver_accepted_at?: string | null
          behavior_agreement_accepted?: boolean
          behavior_agreement_accepted_at?: string | null
          media_consent_internal?: boolean
          media_consent_marketing?: boolean
          media_consent_accepted_at?: string | null
          email_unsubscribed?: boolean
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          archived_at?: string | null
          archived_by?: string | null
          archive_reason?: string | null
          version?: number
        }
      }
      camp_children: {
        Row: {
          id: string
          registration_id: string
          account_child_id: string | null
          child_name: string
          first_name: string | null
          last_name: string | null
          child_age: number
          child_grade: string | null
          child_school: string | null
          tshirt_size: string | null
          allergies: string | null
          dietary_restrictions: string | null
          medical_conditions: string | null
          special_needs: string | null
          discount_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          account_child_id?: string | null
          child_name: string
          first_name?: string | null
          last_name?: string | null
          child_age: number
          child_grade?: string | null
          child_school?: string | null
          tshirt_size?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          special_needs?: string | null
          discount_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          account_child_id?: string | null
          child_name?: string
          first_name?: string | null
          last_name?: string | null
          child_age?: number
          child_grade?: string | null
          child_school?: string | null
          tshirt_size?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          special_needs?: string | null
          discount_cents?: number
          created_at?: string
        }
      }
      authorized_pickups: {
        Row: {
          id: string
          camp_registration_id: string
          name: string
          phone: string | null
          relationship: string | null
          created_at: string
        }
        Insert: {
          id?: string
          camp_registration_id: string
          name: string
          phone?: string | null
          relationship?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          camp_registration_id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
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
      account_children: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          school: string | null
          allergies: string | null
          dietary_restrictions: string | null
          medical_conditions: string | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          school?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          school?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      account_settings: {
        Row: {
          id: string
          user_id: string
          parent_first_name: string | null
          parent_last_name: string | null
          parent_relationship: string | null
          parent_phone: string | null
          parent2_first_name: string | null
          parent2_last_name: string | null
          parent2_relationship: string | null
          parent2_phone: string | null
          parent2_email: string | null
          emergency_name: string | null
          emergency_phone: string | null
          emergency_relationship: string | null
          default_pickups: Json | null
          default_media_consent_internal: boolean | null
          default_media_consent_marketing: boolean | null
          email_reminders: boolean
          email_updates: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_relationship?: string | null
          parent_phone?: string | null
          parent2_first_name?: string | null
          parent2_last_name?: string | null
          parent2_relationship?: string | null
          parent2_phone?: string | null
          parent2_email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          default_pickups?: Json | null
          default_media_consent_internal?: boolean | null
          default_media_consent_marketing?: boolean | null
          email_reminders?: boolean
          email_updates?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_relationship?: string | null
          parent_phone?: string | null
          parent2_first_name?: string | null
          parent2_last_name?: string | null
          parent2_relationship?: string | null
          parent2_phone?: string | null
          parent2_email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          default_pickups?: Json | null
          default_media_consent_internal?: boolean | null
          default_media_consent_marketing?: boolean | null
          email_reminders?: boolean
          email_updates?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      workshop_authorized_pickups: {
        Row: {
          id: string
          registration_id: string
          name: string
          phone: string | null
          relationship: string | null
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          name: string
          phone?: string | null
          relationship?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
          created_at?: string
        }
      }
      // ============================================
      // UNIFIED PROGRAM TABLES (Migration 007)
      // ============================================
      programs: {
        Row: {
          id: string
          slug: string
          program_type: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          schedule_json: Json | null
          location: string | null
          address: string | null
          base_price_cents: number
          sibling_discount_cents: number
          max_sibling_discount_cents: number
          capacity: number | null
          waitlist_enabled: boolean
          registration_opens_at: string | null
          registration_closes_at: string | null
          requires_emergency_contact: boolean
          requires_authorized_pickups: boolean
          max_authorized_pickups: number
          requires_medical_info: boolean
          requires_second_parent: boolean
          requires_behavior_agreement: boolean
          requires_tshirt_size: boolean
          requires_grade: boolean
          includes_json: Json | null
          accent_color: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          program_type: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          schedule_json?: Json | null
          location?: string | null
          address?: string | null
          base_price_cents?: number
          sibling_discount_cents?: number
          max_sibling_discount_cents?: number
          capacity?: number | null
          waitlist_enabled?: boolean
          registration_opens_at?: string | null
          registration_closes_at?: string | null
          requires_emergency_contact?: boolean
          requires_authorized_pickups?: boolean
          max_authorized_pickups?: number
          requires_medical_info?: boolean
          requires_second_parent?: boolean
          requires_behavior_agreement?: boolean
          requires_tshirt_size?: boolean
          requires_grade?: boolean
          includes_json?: Json | null
          accent_color?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          program_type?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          schedule_json?: Json | null
          location?: string | null
          address?: string | null
          base_price_cents?: number
          sibling_discount_cents?: number
          max_sibling_discount_cents?: number
          capacity?: number | null
          waitlist_enabled?: boolean
          registration_opens_at?: string | null
          registration_closes_at?: string | null
          requires_emergency_contact?: boolean
          requires_authorized_pickups?: boolean
          max_authorized_pickups?: number
          requires_medical_info?: boolean
          requires_second_parent?: boolean
          requires_behavior_agreement?: boolean
          requires_tshirt_size?: boolean
          requires_grade?: boolean
          includes_json?: Json | null
          accent_color?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      program_sessions: {
        Row: {
          id: string
          program_id: string
          session_date: string
          start_time: string | null
          end_time: string | null
          title: string | null
          capacity: number | null
          created_at: string
        }
        Insert: {
          id?: string
          program_id: string
          session_date: string
          start_time?: string | null
          end_time?: string | null
          title?: string | null
          capacity?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          session_date?: string
          start_time?: string | null
          end_time?: string | null
          title?: string | null
          capacity?: number | null
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          program_id: string
          user_id: string | null
          legacy_registration_id: string | null
          legacy_type: string | null
          status: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
          waitlist_position: number | null
          parent_name: string
          parent_first_name: string | null
          parent_last_name: string | null
          parent_email: string
          parent_phone: string | null
          parent_relationship: string | null
          parent2_first_name: string | null
          parent2_last_name: string | null
          parent2_phone: string | null
          parent2_email: string | null
          parent2_relationship: string | null
          emergency_name: string | null
          emergency_phone: string | null
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
          liability_waiver_accepted: boolean
          liability_waiver_accepted_at: string | null
          behavior_agreement_accepted: boolean
          behavior_agreement_accepted_at: string | null
          media_consent_internal: boolean
          media_consent_marketing: boolean
          media_consent_accepted_at: string | null
          how_heard: string | null
          excited_about: string | null
          message: string | null
          admin_notes: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          email_unsubscribed: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          user_id?: string | null
          legacy_registration_id?: string | null
          legacy_type?: string | null
          status?: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
          waitlist_position?: number | null
          parent_name: string
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_email: string
          parent_phone?: string | null
          parent_relationship?: string | null
          parent2_first_name?: string | null
          parent2_last_name?: string | null
          parent2_phone?: string | null
          parent2_email?: string | null
          parent2_relationship?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
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
          liability_waiver_accepted?: boolean
          liability_waiver_accepted_at?: string | null
          behavior_agreement_accepted?: boolean
          behavior_agreement_accepted_at?: string | null
          media_consent_internal?: boolean
          media_consent_marketing?: boolean
          media_consent_accepted_at?: string | null
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          email_unsubscribed?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          user_id?: string | null
          legacy_registration_id?: string | null
          legacy_type?: string | null
          status?: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
          waitlist_position?: number | null
          parent_name?: string
          parent_first_name?: string | null
          parent_last_name?: string | null
          parent_email?: string
          parent_phone?: string | null
          parent_relationship?: string | null
          parent2_first_name?: string | null
          parent2_last_name?: string | null
          parent2_phone?: string | null
          parent2_email?: string | null
          parent2_relationship?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
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
          liability_waiver_accepted?: boolean
          liability_waiver_accepted_at?: string | null
          behavior_agreement_accepted?: boolean
          behavior_agreement_accepted_at?: string | null
          media_consent_internal?: boolean
          media_consent_marketing?: boolean
          media_consent_accepted_at?: string | null
          how_heard?: string | null
          excited_about?: string | null
          message?: string | null
          admin_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          email_unsubscribed?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      registration_sessions: {
        Row: {
          id: string
          registration_id: string
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          session_id?: string
          created_at?: string
        }
      }
      registration_children: {
        Row: {
          id: string
          registration_id: string
          account_child_id: string | null
          child_name: string
          first_name: string | null
          last_name: string | null
          child_age: number
          child_grade: string | null
          child_school: string | null
          tshirt_size: string | null
          allergies: string | null
          dietary_restrictions: string | null
          medical_conditions: string | null
          special_needs: string | null
          notes: string | null
          discount_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          account_child_id?: string | null
          child_name: string
          first_name?: string | null
          last_name?: string | null
          child_age: number
          child_grade?: string | null
          child_school?: string | null
          tshirt_size?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          special_needs?: string | null
          notes?: string | null
          discount_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          account_child_id?: string | null
          child_name?: string
          first_name?: string | null
          last_name?: string | null
          child_age?: number
          child_grade?: string | null
          child_school?: string | null
          tshirt_size?: string | null
          allergies?: string | null
          dietary_restrictions?: string | null
          medical_conditions?: string | null
          special_needs?: string | null
          notes?: string | null
          discount_cents?: number
          created_at?: string
        }
      }
      registration_pickups: {
        Row: {
          id: string
          registration_id: string
          name: string
          phone: string | null
          relationship: string | null
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          name: string
          phone?: string | null
          relationship?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
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
      get_all_children_for_parent: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          registration_id: string
          program_type: string
          child_name: string
          created_at: string
        }[]
      }
      recalculate_registration_total: {
        Args: {
          p_registration_id: string
          p_program_type: string
          p_user_id: string
        }
        Returns: number
      }
      is_registration_owner: {
        Args: { reg_user_id: string }
        Returns: boolean
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

export type AuthorizedPickup = Database['public']['Tables']['authorized_pickups']['Row']
export type AuthorizedPickupInsert = Database['public']['Tables']['authorized_pickups']['Insert']

export type WorkshopAuthorizedPickup = Database['public']['Tables']['workshop_authorized_pickups']['Row']
export type WorkshopAuthorizedPickupInsert = Database['public']['Tables']['workshop_authorized_pickups']['Insert']

export type AccountChild = Database['public']['Tables']['account_children']['Row']
export type AccountChildInsert = Database['public']['Tables']['account_children']['Insert']
export type AccountChildUpdate = Database['public']['Tables']['account_children']['Update']

export type AccountSettings = Database['public']['Tables']['account_settings']['Row']
export type AccountSettingsInsert = Database['public']['Tables']['account_settings']['Insert']
export type AccountSettingsUpdate = Database['public']['Tables']['account_settings']['Update']

// Registration with children (joined)
export type WorkshopRegistrationWithChildren = WorkshopRegistration & {
  children: WorkshopChild[]
  authorized_pickups?: WorkshopAuthorizedPickup[]
}

export type CampRegistrationWithChildren = CampRegistration & {
  children: CampChild[]
  authorized_pickups?: AuthorizedPickup[]
}

// ============================================
// UNIFIED PROGRAM TYPES (Migration 007)
// ============================================

export type Program = Database['public']['Tables']['programs']['Row']
export type ProgramInsert = Database['public']['Tables']['programs']['Insert']
export type ProgramUpdate = Database['public']['Tables']['programs']['Update']

export type ProgramSession = Database['public']['Tables']['program_sessions']['Row']
export type ProgramSessionInsert = Database['public']['Tables']['program_sessions']['Insert']
export type ProgramSessionUpdate = Database['public']['Tables']['program_sessions']['Update']

export type Registration = Database['public']['Tables']['registrations']['Row']
export type RegistrationInsert = Database['public']['Tables']['registrations']['Insert']
export type RegistrationUpdate = Database['public']['Tables']['registrations']['Update']

export type RegistrationSession = Database['public']['Tables']['registration_sessions']['Row']
export type RegistrationSessionInsert = Database['public']['Tables']['registration_sessions']['Insert']

export type RegistrationChild = Database['public']['Tables']['registration_children']['Row']
export type RegistrationChildInsert = Database['public']['Tables']['registration_children']['Insert']
export type RegistrationChildUpdate = Database['public']['Tables']['registration_children']['Update']

export type RegistrationPickup = Database['public']['Tables']['registration_pickups']['Row']
export type RegistrationPickupInsert = Database['public']['Tables']['registration_pickups']['Insert']

// Unified registration with children and pickups (joined)
export type RegistrationWithChildren = Registration & {
  children: RegistrationChild[]
  pickups?: RegistrationPickup[]
  sessions?: RegistrationSession[]
}

// Program with sessions (for workshop-style programs)
export type ProgramWithSessions = Program & {
  sessions: ProgramSession[]
}
