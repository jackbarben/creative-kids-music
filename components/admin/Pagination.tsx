import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []

  // Always show first page
  pages.push(1)

  // Add ellipsis or pages around current
  if (currentPage > 3) {
    pages.push('ellipsis')
  }

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis')
  }

  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages)
  }

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, 'http://placeholder')
    url.searchParams.set('page', String(page))
    return `${url.pathname}${url.search}`
  }

  return (
    <nav className="flex items-center justify-between border-t border-stone-200 pt-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-stone-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-1">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded"
          >
            ← Prev
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-sm text-stone-300">← Prev</span>
        )}

        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-stone-400">
                ...
              </span>
            )
          }

          const isActive = page === currentPage
          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`px-3 py-1.5 text-sm rounded ${
                isActive
                  ? 'bg-forest-600 text-white'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
              }`}
            >
              {page}
            </Link>
          )
        })}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded"
          >
            Next →
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-sm text-stone-300">Next →</span>
        )}
      </div>
    </nav>
  )
}
