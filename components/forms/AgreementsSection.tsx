'use client'

import { useState } from 'react'
import Link from 'next/link'

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

  return (
    <section>
      <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
        Agreements
      </h3>

      <p className="text-sm text-stone-600 mb-6">
        Please read each document carefully before accepting. You must accept all required agreements to complete registration.
      </p>

      {/* Liability Waiver */}
      <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="font-medium text-stone-700">
              Liability Waiver <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-stone-500 mt-1">
              Covers assumption of risk, release of claims, medical authorization, and related matters.
            </p>
          </div>
          <Link
            href="/terms/liability-waiver"
            target="_blank"
            className="flex-shrink-0 text-sm font-medium text-forest-600 hover:text-forest-700 underline"
          >
            Read Full Document
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
            I have read and agree to the{' '}
            <Link href="/terms/liability-waiver" target="_blank" className="text-forest-600 hover:text-forest-700 underline">
              Liability Waiver and Release of Claims
            </Link>
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
              Terms &amp; Conditions <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-stone-500 mt-1">
              Covers registration, payment, cancellations, refunds, drop-off/pickup, and program policies.
            </p>
          </div>
          <Link
            href="/terms/program-terms"
            target="_blank"
            className="flex-shrink-0 text-sm font-medium text-forest-600 hover:text-forest-700 underline"
          >
            Read Full Document
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
            I have read and agree to the{' '}
            <Link href="/terms/program-terms" target="_blank" className="text-forest-600 hover:text-forest-700 underline">
              Terms &amp; Conditions
            </Link>
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
                Camper Behavior Agreement <span className="text-red-500">*</span>
              </p>
              <p className="text-sm text-stone-500 mt-1">
                Covers behavior expectations, safety rules, and consequences for summer camp participants.
              </p>
            </div>
            <Link
              href="/terms/behavior-agreement"
              target="_blank"
              className="flex-shrink-0 text-sm font-medium text-forest-600 hover:text-forest-700 underline"
            >
              Read Full Document
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
              I have read and agree to the{' '}
              <Link href="/terms/behavior-agreement" target="_blank" className="text-forest-600 hover:text-forest-700 underline">
                Camper Behavior Agreement
              </Link>
              , and I have reviewed these expectations with my child
            </span>
          </label>
          {fieldErrors?.behavior_agreement_accepted && (
            <p className="mt-2 text-sm text-red-600">{fieldErrors.behavior_agreement_accepted}</p>
          )}
        </div>
      )}

      {/* Media Consent - Two Separate Checkboxes */}
      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
        <p className="font-medium text-stone-700 mb-1">
          Photo/Video Permission
        </p>
        <p className="text-sm text-stone-500 mb-4">
          We may take photos and videos during the program. These are optional—your child can participate regardless of your choices here.
        </p>

        <div className="space-y-3">
          {/* Internal Documentation */}
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
                <p className="font-medium text-stone-700 text-sm">Internal Documentation</p>
                <p className="text-sm text-stone-500 mt-1">
                  I give permission for photos/videos to be used for internal purposes only (curriculum development,
                  facilitator training, grant applications, program archives). Not shared publicly.
                </p>
              </div>
            </label>
          </div>

          {/* Marketing & Public Communications */}
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
                <p className="font-medium text-stone-700 text-sm">Marketing &amp; Public Communications</p>
                <p className="text-sm text-stone-500 mt-1">
                  I give permission for photos/videos to be used in promotional materials (website, social media,
                  newsletters, church communications, press coverage, print materials).
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
