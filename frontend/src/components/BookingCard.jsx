export default function BookingCard({ booking, onCancel }) {
  const isCancelled = booking.bookingStatus === 'CANCELLED'

  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 border-l-4 
      ${isCancelled ? 'border-red-400' : 'border-green-400'}`}>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{booking.eventName}</h3>
          <p className="text-gray-500 text-sm">{booking.eventCategory}</p>
        </div>

        {/* Status Badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full 
          ${isCancelled
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-600'}`}>
          {booking.bookingStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div>🪑 Seats: <strong>{booking.numberOfSeats}</strong></div>
        <div>💰 Total: <strong>₹{booking.totalAmount}</strong></div>
        <div>📅 Booked: <strong>{new Date(booking.bookingDate).toLocaleDateString()}</strong></div>
      </div>

      {/* Cancel Button — only show if not already cancelled */}
      {!isCancelled && (
        <button
          onClick={() => onCancel(booking.id)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
        >
          Cancel Booking
        </button>
      )}
    </div>
  )
}