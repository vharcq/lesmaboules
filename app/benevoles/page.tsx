'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Benevole } from '@/lib/types'
import Modal from '@/components/Modal'
import { Plus, Pencil, Trash2, Phone, Mail, Users } from 'lucide-react'

const EMPTY: Omit<Benevole, 'id'> = { prenom: '', nom: '', gsm: '', email: '' }

const inputCls = "w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-teal-500 text-sm"
const inputStyle = { background: '#0d0d0d', border: '1px solid #333' }

export default function BenevolesPage() {
  const { benevoles, addBenevole, updateBenevole, deleteBenevole } = useStore()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Benevole, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = benevoles.filter(b =>
    `${b.prenom} ${b.nom} ${b.email}`.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setForm(EMPTY); setModal('add') }
  function openEdit(b: Benevole) { setForm({ prenom: b.prenom, nom: b.nom, gsm: b.gsm, email: b.email }); setEditId(b.id); setModal('edit') }
  function closeModal() { setModal(null); setEditId(null) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') addBenevole(form)
    else if (modal === 'edit' && editId) updateBenevole({ ...form, id: editId })
    closeModal()
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#168D8F' }}>Gestion</div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Roboto Slab, serif' }}>
            <Users size={28} style={{ color: '#168D8F' }} /> Bénévoles
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#888' }}>{benevoles.length} bénévole{benevoles.length !== 1 ? 's' : ''} enregistré{benevoles.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ background: '#168D8F', color: '#fff' }}>
          <Plus size={18} /> Ajouter un bénévole
        </button>
      </div>

      {benevoles.length > 3 && (
        <input type="search" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:ring-2"
          style={{ background: '#1a1a1a', border: '1px solid #333' }} />
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="text-6xl mb-4">👥</div>
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>Aucun bénévole pour l&apos;instant</div>
          <div className="text-sm mt-2" style={{ color: '#666' }}>Cliquez sur &quot;Ajouter un bénévole&quot; pour commencer</div>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(b => (
            <div key={b.id} className="rounded-2xl p-5 flex items-center justify-between transition-all hover:border-teal-800"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: '#168D8F22', color: '#168D8F', fontFamily: 'Roboto Slab, serif' }}>
                  {b.prenom[0]}{b.nom[0]}
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">{b.prenom} {b.nom}</div>
                  <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#777' }}>
                    {b.gsm && <span className="flex items-center gap-1"><Phone size={12} /> {b.gsm}</span>}
                    {b.email && <span className="flex items-center gap-1"><Mail size={12} /> {b.email}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(b)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: '#888' }}><Pencil size={16} /></button>
                <button onClick={() => setConfirmDelete(b.id)} className="p-2 rounded-lg transition-colors hover:bg-red-900/20" style={{ color: '#e44' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Ajouter un bénévole' : 'Modifier le bénévole'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Prénom *</label>
                <input required value={form.prenom} onChange={e => setForm(p => ({ ...p, prenom: e.target.value }))}
                  className={inputCls} style={inputStyle} placeholder="Marie" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Nom *</label>
                <input required value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
                  className={inputCls} style={inputStyle} placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>GSM</label>
              <input value={form.gsm} onChange={e => setForm(p => ({ ...p, gsm: e.target.value }))}
                className={inputCls} style={inputStyle} placeholder="0470 12 34 56" type="tel" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#bbb' }}>Email</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={inputCls} style={inputStyle} placeholder="marie.dupont@email.com" type="email" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors"
                style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-medium transition-all hover:opacity-90"
                style={{ background: '#168D8F', color: '#fff' }}>
                {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Confirmer la suppression" onClose={() => setConfirmDelete(null)}>
          <p className="mb-6" style={{ color: '#aaa' }}>Êtes-vous sûr de vouloir supprimer ce bénévole ?</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#2a2a2a', color: '#aaa' }}>Annuler</button>
            <button onClick={() => { deleteBenevole(confirmDelete); setConfirmDelete(null) }}
              className="flex-1 px-4 py-3 rounded-xl font-medium" style={{ background: '#c0392b', color: '#fff' }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
