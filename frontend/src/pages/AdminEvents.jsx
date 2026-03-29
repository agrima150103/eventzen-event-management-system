import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function AdminEvents() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [venues, setVenues] = useState([])
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    eventDate: '', startTime: '', endTime: '',
    organizerName: '', totalSeats: '', ticketPrice: '', venueId: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/login'); return }
    fetchEvents()
    fetchVenues()
  }, [user])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.data ?? res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchVenues = async () => {
    try {
      const res = await api.get('/venues')
      setVenues(res.data.data ?? res.data)
    } catch (err) { console.error(err) }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/events', {
        ...form,
        totalSeats: parseInt(form.totalSeats),
        ticketPrice: parseFloat(form.ticketPrice),
        venueId: parseInt(form.venueId)
      })
      setMessage('✅ Event created successfully!')
      setShowForm(false)
      setForm({ name: '', description: '', category: '', eventDate: '',
        startTime: '', endTime: '', organizerName: '',
        totalSeats: '', ticketPrice: '', venueId: '' })
      fetchEvents()
    } catch (err) {
      setMessage('❌ Failed to create event.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      fetchEvents()
    } catch (err) { alert('Failed to delete') }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Manage Events</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {/* Create Event Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Event Name" value={form.name}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input name="description" placeholder="Description" value={form.description}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input name="category" placeholder="Category" value={form.category}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="organizerName" placeholder="Organizer Name" value={form.organizerName}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input type="date" name="eventDate" value={form.eventDate}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2" />
              <input type="time" name="startTime" value={form.startTime}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input type="time" name="endTime" value={form.endTime}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="totalSeats" placeholder="Total Seats" type="number"
                value={form.totalSeats} onChange={handleChange} required
                className="border rounded-lg px-3 py-2" />
              <input name="ticketPrice" placeholder="Ticket Price" type="number"
                value={form.ticketPrice} onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <select name="venueId" value={form.venueId}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2">
                <option value="">Select Venue</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <button type="submit"
                className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Create Event
              </button>
            </form>
          </div>
        )}

        {/* Events Table */}
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Venue</th>
                  <th className="px-4 py-3 text-left">Seats</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr key={event.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{event.name}</td>
                    <td className="px-4 py-3">{event.eventDate}</td>
                    <td className="px-4 py-3">{event.venueName}</td>
                    <td className="px-4 py-3">
                      {event.bookedSeats}/{event.totalSeats}
                    </td>
                    <td className="px-4 py-3">₹{event.ticketPrice}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}