/**
 * Program constants - centralized source of truth for dates, prices, etc.
 * Update these when program details change.
 */

export const PROGRAMS = {
  workshops: {
    name: 'Winter/Spring Music Workshop',
    season: 'Winter/Spring 2026',
    dates: [
      new Date('2026-02-20'),
      new Date('2026-03-20'),
      new Date('2026-05-01'),
    ],
    time: '3:30 PM – 7:30 PM',
    pricePerWorkshop: 7500, // cents ($75)
    ages: '9-13',
    location: "St. Luke's / San Lucas Episcopal Church",
    address: '426 E Fourth Plain Blvd, Vancouver, WA 98663',
  },
  camp: {
    name: 'Summer Camp 2026',
    season: 'Summer 2026',
    startDate: new Date('2026-08-03T00:00:00-08:00'),
    endDate: new Date('2026-08-07T23:59:59-08:00'),
    displayDates: 'August 3–7, 2026',
    performanceDate: new Date('2026-08-09'),
    performanceDisplay: 'August 9, 9–11 AM',
    time: '8:30 AM – 5:00 PM',
    price: 40000, // cents ($400)
    ages: '9-13',
    location: "St. Luke's / San Lucas Episcopal Church",
    address: '426 E Fourth Plain Blvd, Vancouver, WA 98663',
  },
  musicSchool: {
    name: 'Music School',
    season: 'Fall 2026',
    startDate: new Date('2026-09-01'),
    status: 'waitlist', // 'waitlist' | 'registration' | 'closed'
  },
} as const

// Pricing
export const SIBLING_DISCOUNT = 1000 // cents ($10)
export const MAX_SIBLING_DISCOUNT = 3000 // cents ($30)

/**
 * Check if a program has started (used to disable editing)
 */
export function isProgramStarted(programType: 'workshop' | 'camp', workshopDates?: Date[]): boolean {
  const now = new Date()

  if (programType === 'camp') {
    return now >= PROGRAMS.camp.startDate
  }

  if (programType === 'workshop' && workshopDates && workshopDates.length > 0) {
    const earliestWorkshop = new Date(Math.min(...workshopDates.map(d => d.getTime())))
    return now >= earliestWorkshop
  }

  return false
}

/**
 * Calculate sibling discount
 */
export function calculateSiblingDiscount(childCount: number): number {
  if (childCount <= 1) return 0
  const discount = (childCount - 1) * SIBLING_DISCOUNT
  return Math.min(discount, MAX_SIBLING_DISCOUNT)
}
