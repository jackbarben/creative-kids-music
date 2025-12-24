import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-display font-bold text-forest-600 mb-4">404</p>
        <h1 className="text-2xl font-display font-bold text-stone-800 mb-4">
          Not Found
        </h1>
        <p className="text-stone-600 mb-8 max-w-md">
          This record may have been deleted or the link is invalid.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin"
            className="inline-block bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/admin/parents"
            className="inline-block border border-stone-300 text-stone-600 px-6 py-3 rounded-lg hover:bg-stone-50 transition-colors"
          >
            View Families
          </Link>
        </div>
      </div>
    </div>
  )
}
