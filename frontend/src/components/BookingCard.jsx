export default function BookingCard({ booking, onCancel }) {
  const isCancelled = booking.bookingStatus === 'CANCELLED'

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {booking.eventName || `Event #${booking.eventId}`}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Booking #{booking.id}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isCancelled
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {booking.bookingStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <p>🎫 Seats: <strong>{booking.numberOfSeats}</strong></p>
        <p>💰 Total: <strong>₹{booking.totalAmount?.toFixed(2) || '0.00'}</strong></p>
        <p>📅 Booked: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '—'}</p>
        <p>📍 Venue: {booking.venueName || '—'}</p>
      </div>

      {!isCancelled && onCancel && (
        <button
          onClick={() => onCancel(booking.id)}
          className="mt-4 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Cancel Booking
        </button>
      )}
    </div>
  )
}