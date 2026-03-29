import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    events: 0, venues: 0, bookings: 0, vendors: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const [events, venues, vendors] = await Promise.all([
        api.get('/events'),
        api.get('/venues'),
        api.get('/vendors')
      ])
      setStats({
        events: (events.data.data ?? events.data).length,
        venues: (venues.data.data ?? venues.data).length,
        vendors: (vendors.data.data ?? vendors.data).length,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const cards = [
    { title: 'Events', count: stats.events, link: '/admin/events', color: 'bg-blue-500', icon: '🎪' },
    { title: 'Venues', count: stats.venues, link: '/admin/venues', color: 'bg-green-500', icon: '🏛️' },
    { title: 'Vendors', count: stats.vendors, link: '/admin/vendors', color: 'bg-purple-500', icon: '🤝' },
    { title: 'Bookings', count: '', link: '/admin/bookings', color: 'bg-orange-500', icon: '📋' },
    { title: 'Budgets', count: '', link: '/admin/budgets', color: 'bg-red-500', icon: '💰' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Welcome back, {user?.fullName} 👋
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`${card.color} text-white rounded-2xl p-6 shadow-lg hover:opacity-90 transition`}
          >
            <div className="text-4xl mb-2">{card.icon}</div>
            <h3 className="text-xl font-bold">{card.title}</h3>
            {card.count !== '' && (
              <p className="text-3xl font-extrabold mt-1">{card.count}</p>
            )}
            <p className="text-sm mt-2 opacity-80">Click to manage →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}