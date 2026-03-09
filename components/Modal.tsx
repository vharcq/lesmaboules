'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #2a2a2a' }}>
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#888' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2a2a2a')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
