import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function EventDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState(1)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => {
        const data = res.data.data ?? res.data
        setEvent(data)
      })
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setBooking(true)
    setMessage('')
    setError('')

    try {
      await api.post('/bookings', {
        userId: user.userId,
        eventId: event.id,
        numberOfSeats: seats
      })
      setMessage(`✅ Successfully booked ${seats} seat(s)! Check My Bookings.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>
  if (!event) return <p className="text-center mt-10 text-red-500">{error}</p>

  const availableSeats = event.totalSeats - event.bookedSeats

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Category */}
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          {event.category}
        </span>

        {/* Name */}
        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">{event.name}</h1>

        {/* Description */}
        <p className="text-gray-500 mb-4">{event.description}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div>📅 <strong>Date:</strong> {event.eventDate}</div>
          <div>⏰ <strong>Time:</strong> {event.startTime} - {event.endTime}</div>
          <div>📍 <strong>Venue:</strong> {event.venueName}</div>
          <div>👤 <strong>Organizer:</strong> {event.organizerName}</div>
          <div>🪑 <strong>Available:</strong> {availableSeats} / {event.totalSeats}</div>
          <div>💰 <strong>Price:</strong> ₹{event.ticketPrice} per seat</div>
        </div>

        {/* Success / Error Messages */}
        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Booking Section */}
        {availableSeats > 0 ? (
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Seats
              </label>
              <input
                type="number"
                min={1}
                max={availableSeats}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Total: <strong className="text-blue-600">₹{(seats * event.ticketPrice).toFixed(2)}</strong>
              </p>
              <button
                onClick={handleBook}
                disabled={booking}
                className="mt-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {booking ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-500 font-semibold text-lg">❌ This event is Sold Out</p>
        )}
      </div>
    </div>
  )
}