'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Settings } from 'lucide-react'

const inputCls = "px-4 py-2.5 rounded-xl text-white focus:ring-2 text-sm"
const inputStyle = { background: '#0d0d0d', border: '1px solid #333' }

export default function ParametresPage() {
  const { settings, setSettings } = useStore()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(settings) }, [settings])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#888' }}>Configuration</div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
          <Settings size={28} style={{ color: '#888' }} /> Paramètres du festival
        </h1>
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Nom du festival</label>
            <input value={form.festival_nom} onChange={e => setForm(p => ({ ...p, festival_nom: e.target.value }))}
              className={`w-full ${inputCls}`} style={inputStyle} placeholder="MaBoule à Genappe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Date de début</label>
            <input type="date" value={form.festival_date_debut} onChange={e => setForm(p => ({ ...p, festival_date_debut: e.target.value }))}
              className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#bbb' }}>Nombre de jours</label>
            <div className="flex items-center gap-3">
              <input type="number" min={1} max={14} value={form.festival_nb_jours}
                onChange={e => setForm(p => ({ ...p, festival_nb_jours: parseInt(e.target.value) || 1 }))}
                className="w-20 px-4 py-2.5 rounded-xl text-white text-center text-xl font-bold" style={inputStyle} />
              <span className="text-sm" style={{ color: '#888' }}>jour{form.festival_nb_jours > 1 ? 's' : ''}</span>
            </div>
          </div>

          <button type="submit"
            className="w-full px-4 py-3 rounded-xl font-medium transition-all hover:opacity-90"
            style={{ background: saved ? '#168D8F' : '#b2cc46', color: '#111' }}>
            {saved ? '✓ Enregistré !' : 'Enregistrer les paramètres'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl p-5" style={{ background: '#c0392b18', border: '1px solid #c0392b44' }}>
        <div className="font-semibold mb-2" style={{ color: '#e74c3c', fontFamily: 'Roboto Slab, serif' }}>⚠️ Zone de danger</div>
        <p className="text-sm mb-3" style={{ color: '#aaa' }}>Supprimer toutes les données (bénévoles, spectacles, agenda...)</p>
        <button
          onClick={() => {
            if (confirm('Êtes-vous certain de vouloir supprimer TOUTES les données ?')) {
              ['benevoles', 'salles', 'spectacles', 'representations', 'disponibilites', 'assignments'].forEach(k =>
                localStorage.removeItem(`maboulefest_${k}`)
              )
              window.location.reload()
            }
          }}
          className="px-4 py-2.5 rounded-xl font-medium text-sm transition-colors hover:opacity-90"
          style={{ background: '#c0392b', color: '#fff' }}>
          Réinitialiser toutes les données
        </button>
      </div>
    </div>
  )
}
