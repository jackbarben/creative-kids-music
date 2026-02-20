'use client'

import { useState } from 'react'
import { checkInChild, undoCheckIn, markNoShow, resetAttendance, updateAttendanceNotes } from './actions'

interface AttendanceRecord {
  id: string
  workshop_id: string
  registration_id: string
  child_id: string
  status: 'expected' | 'checked_in' | 'no_show' | 'cancelled'
  checked_in_at: string | null
  checked_in_by: string | null
  notes: string | null
  child: {
    id: string
    child_name: string
    child_age: number
    allergies: string | null
    medical_conditions: string | null
  }
  registration: {
    id: string
    parent_name: string
    parent_phone: string | null
    parent_email: string
  }
}

interface AttendanceListProps {
  workshopId: string
  attendance: AttendanceRecord[]
}

export default function AttendanceList({ workshopId, attendance }: AttendanceListProps) {
  const [filter, setFilter] = useState<'all' | 'expected' | 'checked_in' | 'no_show'>('all')
  const [loading, setLoading] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesValue, setNotesValue] = useState('')

  const filteredAttendance = attendance.filter(record => {
    if (filter === 'all') return true
    return record.status === filter
  })

  const handleCheckIn = async (childId: string) => {
    setLoading(childId)
    await checkInChild(workshopId, childId)
    setLoading(null)
  }

  const handleUndoCheckIn = async (childId: string) => {
    setLoading(childId)
    await undoCheckIn(workshopId, childId)
    setLoading(null)
  }

  const handleNoShow = async (childId: string) => {
    setLoading(childId)
    await markNoShow(workshopId, childId)
    setLoading(null)
  }

  const handleReset = async (childId: string) => {
    setLoading(childId)
    await resetAttendance(workshopId, childId)
    setLoading(null)
  }

  const handleSaveNotes = async (childId: string) => {
    setLoading(childId)
    await updateAttendanceNotes(workshopId, childId, notesValue)
    setEditingNotes(null)
    setLoading(null)
  }

  const startEditingNotes = (record: AttendanceRecord) => {
    setEditingNotes(record.child_id)
    setNotesValue(record.notes || '')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-green-100 text-green-700'
      case 'no_show':
        return 'bg-red-100 text-red-700'
      case 'cancelled':
        return 'bg-stone-100 text-stone-500'
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'Checked In'
      case 'no_show':
        return 'No Show'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Expected'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200">
      {/* Filter Tabs */}
      <div className="flex border-b border-stone-200">
        {(['all', 'expected', 'checked_in', 'no_show'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-forest-50 text-forest-700 border-b-2 border-forest-600'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab === 'all' ? 'All' : getStatusLabel(tab)}
            <span className="ml-2 text-xs">
              ({attendance.filter(r => tab === 'all' || r.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filteredAttendance.length === 0 ? (
        <div className="p-8 text-center text-stone-500">
          {filter === 'all'
            ? 'No registrations for this workshop.'
            : `No children with status "${getStatusLabel(filter)}".`}
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {filteredAttendance.map(record => (
            <div key={record.id} className="p-4 hover:bg-stone-50">
              <div className="flex items-start justify-between">
                {/* Child Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-stone-800">{record.child.child_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                    {record.checked_in_at && (
                      <span className="text-xs text-stone-400">
                        at {formatTime(record.checked_in_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-500 mt-1">
                    Age {record.child.child_age} &middot; Parent: {record.registration.parent_name}
                    {record.registration.parent_phone && (
                      <span className="ml-2 text-stone-400">{record.registration.parent_phone}</span>
                    )}
                  </p>

                  {/* Medical Alerts */}
                  {(record.child.allergies || record.child.medical_conditions) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {record.child.allergies && (
                        <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                          Allergies: {record.child.allergies}
                        </span>
                      )}
                      {record.child.medical_conditions && (
                        <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">
                          Medical: {record.child.medical_conditions}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {editingNotes === record.child_id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        placeholder="Add a note..."
                        className="flex-1 px-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:border-forest-500 focus:ring-1 focus:ring-forest-100 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNotes(record.child_id)}
                        disabled={loading === record.child_id}
                        className="px-3 py-1.5 text-sm bg-forest-600 hover:bg-forest-700 text-white rounded-lg disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotes(null)}
                        className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : record.notes ? (
                    <p
                      className="mt-2 text-sm text-stone-500 italic cursor-pointer hover:text-stone-700"
                      onClick={() => startEditingNotes(record)}
                    >
                      Note: {record.notes}
                    </p>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {record.status === 'expected' && (
                    <>
                      <button
                        onClick={() => handleCheckIn(record.child_id)}
                        disabled={loading === record.child_id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {loading === record.child_id ? '...' : 'Check In'}
                      </button>
                      <button
                        onClick={() => handleNoShow(record.child_id)}
                        disabled={loading === record.child_id}
                        className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                      >
                        No Show
                      </button>
                    </>
                  )}

                  {record.status === 'checked_in' && (
                    <button
                      onClick={() => handleUndoCheckIn(record.child_id)}
                      disabled={loading === record.child_id}
                      className="px-3 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 text-sm font-medium rounded-lg transition-colors"
                    >
                      {loading === record.child_id ? '...' : 'Undo Check-In'}
                    </button>
                  )}

                  {record.status === 'no_show' && (
                    <button
                      onClick={() => handleReset(record.child_id)}
                      disabled={loading === record.child_id}
                      className="px-3 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 text-sm font-medium rounded-lg transition-colors"
                    >
                      {loading === record.child_id ? '...' : 'Reset'}
                    </button>
                  )}

                  {/* Add Note Button */}
                  {!record.notes && editingNotes !== record.child_id && (
                    <button
                      onClick={() => startEditingNotes(record)}
                      className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Add note"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
