import { useEffect, useState } from 'react'
import api from '../api/axios'
import EventCard from '../components/EventCard'

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/events')
      .then(res => {
        // Handle both wrapped and unwrapped responses
        const data = res.data.data ?? res.data
        setEvents(data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
        Upcoming Events
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Browse and book your favourite events
      </p>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}