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
          {/* Parent info card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="h-6 w-32 bg-stone-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-3/4 bg-stone-100 rounded" />
            </div>
          </div>

          {/* Child info card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="h-6 w-32 bg-stone-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-2/3 bg-stone-100 rounded" />
            </div>
          </div>

          {/* Message card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <div className="h-6 w-24 bg-stone-200 rounded mb-4" />
            <div className="h-20 w-full bg-stone-100 rounded" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 h-64" />
      </div>
    </div>
  )
}
