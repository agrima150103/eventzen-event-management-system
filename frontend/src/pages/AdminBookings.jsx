import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AdminShell from '../components/AdminShell'

export default function AdminBookings() {
  const { user, isAuthReady } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || user.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [user, isAuthReady, navigate])

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings')
      setBookings(res.data.data ?? res.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#ece7df] flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  const confirmed = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length
  const cancelled = bookings.filter(b => b.bookingStatus === 'CANCELLED').length

  return (
    <AdminShell title="Bookings" subtitle="Dashboard / Bookings">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-5">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{bookings.length}</p>
        </div>
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Confirmed</p>
          <p className="mt-2 text-4xl font-bold text-green-600">{confirmed}</p>
        </div>
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Cancelled</p>
          <p className="mt-2 text-4xl font-bold text-red-500">{cancelled}</p>
        </div>
      </div>

      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">All Customer Bookings</p>
            <h2 className="text-2xl font-bold text-slate-900">Booking Records ({bookings.length})</h2>
          </div>
          <span className="rounded-full bg-[#f4efe8] px-4 py-2 text-sm font-semibold text-slate-700">Live</span>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">No bookings yet.</div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="grid grid-cols-7 gap-3 bg-black px-5 py-4 text-sm font-semibold text-white">
              <div>ID</div><div>Customer</div><div>Event</div><div>Seats</div><div>Total</div><div>Date</div><div>Status</div>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {bookings.map((b) => (
                <div key={b.id} className="grid grid-cols-7 gap-3 px-5 py-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">#{b.id}</div>
                  <div>{b.userName || b.userEmail || `User #${b.userId}`}</div>
                  <div>{b.eventName || `Event #${b.eventId}`}</div>
                  <div>{b.numberOfSeats}</div>
                  <div>₹{b.totalAmount?.toFixed(2) || '0.00'}</div>
                  <div>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '—'}</div>
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${b.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </AdminShell>
  )
}