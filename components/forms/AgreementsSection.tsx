'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface AgreementsSectionProps {
  showBehaviorAgreement?: boolean
  fieldErrors?: Record<string, string>
  defaultMediaConsentInternal?: boolean
  defaultMediaConsentMarketing?: boolean
}

export default function AgreementsSection({
  showBehaviorAgreement = false,
  fieldErrors,
  defaultMediaConsentInternal = false,
  defaultMediaConsentMarketing = false,
}: AgreementsSectionProps) {
  const [mediaConsentInternal, setMediaConsentInternal] = useState(defaultMediaConsentInternal)
  const [mediaConsentMarketing, setMediaConsentMarketing] = useState(defaultMediaConsentMarketing)
  const [liabilityAccepted, setLiabilityAccepted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [behaviorAccepted, setBehaviorAccepted] = useState(false)
  const t = useTranslations('forms.agreements')

  return (
    <section>
      <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
        {t('title')}
      </h3>

      <p className="text-sm text-stone-600 mb-6">
        {t('intro')}
      </p>

      {/* Liability Waiver */}
      <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="font-medium text-stone-700">
              {t('liabilityTitle')} <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-stone-500 mt-1">
              {t('liabilityDesc')}
            </p>
          </div>
          <Link
            href="/terms/liability-waiver"
            target="_blank"
            className="flex-shrink-0 text-sm font-medium text-forest-600 hover:text-forest-700 underline"
          >
            {t('readFull')}
          </Link>
        </div>
        <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-stone-200">
          <input
            type="checkbox"
            name="liability_waiver_accepted"
            checked={liabilityAccepted}
            onChange={(e) => setLiabilityAccepted(e.target.checked)}
            required
            className="mt-0.5 h-5 w-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
          />
          <span className="text-sm text-stone-700">
            {t.rich('liabilityLabel', {
              link: (chunks) => (
                <Link href="/terms/liability-waiver" target="_blank" className="text-forest-600 hover:text-forest-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {fieldErrors?.liability_waiver_accepted && (
          <p className="mt-2 text-sm text-red-600">{fieldErrors.liability_waiver_accepted}</p>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="font-medium text-stone-700">
              {t('termsTitle')} <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-stone-500 mt-1">
              {t('termsDesc')}
            </p>
          </div>
          <Link
            href="/terms/program-terms"
            target="_blank"
            className="flex-shrink-0 text-sm font-medium text-forest-600 hover:text-forest-700 underline"
          >
            {t('readFull')}
          </Link>
        </div>
        <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-stone-200">
          <input
            type="checkbox"
            name="terms_accepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
            className="mt-0.5 h-5 w-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
          />
          <span className="text-sm text-stone-700">
            {t.rich('termsLabel', {
              link: (chunks) => (
                <Link href="/terms/program-terms" target="_blank" className="text-forest-600 hover:text-forest-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {fieldErrors?.terms_accepted && (
          <p className="mt-2 text-sm text-red-600">{fieldErrors.terms_accepted}</p>
        )}
      </div>

      {/* Behavior Agreement (Camp only) */}
      {showBehaviorAgreement && (
        <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-medium text-stone-700">
                {t('behaviorTitle')} <span className="text-red-500">*</span>
              </p>
              <p className="text-sm text-stone-500 mt-1">
                {t('behaviorDesc')}
              </p>
            </div>
            <Link
              href="/terms/behavior-agreement"
              target="_blank"
              className="flex-shrink-0 text-sm font-medium text-forest-600 hover:text-forest-700 underline"
            >
              {t('readFull')}
            </Link>
          </div>
          <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-stone-200">
            <input
              type="checkbox"
              name="behavior_agreement_accepted"
              checked={behaviorAccepted}
              onChange={(e) => setBehaviorAccepted(e.target.checked)}
              required
              className="mt-0.5 h-5 w-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
            />
            <span className="text-sm text-stone-700">
              {t.rich('behaviorLabel', {
                link: (chunks) => (
                  <Link href="/terms/behavior-agreement" target="_blank" className="text-forest-600 hover:text-forest-700 underline">
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>
          {fieldErrors?.behavior_agreement_accepted && (
            <p className="mt-2 text-sm text-red-600">{fieldErrors.behavior_agreement_accepted}</p>
          )}
        </div>
      )}

      {/* Media Consent */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <p className="font-medium text-stone-700 mb-1">
          {t('mediaTitle')}
        </p>
        <p className="text-sm text-stone-500 mb-4">
          {t('mediaDesc')}
        </p>

        <div className="space-y-3">
          <div className="p-3 border border-stone-200 rounded-lg bg-white">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="media_consent_internal"
                checked={mediaConsentInternal}
                onChange={(e) => setMediaConsentInternal(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
              />
              <div>
                <p className="font-medium text-stone-700 text-sm">{t('mediaInternalTitle')}</p>
                <p className="text-sm text-stone-500 mt-1">{t('mediaInternalDesc')}</p>
              </div>
            </label>
          </div>

          <div className="p-3 border border-stone-200 rounded-lg bg-white">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="media_consent_marketing"
                checked={mediaConsentMarketing}
                onChange={(e) => setMediaConsentMarketing(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
              />
              <div>
                <p className="font-medium text-stone-700 text-sm">{t('mediaMarketingTitle')}</p>
                <p className="text-sm text-stone-500 mt-1">{t('mediaMarketingDesc')}</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
