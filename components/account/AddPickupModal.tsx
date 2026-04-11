'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import Modal from './Modal'
import { addPickup } from '@/app/account/actions'
import { formatPhoneNumber } from '@/lib/utils/phone'

interface AddPickupModalProps {
  isOpen: boolean
  onClose: () => void
  registrationId: string
}

export default function AddPickupModal({
  isOpen,
  onClose,
  registrationId,
}: AddPickupModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relationship, setRelationship] = useState('')
  const t = useTranslations('account.modals')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError(t('pleaseEnterName'))
      return
    }

    setLoading(true)
    setError(null)

    const result = await addPickup(registrationId, name, phone, relationship)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      toast.error(t('failedToAddPickup'))
    } else {
      toast.success(t('pickupAdded'))
      setName('')
      setPhone('')
      setRelationship('')
      onClose()
    }
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setRelationship('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('addPickupTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-600">
          {t('addPickupDesc')}
        </p>

        <div>
          <label htmlFor="pickup_name" className="block text-sm font-medium text-slate-700 mb-1">
            {t('pickupNameLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pickup_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t('pickupNamePlaceholder')}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="pickup_phone" className="block text-sm font-medium text-slate-700 mb-1">
            {t('pickupPhoneLabel')}
          </label>
          <input
            type="tel"
            id="pickup_phone"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder={t('pickupPhonePlaceholder')}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="pickup_relationship" className="block text-sm font-medium text-slate-700 mb-1">
            {t('pickupRelationshipLabel')}
          </label>
          <input
            type="text"
            id="pickup_relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder={t('pickupRelationshipPlaceholder')}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50"
          >
            {loading ? t('adding') : t('addPickupButton')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
