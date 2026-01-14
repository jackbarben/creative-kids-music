/**
 * Program Type Configuration
 *
 * This module defines the configuration for each program type in the system.
 * When adding a new program, you typically just need to:
 * 1. Add a row to the `programs` database table
 * 2. Optionally add a new config here if it's a new program TYPE
 *
 * The config drives:
 * - Which form fields to show during registration
 * - Display settings (colors, labels, button text)
 * - Email confirmation content
 */

export interface ProgramFieldConfig {
  // Parent/Guardian fields
  showSecondParent: boolean

  // Child fields
  showGrade: boolean
  showSchool: boolean
  showMedical: boolean
  showTshirtSize: boolean
  showSpecialNeeds: boolean

  // Contact fields
  requireEmergencyContact: boolean
  requireAuthorizedPickups: boolean
  maxAuthorizedPickups: number

  // Agreement fields
  requireBehaviorAgreement: boolean
}

export interface ProgramDisplayConfig {
  accentColor: 'forest' | 'terracotta' | 'sage' | 'lavender'
  headerTitle: string
  childrenSectionTitle: string
  submitButtonText: string
  thankYouRoute: string
  priceLabel: string
}

export interface ProgramEmailConfig {
  confirmationSubject: string
  brandColor: string
  includes: string[]
}

export interface ProgramTypeConfig {
  fields: ProgramFieldConfig
  display: ProgramDisplayConfig
  email: ProgramEmailConfig
}

/**
 * Configuration for each program type.
 * The key matches the `program_type` column in the `programs` table.
 */
export const PROGRAM_TYPE_CONFIGS: Record<string, ProgramTypeConfig> = {
  workshop: {
    fields: {
      showSecondParent: false,
      showGrade: false,
      showSchool: true,
      showMedical: true,
      showTshirtSize: false,
      showSpecialNeeds: false,
      requireEmergencyContact: true,
      requireAuthorizedPickups: true,
      maxAuthorizedPickups: 2,
      requireBehaviorAgreement: false,
    },
    display: {
      accentColor: 'forest',
      headerTitle: 'Register for Workshop',
      childrenSectionTitle: "Who's coming?",
      submitButtonText: 'Register',
      thankYouRoute: '/workshops/thank-you',
      priceLabel: 'per child per workshop',
    },
    email: {
      confirmationSubject: "You're registered! Workshop confirmation",
      brandColor: '#166534', // forest-700
      includes: [
        'Music instruction and group activities',
        'Dinner for all participants',
        'Parent showcase performance',
      ],
    },
  },

  camp: {
    fields: {
      showSecondParent: true,
      showGrade: true,
      showSchool: true,
      showMedical: true,
      showTshirtSize: true,
      showSpecialNeeds: true,
      requireEmergencyContact: true,
      requireAuthorizedPickups: true,
      maxAuthorizedPickups: 3,
      requireBehaviorAgreement: true,
    },
    display: {
      accentColor: 'terracotta',
      headerTitle: 'Register for Summer Camp',
      childrenSectionTitle: "Who's coming to camp?",
      submitButtonText: 'Register for Camp',
      thankYouRoute: '/summer-camp/thank-you',
      priceLabel: 'per child',
    },
    email: {
      confirmationSubject: "You're registered! Summer Camp confirmation",
      brandColor: '#c2410c', // terracotta-700
      includes: [
        'Full week of music instruction',
        'Lunch provided daily',
        'Camp t-shirt',
        'Sunday showcase performance',
      ],
    },
  },

  after_school: {
    fields: {
      showSecondParent: true,
      showGrade: true,
      showSchool: true,
      showMedical: true,
      showTshirtSize: false,
      showSpecialNeeds: true,
      requireEmergencyContact: true,
      requireAuthorizedPickups: true,
      maxAuthorizedPickups: 3,
      requireBehaviorAgreement: true,
    },
    display: {
      accentColor: 'sage',
      headerTitle: 'Enroll in After School Program',
      childrenSectionTitle: "Who's enrolling?",
      submitButtonText: 'Enroll Now',
      thankYouRoute: '/after-school/thank-you',
      priceLabel: 'per child per semester',
    },
    email: {
      confirmationSubject: "You're enrolled! After School Program confirmation",
      brandColor: '#4a7c59', // sage-ish
      includes: [
        'Weekly music instruction',
        'Snack provided',
        'End-of-semester showcase',
      ],
    },
  },

  jam_night: {
    fields: {
      showSecondParent: false,
      showGrade: false,
      showSchool: false,
      showMedical: false,
      showTshirtSize: false,
      showSpecialNeeds: false,
      requireEmergencyContact: true,
      requireAuthorizedPickups: false,
      maxAuthorizedPickups: 0,
      requireBehaviorAgreement: false,
    },
    display: {
      accentColor: 'lavender',
      headerTitle: 'Sign Up for Jam Night',
      childrenSectionTitle: "Who's jamming?",
      submitButtonText: 'Sign Up',
      thankYouRoute: '/jam-night/thank-you',
      priceLabel: 'per child',
    },
    email: {
      confirmationSubject: "You're signed up! Jam Night confirmation",
      brandColor: '#7c3aed', // violet-600
      includes: [
        'Open jam session',
        'Light refreshments',
      ],
    },
  },

  private_lesson: {
    fields: {
      showSecondParent: false,
      showGrade: false,
      showSchool: false,
      showMedical: false,
      showTshirtSize: false,
      showSpecialNeeds: false,
      requireEmergencyContact: true,
      requireAuthorizedPickups: false,
      maxAuthorizedPickups: 0,
      requireBehaviorAgreement: false,
    },
    display: {
      accentColor: 'forest',
      headerTitle: 'Book Private Lesson',
      childrenSectionTitle: 'Student Information',
      submitButtonText: 'Book Lesson',
      thankYouRoute: '/lessons/thank-you',
      priceLabel: 'per lesson',
    },
    email: {
      confirmationSubject: "Lesson booked! Private Lesson confirmation",
      brandColor: '#166534',
      includes: [
        'One-on-one instruction',
        'Personalized curriculum',
      ],
    },
  },
}

/**
 * Get configuration for a program type.
 * Falls back to workshop config if type is not found.
 */
export function getProgramTypeConfig(programType: string): ProgramTypeConfig {
  return PROGRAM_TYPE_CONFIGS[programType] || PROGRAM_TYPE_CONFIGS.workshop
}

/**
 * Get all available program types.
 */
export function getAvailableProgramTypes(): string[] {
  return Object.keys(PROGRAM_TYPE_CONFIGS)
}

/**
 * Helper to get accent color classes for Tailwind
 */
export function getAccentColorClasses(color: ProgramDisplayConfig['accentColor']) {
  const colorMap = {
    forest: {
      bg: 'bg-forest-600',
      bgHover: 'hover:bg-forest-700',
      text: 'text-forest-600',
      border: 'border-forest-600',
      light: 'bg-forest-50',
    },
    terracotta: {
      bg: 'bg-terracotta-600',
      bgHover: 'hover:bg-terracotta-700',
      text: 'text-terracotta-600',
      border: 'border-terracotta-600',
      light: 'bg-terracotta-50',
    },
    sage: {
      bg: 'bg-sage-600',
      bgHover: 'hover:bg-sage-700',
      text: 'text-sage-600',
      border: 'border-sage-600',
      light: 'bg-sage-50',
    },
    lavender: {
      bg: 'bg-lavender-600',
      bgHover: 'hover:bg-lavender-700',
      text: 'text-lavender-600',
      border: 'border-lavender-600',
      light: 'bg-lavender-50',
    },
  }
  return colorMap[color]
}
