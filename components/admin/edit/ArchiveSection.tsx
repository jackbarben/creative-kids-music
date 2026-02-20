'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import EditSection from './EditSection'
import ConfirmDialog from '../ConfirmDialog'

interface ArchiveSectionProps {
  registrationId: string
  registrationStatus: string
  parentName: string
  archiveAction: (registrationId: string, reason?: string) => Promise<{ success?: boolean; error?: string }>
  restoreAction: (registrationId: string, targetStatus: string) => Promise<{ success?: boolean; error?: string }>
  deleteAction: (registrationId: string) => Promise<{ success?: boolean; error?: string }>
  listUrl: string
}

export default function ArchiveSection({
  registrationId,
  registrationStatus,
  parentName,
  archiveAction,
  restoreAction,
  deleteAction,
  listUrl,
}: ArchiveSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [archiveReason, setArchiveReason] = useState('')
  const [restoreStatus, setRestoreStatus] = useState('cancelled')
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isArchived = registrationStatus === 'archived'

  const handleArchive = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await archiveAction(registrationId, archiveReason || undefined)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Registration archived' })
        setShowArchiveConfirm(false)
      }
    })
  }

  const handleRestore = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await restoreAction(registrationId, restoreStatus)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Registration restored' })
        setShowRestoreConfirm(false)
      }
    })
  }

  const handleDelete = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await deleteAction(registrationId)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        router.push(listUrl)
      }
    })
  }

  return (
    <EditSection title="Archive / Delete" showSaveButton={false}>
      {!isArchived ? (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Archive Registration</h4>
            <p className="text-sm text-amber-700 mb-3">
              Archiving removes this registration from the main list but preserves all data.
              You can restore it later if needed.
            </p>
            <div className="mb-3">
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Reason (optional)
              </label>
              <input
                type="text"
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="e.g., Duplicate registration, No-show, etc."
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 bg-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowArchiveConfirm(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Archive Registration
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Restore Registration</h4>
            <p className="text-sm text-blue-700 mb-3">
              Restore this registration to the main list with the selected status.
            </p>
            <div className="mb-3">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Restore to status
              </label>
              <select
                value={restoreStatus}
                onChange={(e) => setRestoreStatus(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowRestoreConfirm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Restore Registration
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Permanently Delete</h4>
            <p className="text-sm text-red-700 mb-3">
              This will permanently delete all data for this registration including children and pickup information.
              This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <ConfirmDialog
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchive}
        title="Archive Registration?"
        message={`Are you sure you want to archive ${parentName}'s registration? It will be removed from the main list but can be restored later.`}
        confirmText="Yes, Archive"
        confirmStyle="warning"
        loading={isPending}
      />

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestore}
        title="Restore Registration?"
        message={`Are you sure you want to restore ${parentName}'s registration to "${restoreStatus}" status?`}
        confirmText="Yes, Restore"
        confirmStyle="primary"
        loading={isPending}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Permanently Delete?"
        message={`Are you sure you want to permanently delete ${parentName}'s registration? This will delete all associated data and cannot be undone.`}
        confirmText="Yes, Delete Permanently"
        confirmStyle="danger"
        loading={isPending}
      />
    </EditSection>
  )
}
