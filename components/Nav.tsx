'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Building2, Theater, CalendarDays, CheckSquare, UserCheck, Settings, Tent } from 'lucide-react'

const links = [
  { href: '/', label: 'Tableau de bord', icon: Tent },
  { href: '/benevoles', label: 'Bénévoles', icon: Users },
  { href: '/salles', label: 'Salles', icon: Building2 },
  { href: '/spectacles', label: 'Spectacles', icon: Theater },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/disponibilites', label: 'Disponibilités', icon: CheckSquare },
  { href: '/assignments', label: 'Assignations', icon: UserCheck },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
]

export default function Nav() {
  const path = usePathname()

  return (
    <aside className="w-64 min-h-screen flex flex-col shadow-2xl" style={{ background: '#0a0a0a', borderRight: '1px solid #222' }}>
      <div className="px-6 py-6" style={{ borderBottom: '1px solid #222' }}>
        <div className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'Roboto Slab, serif' }}>
          🎪 MaBoule
        </div>
        <div className="text-sm mt-1" style={{ color: '#b2cc46' }}>Gestion des bénévoles</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={active
                ? { background: '#168D8F', color: '#fff' }
                : { color: '#aaa' }
              }
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#aaa' } }}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-6 py-4 text-xs" style={{ borderTop: '1px solid #222', color: '#555' }}>
        Festival de marionnettes · Genappe
      </div>
    </aside>
  )
}
