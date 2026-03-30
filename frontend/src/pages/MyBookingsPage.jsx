import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

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
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    try {
      // Try /bookings/my first, fallback to /bookings/user/{id}
      let res
      try {
        res = await api.get('/bookings/my')
      } catch {
        res = await api.get(`/bookings/user/${user.userId}`)
      }
      const data = res.data.data ?? res.data ?? []
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await api.put(`/bookings/${bookingId}/cancel`)
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
    <div className="min-h-screen bg-[#ece7df] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 rounded-[30px] bg-[#ddd6cd] px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-medium tracking-[0.3em] text-slate-500 uppercase">
            EventZen
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
            My Bookings
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            View and manage all your event bookings
          </p>
        </div>

        {loading ? (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-slate-500">You have no bookings yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const isCancelled = booking.bookingStatus === 'CANCELLED'

              return (
                <div
                  key={booking.id}
                  className="rounded-[30px] bg-white p-7 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {booking.eventName || `Event #${booking.eventId}`}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Booking #{booking.id}
                      </p>
                    </div>
                    <span
                      className={`self-start rounded-full px-4 py-2 text-xs font-semibold ${
                        isCancelled
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-600 sm:grid-cols-4">
                    <div className="rounded-2xl bg-[#f7f3ee] p-4">
                      <p className="text-xs text-slate-400">Seats</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {booking.numberOfSeats}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f3ee] p-4">
                      <p className="text-xs text-slate-400">Total Amount</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        ₹{booking.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f3ee] p-4">
                      <p className="text-xs text-slate-400">Booked On</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f3ee] p-4">
                      <p className="text-xs text-slate-400">Venue</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {booking.venueName || '—'}
                      </p>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="mt-5">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}