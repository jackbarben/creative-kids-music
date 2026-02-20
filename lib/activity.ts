/**
 * Activity logging utilities for tracking admin changes
 */

export interface FieldChange {
  field: string
  before: unknown
  after: unknown
}

/**
 * Compare two objects and return the fields that changed
 */
export function trackChanges<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>
): FieldChange[] {
  const changes: FieldChange[] = []

  for (const key of Object.keys(after)) {
    const beforeVal = before[key]
    const afterVal = after[key as keyof T]

    // Skip if values are the same
    if (beforeVal === afterVal) continue

    // Handle null/undefined comparisons
    if (beforeVal == null && afterVal == null) continue

    changes.push({
      field: key,
      before: beforeVal,
      after: afterVal,
    })
  }

  return changes
}

/**
 * Format changes for display in activity log
 */
export function formatChanges(changes: FieldChange[]): string {
  if (changes.length === 0) return 'No changes'

  return changes
    .map(c => `${c.field}: "${c.before}" → "${c.after}"`)
    .join(', ')
}

/**
 * Standard action types for consistency
 */
export const ACTION_TYPES = {
  // Registration actions
  REGISTRATION_STATUS_UPDATED: 'registration_status_updated',
  REGISTRATION_PAYMENT_UPDATED: 'registration_payment_updated',
  REGISTRATION_PARENT_UPDATED: 'registration_parent_updated',
  REGISTRATION_EMERGENCY_UPDATED: 'registration_emergency_updated',
  REGISTRATION_CONSENT_UPDATED: 'registration_consent_updated',
  REGISTRATION_NOTES_UPDATED: 'registration_notes_updated',
  REGISTRATION_ARCHIVED: 'registration_archived',
  REGISTRATION_RESTORED: 'registration_restored',
  REGISTRATION_DELETED: 'registration_deleted',
  REGISTRATION_CREATED_BY_ADMIN: 'registration_created_by_admin',

  // Child actions
  CHILD_ADDED: 'registration_child_added',
  CHILD_UPDATED: 'registration_child_updated',
  CHILD_REMOVED: 'registration_child_removed',

  // Pickup actions
  PICKUP_ADDED: 'registration_pickup_added',
  PICKUP_UPDATED: 'registration_pickup_updated',
  PICKUP_REMOVED: 'registration_pickup_removed',

  // Workshop selection
  WORKSHOPS_UPDATED: 'registration_workshops_updated',
} as const

export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES]
