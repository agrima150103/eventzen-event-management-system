import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function AdminBookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/login'); return }
  }, [user])

  const fetchBookings = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await api.get(`/bookings/user/${userId}`)
      setBookings(res.data.data ?? res.data)
    } catch (err) {
      console.error(err)
      setBookings([])
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          View Bookings
        </h1>

        {/* Search by User ID */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex gap-4">
          <input
            type="number"
            placeholder="Enter User ID to view bookings"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border rounded-lg px-4 py-2 flex-1"
          />
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Bookings Table */}
        {bookings.length > 0 ? (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Booking ID</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Event</th>
                  <th className="px-4 py-3 text-left">Seats</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, i) => (
                  <tr key={booking.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">#{booking.id}</td>
                    <td className="px-4 py-3">{booking.userFullName}</td>
                    <td className="px-4 py-3">{booking.eventName}</td>
                    <td className="px-4 py-3">{booking.numberOfSeats}</td>
                    <td className="px-4 py-3">₹{booking.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${booking.bookingStatus === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            Enter a user ID above to view their bookings
          </p>
        )}
      </div>
    </div>
  )
}