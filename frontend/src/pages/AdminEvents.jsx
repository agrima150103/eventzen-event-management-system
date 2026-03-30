import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AdminShell from '../components/AdminShell'

export default function AdminEvents() {
  const { user, isAuthReady } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    organizerName: '',
    totalSeats: '',
    ticketPrice: '',
    venueId: '',
  })

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || user.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    fetchEvents()
    fetchVenues()
  }, [user, isAuthReady, navigate])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.data ?? res.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchVenues = async () => {
    try {
      const res = await api.get('/venues')
      setVenues(res.data.data ?? res.data ?? [])
    } catch (err) {
      console.error(err)
    }
  }

  const totalEvents = useMemo(() => events.length, [events])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      organizerName: '',
      totalSeats: '',
      ticketPrice: '',
      venueId: '',
    })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/events', {
        ...form,
        totalSeats: parseInt(form.totalSeats, 10),
        ticketPrice: parseFloat(form.ticketPrice),
        venueId: parseInt(form.venueId, 10),
      })
      setMessage('Event created successfully!')
      setShowForm(false)
      resetForm()
      fetchEvents()
    } catch (err) {
      console.error(err)
      setMessage('Failed to create event.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      fetchEvents()
    } catch (err) {
      console.error(err)
      alert('Failed to delete event.')
    }
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#ece7df] flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  return (
    <AdminShell
      title="Events"
      subtitle="Dashboard / Events"
      action={
        <div className="flex gap-3">
          <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm">
            All Category
          </button>
          <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm">
            This Month
          </button>
          <button
            onClick={() => {
              setShowForm((prev) => !prev)
              setMessage('')
            }}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
          >
            {showForm ? 'Close Form' : '+ Add Event'}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_380px]">
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Events Overview</p>
              <h2 className="text-2xl font-bold text-slate-900">
                Active Events ({totalEvents})
              </h2>
            </div>
            <div className="rounded-full bg-[#f4efe8] px-4 py-2 text-sm font-semibold text-slate-700">
              Live Data
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">
              No events found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-6 gap-3 bg-black px-5 py-4 text-sm font-semibold text-white">
                <div>Name</div>
                <div>Date</div>
                <div>Venue</div>
                <div>Seats</div>
                <div>Price</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-slate-200 bg-white">
                {events.map((event) => (
                  <div key={event.id} className="grid grid-cols-6 gap-3 px-5 py-4 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">{event.name}</div>
                    <div>{event.eventDate}</div>
                    <div>{event.venueName || '—'}</div>
                    <div>{event.bookedSeats ?? 0}/{event.totalSeats ?? 0}</div>
                    <div>{event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</div>
                    <div>
                      <button onClick={() => handleDelete(event.id)} className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm text-slate-500">Create</p>
            <h2 className="text-2xl font-bold text-slate-900">New Event</h2>
          </div>

          {message && (
            <div className="mb-4 rounded-2xl bg-[#f7f3ee] px-4 py-3 text-sm font-medium text-slate-700">
              {message}
            </div>
          )}

          {!showForm ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-[#faf7f3] p-8 text-center">
              <p className="text-sm text-slate-500">
                Open the form to add a new event with venue, pricing and seat details.
              </p>
              <button onClick={() => setShowForm(true)} className="mt-4 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Open Event Form
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <input name="name" placeholder="Event Name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
                <input name="organizerName" placeholder="Organizer Name" value={form.organizerName} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
                <input type="number" name="totalSeats" placeholder="Total Seats" value={form.totalSeats} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="number" step="0.01" name="ticketPrice" placeholder="Ticket Price" value={form.ticketPrice} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required />
                <select name="venueId" value={form.venueId} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" required>
                  <option value="">Select Venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Create Event
              </button>
            </form>
          )}
        </section>
      </div>
    </AdminShell>
  )
}