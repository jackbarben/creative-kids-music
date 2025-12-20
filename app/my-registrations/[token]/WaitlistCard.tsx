import { WaitlistSignup } from '@/lib/database.types'

interface WaitlistCardProps {
  signup: WaitlistSignup
}

export function WaitlistCard({ signup }: WaitlistCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <h2 className="font-fraunces text-lg font-bold text-stone-700">
            Music School Waitlist
          </h2>
          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
            On waitlist
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <p className="text-stone-600">
            You&apos;re on the waitlist for our Fall 2026 after-school music program.
            We&apos;ll contact you when registration opens.
          </p>
        </div>

        {signup.child_name && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 mb-2">Child</h3>
            <p className="text-stone-800">{signup.child_name}</p>
            {signup.child_grade && (
              <p className="text-stone-600 text-sm">Grade: {signup.child_grade}</p>
            )}
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Contact</h3>
          <p className="text-stone-800">{signup.parent_name}</p>
          <p className="text-stone-600">{signup.parent_email}</p>
        </div>

        <p className="text-sm text-stone-500">
          Signed up on {new Date(signup.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}
