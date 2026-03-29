package com.eventzen.service;

import com.eventzen.dto.request.BookingRequest;
import com.eventzen.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    // Book an event
    BookingResponse createBooking(BookingRequest request);

    // Get all bookings for a specific user
    List<BookingResponse> getBookingsByUser(Long userId);

    // Cancel a booking by booking ID
    BookingResponse cancelBooking(Long bookingId);
}