import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function AdminVendors() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', contactPerson: '', email: '',
    phone: '', serviceType: '', description: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/login'); return }
    fetchVendors()
  }, [user])

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors')
      setVendors(res.data.data ?? res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/vendors', form)
      setMessage('✅ Vendor created successfully!')
      setShowForm(false)
      setForm({ name: '', contactPerson: '', email: '',
        phone: '', serviceType: '', description: '' })
      fetchVendors()
    } catch (err) { setMessage('❌ Failed to create vendor.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return
    try {
      await api.delete(`/vendors/${id}`)
      fetchVendors()
    } catch (err) { alert('Failed to delete') }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Manage Vendors</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Vendor'}
          </button>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Vendor Name" value={form.name}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2" />
              <input name="contactPerson" placeholder="Contact Person"
                value={form.contactPerson} onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="email" placeholder="Email" type="email"
                value={form.email} onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="phone" placeholder="Phone" value={form.phone}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="serviceType" placeholder="Service Type (AUDIO, CATERING...)"
                value={form.serviceType} onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <input name="description" placeholder="Description"
                value={form.description} onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <button type="submit"
                className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Add Vendor
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
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, i) => (
                  <tr key={vendor.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{vendor.name}</td>
                    <td className="px-4 py-3">{vendor.contactPerson}</td>
                    <td className="px-4 py-3">{vendor.email}</td>
                    <td className="px-4 py-3">{vendor.serviceType}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(vendor.id)}
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