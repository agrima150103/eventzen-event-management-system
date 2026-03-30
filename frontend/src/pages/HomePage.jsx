import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const cardColors = [
  'from-indigo-400 to-purple-500',
  'from-orange-400 to-pink-500',
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-cyan-500',
  'from-rose-400 to-red-500',
  'from-amber-400 to-yellow-500',
]

const cardIcons = ['🎤', '🎵', '📚', '💻', '🎭', '🏆']

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.data ?? res.data ?? [])
    } catch (error) {
      console.error(error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#ece7df] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-8 rounded-[30px] bg-[#ddd6cd] px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-medium tracking-[0.3em] text-slate-500 uppercase">
            EventZen
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Browse, discover and book events with a clean premium experience.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-[30px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`relative flex h-56 items-center justify-center bg-gradient-to-br ${
                    cardColors[index % cardColors.length]
                  }`}
                >
                  <span className="text-7xl opacity-80">
                    {cardIcons[index % cardIcons.length]}
                  </span>
                  <div className="absolute bottom-4 left-5">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                      {event.category || 'Event'}
                    </span>
                  </div>
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-black/80 px-4 py-2 text-sm font-bold text-white">
                      {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {event.name}
                  </h2>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>📅 {event.eventDate || 'Date not available'}</p>
                    <p>🕒 {event.startTime || 'Time not available'}</p>
                    <p>📍 {event.venueName || 'Venue not available'}</p>
                    <p>🎫 Seats: {event.totalSeats ?? 0}</p>
                  </div>

                  <div className="mt-6">
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}