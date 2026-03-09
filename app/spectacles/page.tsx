'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Spectacle } from '@/lib/types'
import Modal from '@/components/Modal'
import { Plus, Pencil, Trash2, Theater, Clock, Users, Globe } from 'lucide-react'

const EMPTY: Omit<Spectacle, 'id'> = {
  titre: '', compagnie: '', pays: '', ville: '',
  nb_personnes: 2, duree_min: 60, duree_prepa_min: 30, duree_cloture_min: 15
}
const inputCls = "w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-600 focus:ring-2 text-sm"
const inputStyle = { background: '#0d0d0d', border: '1px solid #333' }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>{label}</label>
      {children}
    </div>
  )
}

export default function SpectaclesPage() {
  const { spectacles, addSpectacle, updateSpectacle, deleteSpectacle } = useStore()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Spectacle, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function openAdd() { setForm(EMPTY); setModal('add') }
  function openEdit(s: Spectacle) {
    setForm({ titre: s.titre, compagnie: s.compagnie, pays: s.pays, ville: s.ville, nb_personnes: s.nb_personnes, duree_min: s.duree_min, duree_prepa_min: s.duree_prepa_min, duree_cloture_min: s.duree_cloture_min })
    setEditId(s.id); setModal('edit')
  }
  function closeModal() { setModal(null); setEditId(null) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') addSpectacle(form)
    else if (modal === 'edit' && editId) updateSpectacle({ ...form, id: editId })
    closeModal()
  }

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [field]: e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#ff9722' }}>Programme</div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
            <Theater size={28} style={{ color: '#ff9722' }} /> Spectacles
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#888' }}>{spectacles.length} spectacle{spectacles.length !== 1 ? 's' : ''} enregistré{spectacles.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:opacity-90"
          style={{ background: '#ff9722', color: '#000' }}>
          <Plus size={18} /> Ajouter un spectacle
        </button>
      </div>

      {spectacles.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="text-6xl mb-4">🎭</div>
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>Aucun spectacle pour l&apos;instant</div>
          <div className="text-sm mt-2" style={{ color: '#666' }}>Ajoutez les spectacles présentés au festival</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {spectacles.map(s => (
            <div key={s.id} className="rounded-2xl p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold text-white text-xl" style={{ fontFamily: 'Roboto Slab, serif' }}>{s.titre}</div>
                  <div className="font-medium mt-0.5" style={{ color: '#ff9722' }}>{s.compagnie}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {(s.pays || s.ville) && (
                      <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ background: '#2a2a2a', color: '#aaa' }}>
                        <Globe size={11} /> {[s.ville, s.pays].filter(Boolean).join(', ')}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ background: '#2a2a2a', color: '#aaa' }}>
                      <Users size={11} /> {s.nb_personnes} pers.
                    </span>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ background: '#168D8F22', color: '#168D8F' }}>
                      <Clock size={11} /> {s.duree_min} min
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#2a2a2a', color: '#777' }}>
                      Prépa : {s.duree_prepa_min} min · Clôture : {s.duree_cloture_min} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: '#888' }}><Pencil size={16} /></button>
                  <button onClick={() => setConfirmDelete(s.id)} className="p-2 rounded-lg hover:bg-red-900/20" style={{ color: '#e44' }}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Ajouter un spectacle' : 'Modifier le spectacle'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Titre du spectacle *">
              <input required value={form.titre} onChange={set('titre')} className={inputCls} style={inputStyle} placeholder="Les aventures de Pinocchio" />
            </Field>
            <Field label="Compagnie *">
              <input required value={form.compagnie} onChange={set('compagnie')} className={inputCls} style={inputStyle} placeholder="Compagnie des Arts" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pays">
                <input value={form.pays} onChange={set('pays')} className={inputCls} style={inputStyle} placeholder="Belgique" />
              </Field>
              <Field label="Ville">
                <input value={form.ville} onChange={set('ville')} className={inputCls} style={inputStyle} placeholder="Bruxelles" />
              </Field>
            </div>
            <Field label="Nombre de personnes dans la compagnie">
              <input type="number" min={1} value={form.nb_personnes} onChange={set('nb_personnes')}
                className="w-24 px-4 py-2.5 rounded-xl text-white text-center font-bold" style={inputStyle} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Durée (min) *">
                <input type="number" min={1} required value={form.duree_min} onChange={set('duree_min')}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-center" style={inputStyle} />
              </Field>
              <Field label="Préparation (min)">
                <input type="number" min={0} value={form.duree_prepa_min} onChange={set('duree_prepa_min')}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-center" style={inputStyle} />
              </Field>
              <Field label="Clôture (min)">
                <input type="number" min={0} value={form.duree_cloture_min} onChange={set('duree_cloture_min')}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-center" style={inputStyle} />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-medium hover:opacity-90" style={{ background: '#ff9722', color: '#000' }}>
                {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Confirmer la suppression" onClose={() => setConfirmDelete(null)}>
          <p className="mb-6" style={{ color: '#aaa' }}>Supprimer ce spectacle ?</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
            <button onClick={() => { deleteSpectacle(confirmDelete); setConfirmDelete(null) }}
              className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#c0392b', color: '#fff' }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
