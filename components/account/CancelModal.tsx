'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Modal from './Modal'
import { cancelRegistration } from '@/app/account/actions'

interface CancelModalProps {
  isOpen: boolean
  onClose: () => void
  registrationId: string
  programType: 'workshop' | 'camp'
  programName: string
  isPaid: boolean
}

export default function CancelModal({
  isOpen,
  onClose,
  registrationId,
  programType,
  programName,
  isPaid,
}: CancelModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const t = useTranslations('account.modals')

  const handleCancel = async () => {
    if (!confirmed) return

    setLoading(true)
    setError(null)

    const result = await cancelRegistration(registrationId, programType, reason)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      toast.error(t('failedToCancelRegistration'))
    } else {
      toast.success(t('registrationCancelled'))
      onClose()
    }
  }

  const handleClose = () => {
    setConfirmed(false)
    setReason('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('cancelRegistrationTitle')}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <p className="text-slate-700">
          {t('cancelRegistrationConfirm', { programName })}
        </p>

        {isPaid ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm font-medium">{t('noRefundAvailableTitle')}</p>
            <p className="text-amber-700 text-sm mt-1">
              {t('noRefundAvailableDesc')}
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-sm">
              {t('cancelNoPenalty')}
            </p>
          </div>
        )}

        <p className="text-xs text-slate-500">
          {t.rich('seeRefundPolicy', {
            link: (chunks) => (
              <Link
                href="/terms/program-terms#cancellation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-600 hover:underline"
              >
                {chunks}
              </Link>
            )
          })}
        </p>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
            {t('reasonLabel')}
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800"
          >
            <option value="">{t('reasonSelectPlaceholder')}</option>
            <option value="schedule_conflict">{t('reasonScheduleConflict')}</option>
            <option value="child_not_interested">{t('reasonChildNotInterested')}</option>
            <option value="financial">{t('reasonFinancial')}</option>
            <option value="moving">{t('reasonMoving')}</option>
            <option value="other">{t('reasonOther')}</option>
          </select>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-slate-700">
            {t('understandAndCancel')}
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            {t('keepRegistration')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || !confirmed}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? t('cancelling') : t('cancelRegistrationButton')}
          </button>
        </div>
      </div>
    </Modal>
  )
}
