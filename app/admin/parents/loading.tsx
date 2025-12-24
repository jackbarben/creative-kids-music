export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-32 bg-stone-200 rounded animate-pulse mb-2" />
        <div className="h-8 w-48 bg-stone-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-stone-200 rounded animate-pulse" />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="h-10 bg-stone-100 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
