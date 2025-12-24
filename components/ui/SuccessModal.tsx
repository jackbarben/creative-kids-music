'use client'

import { useEffect, useRef, useId } from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Success',
  message,
}: SuccessModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
      // Focus the OK button when dialog opens
      buttonRef.current?.focus()
    } else {
      dialog.close()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-transparent backdrop:bg-black/50 rounded-2xl"
      onCancel={onClose}
      aria-labelledby={titleId}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2
          id={titleId}
          className="font-display text-xl font-semibold text-slate-800 mb-2"
        >
          {title}
        </h2>
        <p className="text-slate-600 mb-6">{message}</p>

        <button
          ref={buttonRef}
          onClick={onClose}
          className="w-full px-6 py-3 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
        >
          OK
        </button>
      </div>
    </dialog>
  )
}
