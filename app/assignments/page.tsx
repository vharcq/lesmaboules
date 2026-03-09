'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { UserCheck, ChevronDown, ChevronUp, Clock, MapPin, Users, Plus, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Disponibilite } from '@/lib/types'

function getPeriodeForHour(heure: string): Disponibilite['periode'] {
  const h = parseInt(heure.split(':')[0])
  if (h < 13) return 'matin'
  if (h < 19) return 'apm'
  return 'soir'
}

export default function AssignmentsPage() {
  const {
    festivalDays, salles, spectacles, representations,
    benevoles, assignments, addAssignment, removeAssignment, isDisponible
  } = useStore()
  const [openRep, setOpenRep] = useState<string | null>(null)

  const repsSorted = [...representations].sort((a, b) =>
    a.date !== b.date ? a.date.localeCompare(b.date) : a.heure_debut.localeCompare(b.heure_debut)
  )

  if (representations.length === 0) return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Slab, serif' }}>👤 Assignations</h1>
      <div className="rounded-2xl p-6" style={{ background: '#ff972222', border: '1px solid #ff972244', color: '#ff9722' }}>
        ⚠️ Planifiez d&apos;abord des représentations dans <a href="/agenda" className="underline">l&apos;Agenda</a>.
      </div>
    </div>
  )

  // Group by date
  const byDate = festivalDays.reduce((acc, day) => {
    const reps = repsSorted.filter(r => r.date === day)
    if (reps.length > 0) acc[day] = reps
    return acc
  }, {} as Record<string, typeof repsSorted>)

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#964d86' }}>Équipes</div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
          <UserCheck size={28} style={{ color: '#964d86' }} /> Assignations
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#888' }}>Associez les bénévoles disponibles aux représentations</p>
      </div>

      {Object.entries(byDate).map(([day, reps]) => (
        <div key={day} className="mb-6">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 capitalize" style={{ color: '#666' }}>
            {format(parseISO(day), 'EEEE d MMMM', { locale: fr })}
          </div>
          <div className="space-y-3">
            {reps.map(r => {
              const spec = spectacles.find(s => s.id === r.spectacle_id)
              const salle = salles.find(s => s.id === r.salle_id)
              const assigned = assignments.filter(a => a.representation_id === r.id).map(a => benevoles.find(b => b.id === a.benevole_id)).filter(Boolean)
              const required = salle?.benevoles_requis ?? 2
              const ok = assigned.length >= required
              const isOpen = openRep === r.id

              const periode = getPeriodeForHour(r.heure_debut)
              const availableUnassigned = benevoles
                .filter(b => isDisponible(b.id, r.date, periode) && !assigned.find(a => a?.id === b.id))
                .sort((a, b) => {
                  const la = assignments.filter(x => x.benevole_id === a.id).length
                  const lb = assignments.filter(x => x.benevole_id === b.id).length
                  return la - lb
                })

              return (
                <div key={r.id} className="rounded-2xl overflow-hidden" style={{ background: '#1a1a1a', border: `2px solid ${ok ? '#168D8F44' : '#ff972244'}` }}>
                  <button onClick={() => setOpenRep(isOpen ? null : r.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-lg" style={{ fontFamily: 'Roboto Slab, serif' }}>{spec?.titre ?? '?'}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={ok
                            ? { background: '#168D8F22', color: '#168D8F' }
                            : { background: '#ff972222', color: '#ff9722' }
                          }>
                          {assigned.length}/{required} bénévoles {ok ? '✓' : '⚠️'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#777' }}>
                        <span className="flex items-center gap-1"><Clock size={12} /> {r.heure_debut}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {salle?.nom ?? '?'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex -space-x-2">
                        {assigned.slice(0, 4).map(b => b && (
                          <div key={b.id} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                            style={{ background: '#964d86', color: '#fff', borderColor: '#1a1a1a', fontFamily: 'Roboto Slab, serif' }}>
                            {b.prenom[0]}{b.nom[0]}
                          </div>
                        ))}
                      </div>
                      {isOpen ? <ChevronUp size={18} style={{ color: '#555' }} /> : <ChevronDown size={18} style={{ color: '#555' }} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5" style={{ borderTop: '1px solid #2a2a2a' }}>
                      <div className="mt-4">
                        <div className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: '#666' }}>
                          <Users size={12} /> Bénévoles assignés
                        </div>
                        {assigned.length === 0 ? (
                          <div className="text-sm italic" style={{ color: '#555' }}>Aucun bénévole assigné</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {assigned.map(b => b && (
                              <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                                style={{ background: '#964d8622', color: '#b06cc0', border: '1px solid #964d8644' }}>
                                <span>{b.prenom} {b.nom}</span>
                                <button onClick={() => removeAssignment(r.id, b.id)} className="hover:text-red-400 transition-colors">
                                  <X size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {availableUnassigned.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: '#666' }}>
                            <Plus size={12} /> Disponibles ce créneau
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {availableUnassigned.map(b => {
                              const nb = assignments.filter(a => a.benevole_id === b.id).length
                              return (
                                <button key={b.id} onClick={() => addAssignment(r.id, b.id)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                                  style={{ background: '#168D8F22', color: '#168D8F', border: '1px solid #168D8F44' }}>
                                  <Plus size={12} />
                                  {b.prenom} {b.nom}
                                  <span className="text-xs px-1.5 rounded-full" style={{ background: '#168D8F44' }}>{nb}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {availableUnassigned.length === 0 && assigned.length < required && (
                        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: '#ff972222', color: '#ff9722' }}>
                          ⚠️ Aucun bénévole disponible ({periode}). Vérifiez les <a href="/disponibilites" className="underline">disponibilités</a>.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
