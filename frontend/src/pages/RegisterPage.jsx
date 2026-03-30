import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      await api.post('/auth/register', form)
      setMessage('✅ Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          'Registration failed. Please check your details.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#ece7df] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-slate-500">
          EventZen
        </p>
        <h2 className="mt-3 text-center text-4xl font-bold text-slate-900">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Register and start using EventZen
        </p>

        {message && (
          <div className="mt-5 rounded-2xl bg-green-100 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}