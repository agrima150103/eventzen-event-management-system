import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import BookingCard from '../components/BookingCard'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    api.get(`/bookings/user/${user.userId}`)
      .then(res => {
        const data = res.data.data ?? res.data
        setBookings(data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [user])

  const handleCancel = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      // Refresh the list after cancel
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b
        )
      )
    } catch (err) {
      alert('Could not cancel booking. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-400">
          You have no bookings yet.{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >
            Browse Events
          </span>
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  )
}