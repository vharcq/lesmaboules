'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import {
  Benevole, Salle, Spectacle, Representation,
  Disponibilite, Assignment, Settings
} from './types'

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

const DEFAULT_SETTINGS: Settings = {
  festival_nom: 'MaBoule à Genappe',
  festival_date_debut: '2025-08-14',
  festival_nb_jours: 5,
}

interface StoreCtx {
  settings: Settings
  setSettings: (s: Settings) => void

  benevoles: Benevole[]
  addBenevole: (b: Omit<Benevole, 'id'>) => void
  updateBenevole: (b: Benevole) => void
  deleteBenevole: (id: string) => void

  salles: Salle[]
  addSalle: (s: Omit<Salle, 'id'>) => void
  updateSalle: (s: Salle) => void
  deleteSalle: (id: string) => void

  spectacles: Spectacle[]
  addSpectacle: (s: Omit<Spectacle, 'id'>) => void
  updateSpectacle: (s: Spectacle) => void
  deleteSpectacle: (id: string) => void

  representations: Representation[]
  addRepresentation: (r: Omit<Representation, 'id'>) => void
  updateRepresentation: (r: Representation) => void
  deleteRepresentation: (id: string) => void

  disponibilites: Disponibilite[]
  toggleDisponibilite: (benevole_id: string, date: string, periode: Disponibilite['periode']) => void
  isDisponible: (benevole_id: string, date: string, periode: Disponibilite['periode']) => boolean

  assignments: Assignment[]
  addAssignment: (representation_id: string, benevole_id: string) => void
  removeAssignment: (representation_id: string, benevole_id: string) => void
  getAssignedBenevoles: (representation_id: string) => Benevole[]

  festivalDays: string[]
}

const StoreContext = createContext<StoreCtx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)
  const [benevoles, setBenevoles] = useState<Benevole[]>([])
  const [salles, setSalles] = useState<Salle[]>([])
  const [spectacles, setSpectacles] = useState<Spectacle[]>([])
  const [representations, setRepresentations] = useState<Representation[]>([])
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSettingsState(load('maboulefest_settings', DEFAULT_SETTINGS))
    setBenevoles(load('maboulefest_benevoles', []))
    setSalles(load('maboulefest_salles', []))
    setSpectacles(load('maboulefest_spectacles', []))
    setRepresentations(load('maboulefest_representations', []))
    setDisponibilites(load('maboulefest_disponibilites', []))
    setAssignments(load('maboulefest_assignments', []))
    setLoaded(true)
  }, [])

  useEffect(() => { if (loaded) save('maboulefest_settings', settings) }, [settings, loaded])
  useEffect(() => { if (loaded) save('maboulefest_benevoles', benevoles) }, [benevoles, loaded])
  useEffect(() => { if (loaded) save('maboulefest_salles', salles) }, [salles, loaded])
  useEffect(() => { if (loaded) save('maboulefest_spectacles', spectacles) }, [spectacles, loaded])
  useEffect(() => { if (loaded) save('maboulefest_representations', representations) }, [representations, loaded])
  useEffect(() => { if (loaded) save('maboulefest_disponibilites', disponibilites) }, [disponibilites, loaded])
  useEffect(() => { if (loaded) save('maboulefest_assignments', assignments) }, [assignments, loaded])

  const setSettings = useCallback((s: Settings) => setSettingsState(s), [])

  // Benevoles
  const addBenevole = useCallback((b: Omit<Benevole, 'id'>) => setBenevoles(p => [...p, { ...b, id: uid() }]), [])
  const updateBenevole = useCallback((b: Benevole) => setBenevoles(p => p.map(x => x.id === b.id ? b : x)), [])
  const deleteBenevole = useCallback((id: string) => setBenevoles(p => p.filter(x => x.id !== id)), [])

  // Salles
  const addSalle = useCallback((s: Omit<Salle, 'id'>) => setSalles(p => [...p, { ...s, id: uid() }]), [])
  const updateSalle = useCallback((s: Salle) => setSalles(p => p.map(x => x.id === s.id ? s : x)), [])
  const deleteSalle = useCallback((id: string) => setSalles(p => p.filter(x => x.id !== id)), [])

  // Spectacles
  const addSpectacle = useCallback((s: Omit<Spectacle, 'id'>) => setSpectacles(p => [...p, { ...s, id: uid() }]), [])
  const updateSpectacle = useCallback((s: Spectacle) => setSpectacles(p => p.map(x => x.id === s.id ? s : x)), [])
  const deleteSpectacle = useCallback((id: string) => setSpectacles(p => p.filter(x => x.id !== id)), [])

  // Representations
  const addRepresentation = useCallback((r: Omit<Representation, 'id'>) => setRepresentations(p => [...p, { ...r, id: uid() }]), [])
  const updateRepresentation = useCallback((r: Representation) => setRepresentations(p => p.map(x => x.id === r.id ? r : x)), [])
  const deleteRepresentation = useCallback((id: string) => setRepresentations(p => p.filter(x => x.id !== id)), [])

  // Disponibilites
  const toggleDisponibilite = useCallback((benevole_id: string, date: string, periode: Disponibilite['periode']) => {
    setDisponibilites(p => {
      const exists = p.find(d => d.benevole_id === benevole_id && d.date === date && d.periode === periode)
      if (exists) return p.filter(d => d.id !== exists.id)
      return [...p, { id: uid(), benevole_id, date, periode }]
    })
  }, [])
  const isDisponible = useCallback((benevole_id: string, date: string, periode: Disponibilite['periode']) => {
    return disponibilites.some(d => d.benevole_id === benevole_id && d.date === date && d.periode === periode)
  }, [disponibilites])

  // Assignments
  const addAssignment = useCallback((representation_id: string, benevole_id: string) => {
    setAssignments(p => {
      if (p.some(a => a.representation_id === representation_id && a.benevole_id === benevole_id)) return p
      return [...p, { id: uid(), representation_id, benevole_id }]
    })
  }, [])
  const removeAssignment = useCallback((representation_id: string, benevole_id: string) => {
    setAssignments(p => p.filter(a => !(a.representation_id === representation_id && a.benevole_id === benevole_id)))
  }, [])
  const getAssignedBenevoles = useCallback((representation_id: string) => {
    const ids = assignments.filter(a => a.representation_id === representation_id).map(a => a.benevole_id)
    return benevoles.filter(b => ids.includes(b.id))
  }, [assignments, benevoles])

  // Festival days
  const festivalDays = (() => {
    const days: string[] = []
    const start = new Date(settings.festival_date_debut)
    for (let i = 0; i < settings.festival_nb_jours; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d.toISOString().slice(0, 10))
    }
    return days
  })()

  return (
    <StoreContext.Provider value={{
      settings, setSettings,
      benevoles, addBenevole, updateBenevole, deleteBenevole,
      salles, addSalle, updateSalle, deleteSalle,
      spectacles, addSpectacle, updateSpectacle, deleteSpectacle,
      representations, addRepresentation, updateRepresentation, deleteRepresentation,
      disponibilites, toggleDisponibilite, isDisponible,
      assignments, addAssignment, removeAssignment, getAssignedBenevoles,
      festivalDays,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
