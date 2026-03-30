import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const extractLoginPayload = (responseData) => {
    const root = responseData?.data ?? responseData ?? {}
    const nestedUser = root?.user ?? {}

    const token =
      root.token ||
      root.jwtToken ||
      root.accessToken ||
      responseData?.token ||
      responseData?.jwtToken ||
      responseData?.accessToken

    const userData = {
      userId:
        root.userId ??
        root.id ??
        nestedUser.userId ??
        nestedUser.id ??
        null,
      fullName:
        root.fullName ??
        root.name ??
        nestedUser.fullName ??
        nestedUser.name ??
        '',
      email: root.email ?? nestedUser.email ?? form.email,
      role: root.role ?? nestedUser.role ?? 'CUSTOMER',
    }

    return { token, userData, raw: root }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', form)
      const { token, userData, raw } = extractLoginPayload(res.data)

      if (!token) {
        throw new Error(
          raw?.message || 'Login succeeded but token was not found in response.'
        )
      }

      login(userData, token)

      if (userData.role === 'ADMIN') {
       navigate('/admin')
    } else {
       navigate('/events')
    }
    } catch (err) {
      console.error('Login error:', err)

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Invalid email or password. Please try again.'

      setError(message)
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
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Login to continue to your account
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}