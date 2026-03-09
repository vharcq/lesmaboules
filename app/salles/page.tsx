'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Salle } from '@/lib/types'
import Modal from '@/components/Modal'
import { Plus, Pencil, Trash2, Building2, Users } from 'lucide-react'

const EMPTY: Omit<Salle, 'id'> = { nom: '', benevoles_requis: 2 }
const inputCls = "w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-600 focus:ring-2 text-sm"
const inputStyle = { background: '#0d0d0d', border: '1px solid #333' }

export default function SallesPage() {
  const { salles, addSalle, updateSalle, deleteSalle } = useStore()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Salle, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function openAdd() { setForm(EMPTY); setModal('add') }
  function openEdit(s: Salle) { setForm({ nom: s.nom, benevoles_requis: s.benevoles_requis }); setEditId(s.id); setModal('edit') }
  function closeModal() { setModal(null); setEditId(null) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') addSalle(form)
    else if (modal === 'edit' && editId) updateSalle({ ...form, id: editId })
    closeModal()
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#964d86' }}>Lieux</div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
            <Building2 size={28} style={{ color: '#964d86' }} /> Salles de spectacle
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#888' }}>{salles.length} salle{salles.length !== 1 ? 's' : ''} enregistrée{salles.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:opacity-90"
          style={{ background: '#964d86', color: '#fff' }}>
          <Plus size={18} /> Ajouter une salle
        </button>
      </div>

      {salles.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="text-6xl mb-4">🏛️</div>
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>Aucune salle pour l&apos;instant</div>
          <div className="text-sm mt-2" style={{ color: '#666' }}>Ajoutez les salles où se déroulent les spectacles</div>
        </div>
      ) : (
        <div className="grid gap-3">
          {salles.map(s => (
            <div key={s.id} className="rounded-2xl p-5 flex items-center justify-between"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: '#964d8622' }}>
                  <Building2 size={22} style={{ color: '#964d86' }} />
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">{s.nom}</div>
                  <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: '#777' }}>
                    <Users size={12} /> {s.benevoles_requis} bénévole{s.benevoles_requis > 1 ? 's' : ''} requis par représentation
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: '#888' }}><Pencil size={16} /></button>
                <button onClick={() => setConfirmDelete(s.id)} className="p-2 rounded-lg hover:bg-red-900/20" style={{ color: '#e44' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Ajouter une salle' : 'Modifier la salle'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Nom de la salle *</label>
              <input required value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
                className={inputCls} style={inputStyle} placeholder="Grande scène, Salle polyvalente..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#bbb' }}>Bénévoles requis par représentation</label>
              <div className="flex items-center gap-3">
                <input type="number" min={1} max={10} value={form.benevoles_requis}
                  onChange={e => setForm(p => ({ ...p, benevoles_requis: parseInt(e.target.value) || 2 }))}
                  className="w-24 px-4 py-2.5 rounded-xl text-white text-center text-xl font-bold"
                  style={{ background: '#0d0d0d', border: '1px solid #333' }} />
                <span className="text-sm" style={{ color: '#888' }}>personne{form.benevoles_requis > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-medium hover:opacity-90" style={{ background: '#964d86', color: '#fff' }}>
                {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Confirmer la suppression" onClose={() => setConfirmDelete(null)}>
          <p className="mb-6" style={{ color: '#aaa' }}>Supprimer cette salle ?</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
            <button onClick={() => { deleteSalle(confirmDelete); setConfirmDelete(null) }}
              className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#c0392b', color: '#fff' }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
