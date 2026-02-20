'use client'

import {
  EditParentSection,
  EditEmergencySection,
  EditMediaConsentSection,
  EditChildrenSection,
  EditPickupsSection,
  ArchiveSection,
} from '@/components/admin/edit'

import {
  updateParentInfo,
  updateEmergencyContact,
  updateMediaConsent,
  addChild,
  updateChild,
  removeChild,
  addPickup,
  updatePickup,
  removePickup,
  archiveRegistration,
  restoreRegistration,
  deleteRegistration,
} from './actions'

interface Child {
  id: string
  child_name: string
  child_age: number
  child_school?: string | null
  allergies?: string | null
  dietary_restrictions?: string | null
  medical_conditions?: string | null
  discount_cents?: number | null
}

interface Pickup {
  id: string
  name: string
  phone?: string | null
  relationship?: string | null
}

interface RegistrationEditPanelProps {
  registrationId: string
  registrationStatus: string
  parentInfo: {
    parent_name?: string | null
    parent_first_name?: string | null
    parent_last_name?: string | null
    parent_email?: string | null
    parent_phone?: string | null
    parent_relationship?: string | null
  }
  emergencyInfo: {
    emergency_name?: string | null
    emergency_phone?: string | null
    emergency_relationship?: string | null
  }
  mediaConsent: {
    media_consent_internal?: boolean | null
    media_consent_marketing?: boolean | null
  }
  registeredChildren: Child[]
  pickups: Pickup[]
}

export default function RegistrationEditPanel({
  registrationId,
  registrationStatus,
  parentInfo,
  emergencyInfo,
  mediaConsent,
  registeredChildren,
  pickups,
}: RegistrationEditPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Edit Registration</h2>
      <div className="space-y-4">
        <EditParentSection
          registrationId={registrationId}
          parentInfo={parentInfo}
          showSecondParent={false}
          updateAction={updateParentInfo}
        />

        <EditEmergencySection
          registrationId={registrationId}
          emergencyInfo={emergencyInfo}
          updateAction={updateEmergencyContact}
        />

        <EditMediaConsentSection
          registrationId={registrationId}
          consentInfo={mediaConsent}
          updateAction={updateMediaConsent}
        />

        <EditChildrenSection
          registrationId={registrationId}
          registeredChildren={registeredChildren}
          showCampFields={false}
          addAction={addChild}
          updateAction={updateChild}
          removeAction={removeChild}
        />

        <EditPickupsSection
          registrationId={registrationId}
          pickups={pickups}
          addAction={addPickup}
          updateAction={updatePickup}
          removeAction={removePickup}
        />

        <ArchiveSection
          registrationId={registrationId}
          registrationStatus={registrationStatus}
          parentName={parentInfo.parent_name || 'Unknown'}
          archiveAction={archiveRegistration}
          restoreAction={restoreRegistration}
          deleteAction={deleteRegistration}
          listUrl="/admin/workshops"
        />
      </div>
    </div>
  )
}
