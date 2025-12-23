export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Back link */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-4 bg-stone-200 rounded" />
        <div className="h-4 w-32 bg-stone-200 rounded" />
      </div>

      {/* Title */}
      <div className="h-8 w-64 bg-stone-200 rounded mb-8" />

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact info card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="h-6 w-32 bg-stone-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-3/4 bg-stone-100 rounded" />
              <div className="h-4 w-1/2 bg-stone-100 rounded" />
            </div>
          </div>

          {/* Emergency contact card */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="h-6 w-40 bg-red-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-red-100 rounded" />
              <div className="h-4 w-2/3 bg-red-100 rounded" />
            </div>
          </div>

          {/* Children card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="h-6 w-24 bg-stone-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-2/3 bg-stone-100 rounded" />
            </div>
          </div>

          {/* Pickups card */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="h-6 w-40 bg-blue-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-blue-100 rounded" />
              <div className="h-4 w-32 bg-blue-100 rounded" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 h-80" />
      </div>
    </div>
  )
}
