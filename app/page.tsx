'use client'

import { useStore } from '@/lib/store'
import { Users, Building2, Theater, CalendarDays, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Dashboard() {
  const { settings, benevoles, salles, spectacles, representations, assignments, festivalDays } = useStore()

  const stats = [
    { label: 'Bénévoles', value: benevoles.length, icon: Users, accent: '#168D8F', href: '/benevoles' },
    { label: 'Salles', value: salles.length, icon: Building2, accent: '#964d86', href: '/salles' },
    { label: 'Spectacles', value: spectacles.length, icon: Theater, accent: '#ff9722', href: '/spectacles' },
    { label: 'Représentations', value: representations.length, icon: CalendarDays, accent: '#b2cc46', href: '/agenda' },
  ]

  const repsSansBenevoles = representations.filter(r => {
    const salle = salles.find(s => s.id === r.salle_id)
    const nb = assignments.filter(a => a.representation_id === r.id).length
    return nb < (salle?.benevoles_requis ?? 2)
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <div className="text-sm font-medium mb-2" style={{ color: '#b2cc46' }}>FESTIVAL</div>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>
          {settings.festival_nom}
        </h1>
        {festivalDays.length > 0 && (
          <p className="mt-2 text-lg" style={{ color: '#888' }}>
            Du{' '}
            <span className="text-white font-medium">{format(parseISO(festivalDays[0]), 'd MMMM yyyy', { locale: fr })}</span>
            {' '}au{' '}
            <span className="text-white font-medium">{format(parseISO(festivalDays[festivalDays.length - 1]), 'd MMMM yyyy', { locale: fr })}</span>
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, accent, href }) => (
          <Link key={label} href={href}
            className="rounded-2xl p-5 group transition-all hover:scale-105"
            style={{ background: '#1a1a1a', border: `1px solid #2a2a2a` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl" style={{ background: accent + '22' }}>
                <Icon size={20} style={{ color: accent }} />
              </div>
              <ArrowRight size={14} style={{ color: '#444' }} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-4xl font-bold text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>{value}</div>
            <div className="text-sm mt-1" style={{ color: '#888' }}>{label}</div>
          </Link>
        ))}
      </div>

      {/* Alertes */}
      {repsSansBenevoles.length > 0 && (
        <div className="rounded-2xl p-5 mb-6" style={{ background: '#ff972222', border: '1px solid #ff972244' }}>
          <div className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#ff9722', fontFamily: 'Roboto Slab, serif' }}>
            ⚠️ {repsSansBenevoles.length} représentation{repsSansBenevoles.length > 1 ? 's' : ''} sans assez de bénévoles
          </div>
          <div className="space-y-2">
            {repsSansBenevoles.slice(0, 5).map(r => {
              const spec = spectacles.find(s => s.id === r.spectacle_id)
              const salle = salles.find(s => s.id === r.salle_id)
              const nb = assignments.filter(a => a.representation_id === r.id).length
              return (
                <div key={r.id} className="text-sm" style={{ color: '#ffbb77' }}>
                  📅 {format(parseISO(r.date), 'EEEE d MMM', { locale: fr })} à {r.heure_debut} · <strong>{spec?.titre ?? '?'}</strong> ({salle?.nom ?? '?'}) · {nb}/{salle?.benevoles_requis ?? 2} bénévoles
                </div>
              )
            })}
          </div>
          <Link href="/assignments" className="inline-flex items-center gap-1 mt-3 text-sm font-medium hover:underline" style={{ color: '#ff9722' }}>
            Gérer les assignations <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Actions rapides */}
      <div className="rounded-2xl p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <h2 className="font-semibold text-white mb-4" style={{ fontFamily: 'Roboto Slab, serif' }}>Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: '/benevoles', label: '+ Ajouter un bénévole', accent: '#168D8F' },
            { href: '/spectacles', label: '+ Ajouter un spectacle', accent: '#ff9722' },
            { href: '/agenda', label: '📅 Planifier l\'agenda', accent: '#b2cc46' },
            { href: '/disponibilites', label: '✅ Saisir disponibilités', accent: '#168D8F' },
            { href: '/assignments', label: '👤 Assigner bénévoles', accent: '#964d86' },
            { href: '/parametres', label: '⚙️ Paramètres festival', accent: '#555' },
          ].map(({ href, label, accent }) => (
            <Link key={href} href={href}
              className="rounded-xl px-4 py-3 text-sm font-medium transition-all hover:opacity-90"
              style={{ background: accent + '22', color: accent, border: `1px solid ${accent}44` }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
