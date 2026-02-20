'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { saveAccountSettings, type AccountSettings } from '../actions'
import ChildrenSection from '@/components/account/ChildrenSection'
import FamilyMembersSection from '@/components/account/FamilyMembersSection'
import LoadingButton from '@/components/ui/LoadingButton'
import SuccessModal from '@/components/ui/SuccessModal'
import { formatPhoneNumber } from '@/lib/utils/phone'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Auth form states
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('') // Current password for email change
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Settings form state
  const [settings, setSettings] = useState<AccountSettings>({
    parent_first_name: '',
    parent_last_name: '',
    parent_relationship: '',
    parent_phone: '',
    parent2_first_name: '',
    parent2_last_name: '',
    parent2_relationship: '',
    parent2_phone: '',
    parent2_email: '',
    emergency_name: '',
    emergency_phone: '',
    emergency_relationship: '',
    default_pickups: [],
    default_media_consent_internal: false,
    default_media_consent_marketing: false,
    email_reminders: true,
    email_updates: true,
  })

  const [showSecondParent, setShowSecondParent] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const loadSettings = useCallback(async () => {
    if (!user?.id) return

    const { data } = await supabase
      .from('account_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data && typeof data === 'object') {
      const row = data as Record<string, string | boolean | unknown[] | null>
      setSettings({
        parent_first_name: (row.parent_first_name as string) || '',
        parent_last_name: (row.parent_last_name as string) || '',
        parent_relationship: (row.parent_relationship as string) || '',
        parent_phone: (row.parent_phone as string) || '',
        parent2_first_name: (row.parent2_first_name as string) || '',
        parent2_last_name: (row.parent2_last_name as string) || '',
        parent2_relationship: (row.parent2_relationship as string) || '',
        parent2_phone: (row.parent2_phone as string) || '',
        parent2_email: (row.parent2_email as string) || '',
        emergency_name: (row.emergency_name as string) || '',
        emergency_phone: (row.emergency_phone as string) || '',
        emergency_relationship: (row.emergency_relationship as string) || '',
        default_pickups: (row.default_pickups as AccountSettings['default_pickups']) || [],
        default_media_consent_internal: row.default_media_consent_internal === true,
        default_media_consent_marketing: row.default_media_consent_marketing === true,
        email_reminders: row.email_reminders !== false,
        email_updates: row.email_updates !== false,
      })
      if (row.parent2_first_name || row.parent2_last_name) {
        setShowSecondParent(true)
      }
    }
  }, [supabase, user?.id])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/account')
        return
      }
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [supabase.auth, router])

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user, loadSettings])

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !emailPassword) return

    setSavingEmail(true)
    setError(null)

    // Verify current password before allowing email change
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: emailPassword,
    })

    if (signInError) {
      setError('Current password is incorrect')
      setSavingEmail(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail
    })

    if (error) {
      setError(error.message)
    } else {
      setNewEmail('')
      setEmailPassword('')
      setSuccessMessage('Check your new email for a verification link')
      setShowSuccessModal(true)
    }
    setSavingEmail(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSavingPassword(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setError(error.message)
    } else {
      setNewPassword('')
      setConfirmPassword('')
      setSuccessMessage('Password updated successfully')
      setShowSuccessModal(true)
    }
    setSavingPassword(false)
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const result = await saveAccountSettings(settings)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccessMessage('Settings saved successfully')
      setShowSuccessModal(true)
    }
    setSaving(false)
  }

  const updateSetting = <K extends keyof AccountSettings>(key: K, value: AccountSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const addPickup = () => {
    setSettings(prev => ({
      ...prev,
      default_pickups: [...(prev.default_pickups || []), { name: '', phone: '', relationship: '' }]
    }))
  }

  const updatePickup = (index: number, field: 'name' | 'phone' | 'relationship', value: string) => {
    setSettings(prev => ({
      ...prev,
      default_pickups: prev.default_pickups?.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ) || []
    }))
  }

  const removePickup = (index: number) => {
    setSettings(prev => ({
      ...prev,
      default_pickups: prev.default_pickups?.filter((_, i) => i !== index) || []
    }))
  }

  // Common input class with better contrast
  const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isGoogleUser = user?.app_metadata?.provider === 'google'

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Back Link */}
          <Link
            href="/account"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-6"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="font-display text-4xl font-semibold text-slate-800 mb-8">
            Account Settings
          </h1>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Children Section - Now in Settings */}
          {user && (
            <div className="mb-6">
              <ChildrenSection userId={user.id} />
            </div>
          )}

          {/* Family Members Section */}
          {user?.email && (
            <FamilyMembersSection userEmail={user.email} />
          )}

          {/* Login & Security Section */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
              Login & Security
            </h2>

            {/* Email */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <p className="text-slate-600 mb-4">
                Email: <span className="font-medium text-slate-800">{user?.email}</span>
              </p>

              {isGoogleUser ? (
                <p className="text-sm text-slate-500">
                  Your email is managed by Google.
                </p>
              ) : (
                <form onSubmit={handleChangeEmail}>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 mb-1">
                        New Email
                      </label>
                      <input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className={inputClass}
                        placeholder="newemail@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="emailPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        id="emailPassword"
                        type="password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        className={inputClass}
                        placeholder="Enter your current password"
                      />
                      <p className="text-xs text-slate-500 mt-1">Required to change your email</p>
                    </div>
                  </div>
                  <LoadingButton
                    type="submit"
                    loading={savingEmail}
                    disabled={!newEmail || !emailPassword}
                    className="text-sm px-4 py-2"
                  >
                    Update Email
                  </LoadingButton>
                </form>
              )}
            </div>

            {/* Password */}
            <div>
              {isGoogleUser ? (
                <p className="text-sm text-slate-500">
                  Your account uses Google sign-in. Password is managed by Google.
                </p>
              ) : (
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={inputClass}
                        placeholder="Enter new password"
                        minLength={8}
                      />
                      <p className="text-xs text-slate-500 mt-1">At least 8 characters</p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <LoadingButton
                    type="submit"
                    loading={savingPassword}
                    disabled={!newPassword || !confirmPassword}
                    className="text-sm px-4 py-2"
                  >
                    Update Password
                  </LoadingButton>
                </form>
              )}
            </div>

            {/* Connected Accounts */}
            {isGoogleUser && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-3">Connected Accounts</p>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-slate-700">Google</span>
                  <span className="ml-auto text-sm text-green-600">Connected</span>
                </div>
              </div>
            )}
          </div>

          {/* Profile Settings Form */}
          <form onSubmit={handleSaveSettings}>
            {/* Parent/Guardian Information */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Parent/Guardian Information
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                This information will be pre-filled when you register for programs.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="parent_first_name" className="block text-sm font-medium text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="parent_first_name"
                      type="text"
                      value={settings.parent_first_name || ''}
                      onChange={(e) => updateSetting('parent_first_name', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="parent_last_name" className="block text-sm font-medium text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="parent_last_name"
                      type="text"
                      value={settings.parent_last_name || ''}
                      onChange={(e) => updateSetting('parent_last_name', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="parent_relationship" className="block text-sm font-medium text-slate-700 mb-1">
                      Relationship to Child
                    </label>
                    <input
                      id="parent_relationship"
                      type="text"
                      value={settings.parent_relationship || ''}
                      onChange={(e) => updateSetting('parent_relationship', e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Mother, Father, Guardian"
                    />
                  </div>
                  <div>
                    <label htmlFor="parent_phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="parent_phone"
                      type="tel"
                      value={settings.parent_phone || ''}
                      onChange={(e) => updateSetting('parent_phone', formatPhoneNumber(e.target.value))}
                      className={inputClass}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>

                {/* Second Parent Toggle */}
                {!showSecondParent ? (
                  <button
                    type="button"
                    onClick={() => setShowSecondParent(true)}
                    className="text-sm text-forest-600 hover:text-forest-700 font-medium"
                  >
                    + Add Second Parent/Guardian
                  </button>
                ) : (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-slate-700">Second Parent/Guardian</p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSecondParent(false)
                          updateSetting('parent2_first_name', '')
                          updateSetting('parent2_last_name', '')
                          updateSetting('parent2_relationship', '')
                          updateSetting('parent2_phone', '')
                          updateSetting('parent2_email', '')
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="parent2_first_name" className="block text-sm font-medium text-slate-700 mb-1">
                            First Name
                          </label>
                          <input
                            id="parent2_first_name"
                            type="text"
                            value={settings.parent2_first_name || ''}
                            onChange={(e) => updateSetting('parent2_first_name', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="parent2_last_name" className="block text-sm font-medium text-slate-700 mb-1">
                            Last Name
                          </label>
                          <input
                            id="parent2_last_name"
                            type="text"
                            value={settings.parent2_last_name || ''}
                            onChange={(e) => updateSetting('parent2_last_name', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="parent2_relationship" className="block text-sm font-medium text-slate-700 mb-1">
                            Relationship
                          </label>
                          <input
                            id="parent2_relationship"
                            type="text"
                            value={settings.parent2_relationship || ''}
                            onChange={(e) => updateSetting('parent2_relationship', e.target.value)}
                            className={inputClass}
                            placeholder="e.g., Father, Step-mother"
                          />
                        </div>
                        <div>
                          <label htmlFor="parent2_phone" className="block text-sm font-medium text-slate-700 mb-1">
                            Phone
                          </label>
                          <input
                            id="parent2_phone"
                            type="tel"
                            value={settings.parent2_phone || ''}
                            onChange={(e) => updateSetting('parent2_phone', formatPhoneNumber(e.target.value))}
                            className={inputClass}
                            placeholder="(555) 555-5555"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="parent2_email" className="block text-sm font-medium text-slate-700 mb-1">
                          Email (optional)
                        </label>
                        <input
                          id="parent2_email"
                          type="email"
                          value={settings.parent2_email || ''}
                          onChange={(e) => updateSetting('parent2_email', e.target.value)}
                          className={inputClass}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Emergency Contact
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Someone we can reach in case of emergency (other than yourself).
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emergency_name" className="block text-sm font-medium text-slate-700 mb-1">
                      Name
                    </label>
                    <input
                      id="emergency_name"
                      type="text"
                      value={settings.emergency_name || ''}
                      onChange={(e) => updateSetting('emergency_name', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="emergency_phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="emergency_phone"
                      type="tel"
                      value={settings.emergency_phone || ''}
                      onChange={(e) => updateSetting('emergency_phone', formatPhoneNumber(e.target.value))}
                      className={inputClass}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="emergency_relationship" className="block text-sm font-medium text-slate-700 mb-1">
                    Relationship
                  </label>
                  <input
                    id="emergency_relationship"
                    type="text"
                    value={settings.emergency_relationship || ''}
                    onChange={(e) => updateSetting('emergency_relationship', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Grandmother, Neighbor, Family Friend"
                  />
                </div>
              </div>
            </div>

            {/* Default Authorized Pickups */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Default Authorized Pickups
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                People other than parents who can pick up your children. These will be pre-filled when you register.
              </p>

              <div className="space-y-4">
                {(settings.default_pickups || []).map((pickup, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-slate-700">Pickup #{index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removePickup(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={pickup.name}
                        onChange={(e) => updatePickup(index, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:border-forest-500 outline-none text-sm text-slate-800 placeholder:text-slate-400"
                        placeholder="Name"
                      />
                      <input
                        type="tel"
                        value={pickup.phone}
                        onChange={(e) => updatePickup(index, 'phone', formatPhoneNumber(e.target.value))}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:border-forest-500 outline-none text-sm text-slate-800 placeholder:text-slate-400"
                        placeholder="Phone"
                      />
                      <input
                        type="text"
                        value={pickup.relationship || ''}
                        onChange={(e) => updatePickup(index, 'relationship', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:border-forest-500 outline-none text-sm text-slate-800 placeholder:text-slate-400"
                        placeholder="Relationship"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPickup}
                  className="text-sm text-forest-600 hover:text-forest-700 font-medium"
                >
                  + Add Authorized Pickup
                </button>
              </div>
            </div>

            {/* Standing Permissions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Standing Permissions
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Your default photo/video permissions. These will be pre-selected when you register for programs.
              </p>

              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.default_media_consent_internal || false}
                      onChange={(e) => updateSetting('default_media_consent_internal', e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Internal Documentation</p>
                      <p className="text-sm text-slate-500 mt-1">
                        I give permission for Creative Kids Music Project to photograph and video record my child
                        for internal purposes, including curriculum development, facilitator training, grant
                        applications, and program archives. These materials are not shared publicly.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.default_media_consent_marketing || false}
                      onChange={(e) => updateSetting('default_media_consent_marketing', e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Marketing & Public Communications</p>
                      <p className="text-sm text-slate-500 mt-1">
                        I give permission for Creative Kids Music Project to photograph and video record my child
                        for use in promotional materials, including our website, social media accounts, newsletters,
                        church communications, press coverage, and print materials.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Communication Preferences
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email_reminders}
                    onChange={(e) => updateSetting('email_reminders', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Event reminders</p>
                    <p className="text-sm text-slate-500">Receive reminders before workshops and events</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email_updates}
                    onChange={(e) => updateSetting('email_updates', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Program announcements</p>
                    <p className="text-sm text-slate-500">News about new programs, camps, and special events</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <LoadingButton type="submit" loading={saving}>
                Save Settings
              </LoadingButton>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  )
}
