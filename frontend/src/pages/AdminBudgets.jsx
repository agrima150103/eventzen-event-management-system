import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AdminShell from '../components/AdminShell'

export default function AdminBudgets() {
  const { user, isAuthReady } = useAuth()
  const navigate = useNavigate()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    eventId: '',
    category: '',
    description: '',
    allocatedAmount: '',
    spentAmount: '0',
  })
  const [message, setMessage] = useState('')

  const categories = ['VENUE', 'CATERING', 'DECORATION', 'MARKETING', 'MUSIC', 'PHOTOGRAPHY', 'SECURITY', 'TRANSPORT', 'MISCELLANEOUS']

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || user.role !== 'ADMIN') {
      navigate('/login')
      return
    }
    fetchBudgets()
  }, [user, isAuthReady, navigate])

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets')
      setBudgets(res.data.data ?? res.data ?? [])
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
      await api.post('/budgets', {
        ...form,
        eventId: parseInt(form.eventId, 10),
        allocatedAmount: parseFloat(form.allocatedAmount),
        spentAmount: parseFloat(form.spentAmount),
      })
      setMessage('Budget created successfully!')
      setShowForm(false)
      setForm({ eventId: '', category: '', description: '', allocatedAmount: '', spentAmount: '0' })
      fetchBudgets()
    } catch (err) {
      console.error(err)
      setMessage('Failed to create budget.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await api.delete(`/budgets/${id}`)
      fetchBudgets()
    } catch (err) {
      console.error(err)
      alert('Failed to delete budget.')
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
      title="Budgets"
      subtitle="Dashboard / Budgets"
      action={
        <button
          onClick={() => { setShowForm((prev) => !prev); setMessage('') }}
          className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {showForm ? 'Close Form' : '+ Add Budget'}
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_400px]">
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Budget Tracker</p>
              <h2 className="text-2xl font-bold text-slate-900">Budget Records ({budgets.length})</h2>
            </div>
            <span className="rounded-full bg-[#f4efe8] px-4 py-2 text-sm font-semibold text-slate-700">Finance</span>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="rounded-3xl bg-[#f7f3ee] p-8 text-center text-slate-500">No budget records found.</div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-6 gap-3 bg-black px-5 py-4 text-sm font-semibold text-white">
                <div>Event ID</div><div>Category</div><div>Allocated</div><div>Spent</div><div>Remaining</div><div>Actions</div>
              </div>
              <div className="divide-y divide-slate-200 bg-white">
                {budgets.map((budget) => {
                  const remaining = Number(budget.allocatedAmount || 0) - Number(budget.spentAmount || 0)
                  return (
                    <div key={budget.id} className="grid grid-cols-6 gap-3 px-5 py-4 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">#{budget.eventId}</div>
                      <div>{budget.category}</div>
                      <div>₹{budget.allocatedAmount}</div>
                      <div>₹{budget.spentAmount}</div>
                      <div className="font-semibold text-green-600">₹{remaining.toFixed(2)}</div>
                      <div>
                        <button onClick={() => handleDelete(budget.id)} className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm text-slate-500">Create</p>
            <h2 className="text-2xl font-bold text-slate-900">New Budget</h2>
          </div>

          {message && <div className="mb-4 rounded-2xl bg-[#f7f3ee] px-4 py-3 text-sm font-medium text-slate-700">{message}</div>}

          {!showForm ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-[#faf7f3] p-8 text-center">
              <p className="text-sm text-slate-500">Create a budget entry for an event and track allocated versus spent amount.</p>
              <button onClick={() => setShowForm(true)} className="mt-4 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Open Budget Form</button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <input name="eventId" placeholder="Event ID" type="number" value={form.eventId} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <select name="category" value={form.category} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400">
                <option value="">Select Category</option>
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input name="allocatedAmount" placeholder="Allocated Amount" type="number" value={form.allocatedAmount} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
                <input name="spentAmount" placeholder="Spent Amount" type="number" value={form.spentAmount} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-[#faf7f3] px-4 py-3 outline-none focus:border-slate-400" />
              </div>
              <button type="submit" className="w-full rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Create Budget</button>
            </form>
          )}
        </section>
      </div>
    </AdminShell>
  )
}