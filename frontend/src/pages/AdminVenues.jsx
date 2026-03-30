import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AdminShell from '../components/AdminShell'

export default function AdminVenues() {
  const { user, isAuthReady } = useAuth()
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
    amenities: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || user.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    fetchVenues()
  }, [user, isAuthReady, navigate])

  const fetchVenues = async () => {
    try {
      const res = await api.get('/venues')
      setVenues(res.data.data ?? res.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/venues', {
        ...form,
        capacity: parseInt(form.capacity, 10),
      })
      setMessage('Venue created successfully!')
      setShowForm(false)
      setForm({ name: '', address: '', city: '', capacity: '', amenities: '' })
      fetchVenues()
    } catch (err) {
      console.error(err)
      setMessage('Failed to create venue.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this venue?')) return
    try {
      await api.delete(`/venues/${id}`)
      fetchVenues()
    } catch (err) {
      console.error(err)
      alert('Failed to delete venue.')
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
      title="Venues"
      subtitle="Dashboard / Venues"
      action={
        <button
          onClick={() => { setShowForm((prev) => !prev); setMessage('') }}
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {showForm ? 'Close Form' : '+ Add Venue'}
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_400px]">
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Venue Directory</p>
              <h2 className="text-2xl font-bold text-slate-900">Available Venues ({venues.length})</h2>
            </div>
            <span className="rounded-full bg-[#f4efe8] px-4 py-2 text-sm font-semibold text-slate-700">Active</span>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">Loading venues...</div>
          ) : venues.length === 0 ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">No venues found.</div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-6 gap-3 bg-black px-5 py-4 text-sm font-semibold text-white">
                <div>Name</div><div>City</div><div>Capacity</div><div>Amenities</div><div>Status</div><div>Actions</div>
              </div>
              <div className="divide-y divide-slate-200 bg-white">
                {venues.map((venue) => (
                  <div key={venue.id} className="grid grid-cols-6 gap-3 px-5 py-4 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">{venue.name}</div>
                    <div>{venue.city || '—'}</div>
                    <div>{venue.capacity}</div>
                    <div className="truncate">{venue.amenities || '—'}</div>
                    <div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{venue.status || 'AVAILABLE'}</span></div>
                    <div>
                      <button onClick={() => handleDelete(venue.id)} className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">Delete</button>
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
            <h2 className="text-2xl font-bold text-slate-900">New Venue</h2>
          </div>

          {message && <div className="mb-4 rounded-2xl bg-[#f7f3ee] px-4 py-3 text-sm font-medium text-slate-700">{message}</div>}

          {!showForm ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-[#faf7f3] p-8 text-center">
              <p className="text-sm text-slate-500">Add a venue with address, city, capacity and amenities.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Open Venue Form</button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <input name="name" placeholder="Venue Name" value={form.name} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
                <input name="capacity" placeholder="Capacity" type="number" value={form.capacity} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              </div>
              <input name="amenities" placeholder="Amenities (WiFi, Parking...)" value={form.amenities} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <button type="submit" className="w-full rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Create Venue</button>
            </form>
          )}
        </section>
      </div>
    </AdminShell>
  )
}