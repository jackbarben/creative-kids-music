'use client'

import { useState, useEffect, useCallback } from 'react'
import { getFamilyInfo, inviteFamilyMember, removeFamilyMember, type FamilyInfo } from '@/app/account/actions'
import LoadingButton from '@/components/ui/LoadingButton'

interface FamilyMembersSectionProps {
  userEmail: string
}

export default function FamilyMembersSection({ userEmail }: FamilyMembersSectionProps) {
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadFamilyInfo = useCallback(async () => {
    const info = await getFamilyInfo()
    setFamilyInfo(info)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFamilyInfo()
  }, [loadFamilyInfo])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setInviting(true)
    setError(null)
    setSuccess(null)

    const result = await inviteFamilyMember(inviteEmail)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      await loadFamilyInfo()
    }
    setInviting(false)
  }

  const handleRemove = async (memberId: string, email: string) => {
    if (!confirm(`Remove ${email} from your family? They will no longer be able to view or manage family registrations.`)) {
      return
    }

    setRemovingId(memberId)
    setError(null)
    setSuccess(null)

    const result = await removeFamilyMember(memberId)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(`${email} has been removed from your family`)
      await loadFamilyInfo()
    }
    setRemovingId(null)
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mb-6"></div>
          <div className="space-y-3">
            <div className="h-12 bg-slate-100 rounded"></div>
            <div className="h-12 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Family tables may not exist yet
  if (!familyInfo) {
    return null
  }

  const currentMember = familyInfo.members.find(m => m.email === userEmail)
  const otherMembers = familyInfo.members.filter(m => m.email !== userEmail)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
      <h2 className="font-display text-xl font-semibold text-slate-800 mb-2">
        Family Members
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Family members can view and manage all family registrations, children, and settings.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="ml-3 text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Current Members */}
      <div className="space-y-3 mb-6">
        {/* Current user */}
        {currentMember && (
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                <span className="text-forest-700 font-medium text-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-slate-700 font-medium">{userEmail}</p>
                <p className="text-xs text-slate-500">You</p>
              </div>
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
          </div>
        )}

        {/* Other members */}
        {otherMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-slate-600 font-medium text-sm">
                  {member.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-slate-700 font-medium">{member.email}</p>
                {member.joined_at ? (
                  <p className="text-xs text-slate-500">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-xs text-amber-600">Invitation pending</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.joined_at ? (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
              ) : (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
              )}
              <button
                onClick={() => handleRemove(member.id, member.email)}
                disabled={removingId === member.id}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {removingId === member.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="border-t border-slate-100 pt-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Invite a family member</p>
        <p className="text-sm text-slate-500 mb-4">
          They&apos;ll receive an email to set up their login. Once they create an account, they&apos;ll automatically join your family.
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@example.com"
            className={`${inputClass} flex-1`}
          />
          <LoadingButton
            type="submit"
            loading={inviting}
            disabled={!inviteEmail.trim()}
            className="whitespace-nowrap"
          >
            Send Invite
          </LoadingButton>
        </div>
      </form>
    </div>
  )
}
