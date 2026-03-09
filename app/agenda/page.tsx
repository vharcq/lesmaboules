'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Representation } from '@/lib/types'
import Modal from '@/components/Modal'
import { CalendarDays, Plus, Trash2, Clock, MapPin } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const REP_COLORS = [
  { bg: '#168D8F22', border: '#168D8F55', text: '#168D8F', badge: '#168D8F' },
  { bg: '#ff972222', border: '#ff972255', text: '#ff9722', badge: '#ff9722' },
  { bg: '#964d8622', border: '#964d8655', text: '#b06cc0', badge: '#964d86' },
  { bg: '#b2cc4622', border: '#b2cc4655', text: '#b2cc46', badge: '#b2cc46' },
]

const inputStyle = { background: '#0d0d0d', border: '1px solid #333' }
const selectCls = "w-full px-4 py-2.5 rounded-xl text-white focus:ring-2 text-sm"

export default function AgendaPage() {
  const { festivalDays, salles, spectacles, representations, addRepresentation, deleteRepresentation } = useStore()
  const [selectedDay, setSelectedDay] = useState(0)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ spectacle_id: '', salle_id: '', heure_debut: '10:00' })
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const currentDay = festivalDays[selectedDay] ?? ''
  const repsOfDay = representations
    .filter(r => r.date === currentDay)
    .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))

  function openModal() {
    setForm({ spectacle_id: spectacles[0]?.id ?? '', salle_id: salles[0]?.id ?? '', heure_debut: '10:00' })
    setModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.spectacle_id || !form.salle_id) return
    addRepresentation({ ...form, date: currentDay })
    setModal(false)
  }

  function heureArrivee(heure: string, spectacle_id: string) {
    const spec = spectacles.find(s => s.id === spectacle_id)
    if (!spec || !heure) return heure
    const [h, m] = heure.split(':').map(Number)
    const total = h * 60 + m - spec.duree_prepa_min
    return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
  }

  function heureFin(heure: string, spectacle_id: string) {
    const spec = spectacles.find(s => s.id === spectacle_id)
    if (!spec || !heure) return heure
    const [h, m] = heure.split(':').map(Number)
    const total = h * 60 + m + spec.duree_min + spec.duree_cloture_min
    return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
  }

  if (festivalDays.length === 0) return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Slab, serif' }}>📅 Agenda</h1>
      <div className="rounded-2xl p-6" style={{ background: '#ff972222', border: '1px solid #ff972244', color: '#ff9722' }}>
        ⚙️ Configurez d&apos;abord les dates dans <a href="/parametres" className="underline font-medium">Paramètres</a>.
      </div>
    </div>
  )

  if (salles.length === 0 || spectacles.length === 0) return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Slab, serif' }}>📅 Agenda</h1>
      <div className="rounded-2xl p-6" style={{ background: '#ff972222', border: '1px solid #ff972244', color: '#ff9722' }}>
        ⚠️ Ajoutez d&apos;abord des <a href="/salles" className="underline">salles</a> et des <a href="/spectacles" className="underline">spectacles</a>.
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#b2cc46' }}>Planning</div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
            <CalendarDays size={28} style={{ color: '#b2cc46' }} /> Agenda du festival
          </h1>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:opacity-90"
          style={{ background: '#b2cc46', color: '#111' }}>
          <Plus size={18} /> Ajouter une représentation
        </button>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {festivalDays.map((day, i) => (
          <button key={day} onClick={() => setSelectedDay(i)}
            className="px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all"
            style={i === selectedDay
              ? { background: '#b2cc46', color: '#111' }
              : { background: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }
            }
          >
            <div className="font-semibold capitalize">{format(parseISO(day), 'EEEE', { locale: fr })}</div>
            <div className="text-xs opacity-75">{format(parseISO(day), 'd MMM', { locale: fr })}</div>
          </button>
        ))}
      </div>

      {repsOfDay.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="text-6xl mb-4">📅</div>
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>Aucune représentation ce jour</div>
          <div className="text-sm mt-2" style={{ color: '#666' }}>Cliquez sur &quot;Ajouter une représentation&quot;</div>
        </div>
      ) : (
        <div className="space-y-3">
          {repsOfDay.map((r, idx) => {
            const spec = spectacles.find(s => s.id === r.spectacle_id)
            const salle = salles.find(s => s.id === r.salle_id)
            const c = REP_COLORS[idx % REP_COLORS.length]
            return (
              <div key={r.id} className="rounded-2xl p-5" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-xl text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>{spec?.titre ?? '?'}</div>
                    <div className="font-medium text-sm mt-0.5" style={{ color: c.text }}>{spec?.compagnie}</div>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-sm text-white font-medium">
                        <MapPin size={13} style={{ color: c.text }} /> {salle?.nom ?? '?'}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-white">
                        <Clock size={13} style={{ color: c.text }} /> Début : <strong>{r.heure_debut}</strong>
                      </span>
                      {spec && (
                        <>
                          <span className="text-sm" style={{ color: '#aaa' }}>
                            Arrivée bénévoles : <strong className="text-white">{heureArrivee(r.heure_debut, r.spectacle_id)}</strong>
                          </span>
                          <span className="text-sm" style={{ color: '#aaa' }}>
                            Fin : <strong className="text-white">{heureFin(r.heure_debut, r.spectacle_id)}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setConfirmDelete(r.id)} className="p-2 rounded-lg ml-4 hover:bg-white/5" style={{ color: '#e44' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <Modal title={`Nouvelle représentation · ${format(parseISO(currentDay), 'EEEE d MMMM', { locale: fr })}`} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Spectacle *</label>
              <select required value={form.spectacle_id} onChange={e => setForm(p => ({ ...p, spectacle_id: e.target.value }))}
                className={selectCls} style={inputStyle}>
                <option value="">Choisir un spectacle...</option>
                {spectacles.map(s => <option key={s.id} value={s.id}>{s.titre} — {s.compagnie}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Salle *</label>
              <select required value={form.salle_id} onChange={e => setForm(p => ({ ...p, salle_id: e.target.value }))}
                className={selectCls} style={inputStyle}>
                <option value="">Choisir une salle...</option>
                {salles.map(s => <option key={s.id} value={s.id}>{s.nom} ({s.benevoles_requis} bénévoles)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Heure de début *</label>
              <input required type="time" value={form.heure_debut} onChange={e => setForm(p => ({ ...p, heure_debut: e.target.value }))}
                className="px-4 py-2.5 rounded-xl text-white text-xl font-bold" style={inputStyle} />
            </div>
            {form.spectacle_id && form.heure_debut && (
              <div className="rounded-xl p-3 text-sm" style={{ background: '#b2cc4622', border: '1px solid #b2cc4644', color: '#b2cc46' }}>
                ✅ Les bénévoles devront arriver à <strong>{heureArrivee(form.heure_debut, form.spectacle_id)}</strong>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(false)} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-medium hover:opacity-90" style={{ background: '#b2cc46', color: '#111' }}>Planifier</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Supprimer cette représentation ?" onClose={() => setConfirmDelete(null)}>
          <p className="mb-6" style={{ color: '#aaa' }}>Cette représentation et ses assignations seront supprimées.</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
            <button onClick={() => { deleteRepresentation(confirmDelete); setConfirmDelete(null) }}
              className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#c0392b', color: '#fff' }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
