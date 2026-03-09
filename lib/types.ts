export interface Benevole {
  id: string
  prenom: string
  nom: string
  gsm: string
  email: string
}

export interface Salle {
  id: string
  nom: string
  benevoles_requis: number
}

export interface Spectacle {
  id: string
  titre: string
  compagnie: string
  pays: string
  ville: string
  nb_personnes: number
  duree_min: number
  duree_prepa_min: number
  duree_cloture_min: number
}

export interface Representation {
  id: string
  spectacle_id: string
  salle_id: string
  date: string       // YYYY-MM-DD
  heure_debut: string // HH:MM
}

export interface Disponibilite {
  id: string
  benevole_id: string
  date: string // YYYY-MM-DD
  periode: 'matin' | 'apm' | 'soir'
}

export interface Assignment {
  id: string
  representation_id: string
  benevole_id: string
}

export interface Settings {
  festival_nom: string
  festival_date_debut: string // YYYY-MM-DD
  festival_nb_jours: number
}
