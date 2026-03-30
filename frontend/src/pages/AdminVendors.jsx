import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AdminShell from '../components/AdminShell'

export default function AdminVendors() {
  const { user, isAuthReady } = useAuth()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: '',
    description: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || user.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    fetchVendors()
  }, [user, isAuthReady, navigate])

  const fetchVendors = async () => {
    try {
      const res = await api.get('/vendors')
      setVendors(res.data.data ?? res.data ?? [])
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
      await api.post('/vendors', form)
      setMessage('Vendor created successfully!')
      setShowForm(false)
      setForm({ name: '', contactPerson: '', email: '', phone: '', serviceType: '', description: '' })
      fetchVendors()
    } catch (err) {
      console.error(err)
      setMessage('Failed to create vendor.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return
    try {
      await api.delete(`/vendors/${id}`)
      fetchVendors()
    } catch (err) {
      console.error(err)
      alert('Failed to delete vendor.')
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
      title="Vendors"
      subtitle="Dashboard / Vendors"
      action={
        <button
          onClick={() => { setShowForm((prev) => !prev); setMessage('') }}
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {showForm ? 'Close Form' : '+ Add Vendor'}
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_400px]">
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Vendor Directory</p>
              <h2 className="text-2xl font-bold text-slate-900">Service Partners ({vendors.length})</h2>
            </div>
            <span className="rounded-full bg-[#f4efe8] px-4 py-2 text-sm font-semibold text-slate-700">Active</span>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">No vendors found.</div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-5 gap-3 bg-black px-5 py-4 text-sm font-semibold text-white">
                <div>Name</div><div>Contact</div><div>Email</div><div>Service</div><div>Actions</div>
              </div>
              <div className="divide-y divide-slate-200 bg-white">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="grid grid-cols-5 gap-3 px-5 py-4 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">{vendor.name}</div>
                    <div>{vendor.contactPerson || '—'}</div>
                    <div className="truncate">{vendor.email || '—'}</div>
                    <div>{vendor.serviceType || '—'}</div>
                    <div>
                      <button onClick={() => handleDelete(vendor.id)} className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">Delete</button>
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
            <h2 className="text-2xl font-bold text-slate-900">New Vendor</h2>
          </div>

          {message && <div className="mb-4 rounded-2xl bg-[#f7f3ee] px-4 py-3 text-sm font-medium text-slate-700">{message}</div>}

          {!showForm ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-[#faf7f3] p-8 text-center">
              <p className="text-sm text-slate-500">Add a vendor with service type, contact details and description.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Open Vendor Form</button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <input name="name" placeholder="Vendor Name" value={form.name} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <input name="contactPerson" placeholder="Contact Person" value={form.contactPerson} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              </div>
              <input name="serviceType" placeholder="Service Type (AUDIO, CATERING...)" value={form.serviceType} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <button type="submit" className="w-full rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Add Vendor</button>
            </form>
          )}
        </section>
      </div>
    </AdminShell>
  )
}