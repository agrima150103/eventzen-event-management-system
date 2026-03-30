import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import AdminShell from '../components/AdminShell'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    venues: 0,
    vendors: 0,
    bookings: 0,
    budgets: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [eventsRes, venuesRes, vendorsRes, budgetsRes] = await Promise.all([
        api.get('/events'),
        api.get('/venues'),
        api.get('/vendors'),
        api.get('/budgets'),
      ])

      const events = eventsRes.data.data ?? eventsRes.data ?? []
      const venues = venuesRes.data.data ?? venuesRes.data ?? []
      const vendors = vendorsRes.data.data ?? vendorsRes.data ?? []
      const budgets = budgetsRes.data.data ?? budgetsRes.data ?? []

      setStats({
        events: events.length,
        venues: venues.length,
        vendors: vendors.length,
        bookings: 0,
        budgets: budgets.length,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const cards = [
    {
      title: 'Events',
      count: stats.events,
      link: '/admin/events',
      accent: 'from-orange-200 to-orange-100',
      icon: '🎫',
    },
    {
      title: 'Venues',
      count: stats.venues,
      link: '/admin/venues',
      accent: 'from-blue-200 to-blue-100',
      icon: '🏛️',
    },
    {
      title: 'Vendors',
      count: stats.vendors,
      link: '/admin/vendors',
      accent: 'from-pink-200 to-pink-100',
      icon: '🤝',
    },
    {
      title: 'Bookings',
      count: stats.bookings,
      link: '/admin/bookings',
      accent: 'from-emerald-200 to-emerald-100',
      icon: '🧾',
    },
    {
      title: 'Budgets',
      count: stats.budgets,
      link: '/admin/budgets',
      accent: 'from-violet-200 to-violet-100',
      icon: '💰',
    },
  ]

  return (
    <AdminShell title="Dashboard" subtitle="Dashboard">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`group rounded-[32px] bg-gradient-to-br ${card.accent} p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="mb-12 flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-3xl shadow-sm">
                {card.icon}
              </div>
              <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                Open
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-slate-900">{card.title}</h3>
              <p className="text-5xl font-extrabold text-slate-900">{card.count}</p>
              <p className="text-2xl font-medium text-slate-600 transition group-hover:text-slate-900">
                Click to manage →
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-[32px] bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xl text-slate-500">Overview</p>
              <h2 className="text-5xl font-bold text-slate-900">Quick Admin Summary</h2>
            </div>
            <span className="rounded-full bg-black px-5 py-3 text-base font-semibold text-white">
              Live
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-[#f4efe8] p-6">
              <p className="text-lg text-slate-500">Total Events</p>
              <p className="mt-2 text-5xl font-bold">{stats.events}</p>
            </div>
            <div className="rounded-3xl bg-[#f4efe8] p-6">
              <p className="text-lg text-slate-500">Total Venues</p>
              <p className="mt-2 text-5xl font-bold">{stats.venues}</p>
            </div>
            <div className="rounded-3xl bg-[#f4efe8] p-6">
              <p className="text-lg text-slate-500">Total Vendors</p>
              <p className="mt-2 text-5xl font-bold">{stats.vendors}</p>
            </div>
            <div className="rounded-3xl bg-[#f4efe8] p-6">
              <p className="text-lg text-slate-500">Budget Entries</p>
              <p className="mt-2 text-5xl font-bold">{stats.budgets}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-7 shadow-sm">
          <p className="text-xl text-slate-500">Welcome</p>
          <h2 className="mt-1 text-5xl font-bold text-slate-900">
            Hello, Agrima Saxena
          </h2>
          <p className="mt-4 text-xl leading-9 text-slate-600">
            This dashboard uses one consistent EventZen theme across all admin modules.
          </p>

          <div className="mt-8 space-y-4">
            <Link
              to="/admin/events"
              className="block rounded-3xl bg-black px-6 py-4 text-center text-lg font-semibold text-white transition hover:bg-slate-800"
            >
              Manage Events
            </Link>
            <Link
              to="/admin/venues"
              className="block rounded-3xl border border-slate-200 px-6 py-4 text-center text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Manage Venues
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}