import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function AdminVenues() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', address: '', city: '', capacity: '', amenities: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/login'); return }
    fetchVenues()
  }, [user])

  const fetchVenues = async () => {
    try {
      const res = await api.get('/venues')
      setVenues(res.data.data ?? res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/venues', { ...form, capacity: parseInt(form.capacity) })
      setMessage('✅ Venue created successfully!')
      setShowForm(false)
      setForm({ name: '', address: '', city: '', capacity: '', amenities: '' })
      fetchVenues()
    } catch (err) { setMessage('❌ Failed to create venue.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this venue?')) return
    try {
      await api.delete(`/venues/${id}`)
      fetchVenues()
    } catch (err) { alert('Failed to delete') }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Manage Venues</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Venue'}
          </button>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Venue</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Venue Name" value={form.name}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input name="address" placeholder="Address" value={form.address}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input name="city" placeholder="City" value={form.city}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="capacity" placeholder="Capacity" type="number"
                value={form.capacity} onChange={handleChange} required
                className="border rounded-lg px-3 py-2" />
              <input name="amenities" placeholder="Amenities (WiFi, Parking...)"
                value={form.amenities} onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2" />
              <button type="submit"
                className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Create Venue
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">Capacity</th>
                  <th className="px-4 py-3 text-left">Amenities</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue, i) => (
                  <tr key={venue.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{venue.name}</td>
                    <td className="px-4 py-3">{venue.city}</td>
                    <td className="px-4 py-3">{venue.capacity}</td>
                    <td className="px-4 py-3">{venue.amenities}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {venue.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(venue.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
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