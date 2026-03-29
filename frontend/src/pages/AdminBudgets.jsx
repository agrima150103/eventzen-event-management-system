import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function AdminBudgets() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    eventId: '', category: '', description: '',
    allocatedAmount: '', spentAmount: '0'
  })
  const [message, setMessage] = useState('')

  const categories = ['VENUE', 'CATERING', 'AUDIO_VISUAL',
    'DECORATION', 'MARKETING', 'SECURITY', 'TRANSPORT', 'MISCELLANEOUS']

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/login'); return }
    fetchBudgets()
  }, [user])

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets')
      setBudgets(res.data.data ?? res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/budgets', {
        ...form,
        eventId: parseInt(form.eventId),
        allocatedAmount: parseFloat(form.allocatedAmount),
        spentAmount: parseFloat(form.spentAmount)
      })
      setMessage('✅ Budget created successfully!')
      setShowForm(false)
      setForm({ eventId: '', category: '', description: '',
        allocatedAmount: '', spentAmount: '0' })
      fetchBudgets()
    } catch (err) { setMessage('❌ Failed to create budget.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await api.delete(`/budgets/${id}`)
      fetchBudgets()
    } catch (err) { alert('Failed to delete') }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Manage Budgets</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Budget'}
          </button>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add Budget</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <input name="eventId" placeholder="Event ID" type="number"
                value={form.eventId} onChange={handleChange} required
                className="border rounded-lg px-3 py-2" />
              <select name="category" value={form.category}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2">
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input name="description" placeholder="Description"
                value={form.description} onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2" />
              <input name="allocatedAmount" placeholder="Allocated Amount"
                type="number" value={form.allocatedAmount}
                onChange={handleChange} required
                className="border rounded-lg px-3 py-2" />
              <input name="spentAmount" placeholder="Spent Amount"
                type="number" value={form.spentAmount}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2" />
              <button type="submit"
                className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Create Budget
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
                  <th className="px-4 py-3 text-left">Event ID</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Allocated</th>
                  <th className="px-4 py-3 text-left">Spent</th>
                  <th className="px-4 py-3 text-left">Remaining</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget, i) => (
                  <tr key={budget.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">#{budget.eventId}</td>
                    <td className="px-4 py-3">{budget.category}</td>
                    <td className="px-4 py-3">₹{budget.allocatedAmount}</td>
                    <td className="px-4 py-3">₹{budget.spentAmount}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ₹{(budget.allocatedAmount - budget.spentAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(budget.id)}
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