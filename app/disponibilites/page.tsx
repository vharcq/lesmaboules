'use client'

import { useStore } from '@/lib/store'
import { CheckSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Disponibilite } from '@/lib/types'

const PERIODES: { key: Disponibilite['periode']; label: string; color: string; dim: string }[] = [
  { key: 'matin', label: 'Matin', color: '#ff9722', dim: '#ff972244' },
  { key: 'apm', label: 'A-midi', color: '#168D8F', dim: '#168D8F44' },
  { key: 'soir', label: 'Soir', color: '#964d86', dim: '#964d8644' },
]

export default function DisponibilitesPage() {
  const { benevoles, festivalDays, toggleDisponibilite, isDisponible } = useStore()

  const totalCols = festivalDays.length * PERIODES.length
  const totalChecked = benevoles.reduce((acc, b) =>
    acc + festivalDays.reduce((a2, d) =>
      a2 + PERIODES.filter(p => isDisponible(b.id, d, p.key)).length, 0
    ), 0)

  if (festivalDays.length === 0) return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Slab, serif' }}>✅ Disponibilités</h1>
      <div className="rounded-2xl p-6" style={{ background: '#ff972222', border: '1px solid #ff972244', color: '#ff9722' }}>
        ⚙️ Configurez d&apos;abord les dates dans <a href="/parametres" className="underline">Paramètres</a>.
      </div>
    </div>
  )

  if (benevoles.length === 0) return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Slab, serif' }}>✅ Disponibilités</h1>
      <div className="rounded-2xl p-6" style={{ background: '#ff972222', border: '1px solid #ff972244', color: '#ff9722' }}>
        ⚠️ Ajoutez d&apos;abord des <a href="/benevoles" className="underline">bénévoles</a>.
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#168D8F' }}>Planification</div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
            <CheckSquare size={28} style={{ color: '#168D8F' }} /> Disponibilités
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#888' }}>Cochez les créneaux où chaque bénévole est disponible</p>
        </div>
        {totalChecked > 0 && (
          <div className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: '#168D8F22', color: '#168D8F', border: '1px solid #168D8F44' }}>
            {totalChecked} créneau{totalChecked > 1 ? 'x' : ''} saisi{totalChecked > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="rounded-2xl overflow-x-auto shadow-2xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              <th className="text-left px-5 py-4 text-sm font-semibold sticky left-0 z-10 w-40" style={{ color: '#888', background: '#1a1a1a' }}>
                Bénévole
              </th>
              {festivalDays.map(day => (
                PERIODES.map(p => (
                  <th key={`${day}-${p.key}`} className="px-2 py-3 text-center min-w-[72px]">
                    <div className="text-xs capitalize" style={{ color: '#666' }}>{format(parseISO(day), 'EEE d', { locale: fr })}</div>
                    <div className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: p.dim, color: p.color }}>{p.label}</div>
                  </th>
                ))
              ))}
              <th className="px-3 py-4 text-center text-xs font-semibold" style={{ color: '#666' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {benevoles.map((b, bi) => {
              const total = festivalDays.reduce((acc, d) =>
                acc + PERIODES.filter(p => isDisponible(b.id, d, p.key)).length, 0)
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid #222', background: bi % 2 === 0 ? '#1a1a1a' : '#161616' }}>
                  <td className="px-5 py-4 sticky left-0 z-10" style={{ background: bi % 2 === 0 ? '#1a1a1a' : '#161616' }}>
                    <div className="font-medium text-white">{b.prenom} {b.nom}</div>
                    {b.gsm && <div className="text-xs" style={{ color: '#555' }}>{b.gsm}</div>}
                  </td>
                  {festivalDays.map(day => (
                    PERIODES.map(p => {
                      const checked = isDisponible(b.id, day, p.key)
                      return (
                        <td key={`${day}-${p.key}`} className="px-2 py-4 text-center">
                          <button
                            onClick={() => toggleDisponibilite(b.id, day, p.key)}
                            className="w-9 h-9 rounded-xl transition-all text-base font-bold"
                            style={checked
                              ? { background: p.color, color: '#111', transform: 'scale(1.1)', border: 'none' }
                              : { background: 'transparent', border: `2px solid #333`, color: 'transparent' }
                            }
                            title={checked ? 'Disponible · cliquer pour retirer' : 'Non disponible · cliquer pour ajouter'}
                          >
                            ✓
                          </button>
                        </td>
                      )
                    })
                  ))}
                  <td className="px-3 py-4 text-center">
                    <span className="text-sm font-bold px-2 py-1 rounded-lg"
                      style={total > 0
                        ? { background: '#168D8F22', color: '#168D8F' }
                        : { color: '#444' }
                      }>
                      {total}/{totalCols}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm" style={{ color: '#666' }}>
        {PERIODES.map(p => (
          <div key={p.key} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg" style={{ background: p.color }} />
            <span>{p.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg border-2" style={{ borderColor: '#333' }} />
          <span>Non disponible</span>
        </div>
      </div>
    </div>
  )
}
