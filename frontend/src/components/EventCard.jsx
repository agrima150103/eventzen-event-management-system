import { useNavigate } from 'react-router-dom'

export default function EventCard({ event }) {
  const navigate = useNavigate()

  const availableSeats = event.totalSeats - event.bookedSeats

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer"
         onClick={() => navigate(`/events/${event.id}`)}>

      <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
        {event.category}
      </span>

      <h3 className="text-xl font-bold text-gray-800 mt-3 mb-1">{event.name}</h3>
      <p className="text-gray-500 text-sm mb-1">📍 {event.venueName}</p>
      <p className="text-gray-500 text-sm mb-3">📅 {event.eventDate}</p>

      <div className="flex justify-between items-center mt-4">
        <span className={`text-sm font-medium ${availableSeats === 0 ? 'text-red-500' : 'text-green-600'}`}>
          {availableSeats === 0 ? '❌ Sold Out' : `✅ ${availableSeats} seats left`}
        </span>
        <span className="text-blue-600 font-bold text-lg">₹{event.ticketPrice}</span>
      </div>

      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-40"
        disabled={availableSeats === 0}
      >
        {availableSeats === 0 ? 'Sold Out' : 'View & Book'}
      </button>
    </div>
  )
}