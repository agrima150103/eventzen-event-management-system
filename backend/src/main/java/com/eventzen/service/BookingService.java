package com.eventzen.service;

import com.eventzen.dto.request.BookingRequest;
import com.eventzen.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);

    List<BookingResponse> getBookingsByUser(Long userId);

    List<BookingResponse> getAllBookings();

    BookingResponse cancelBooking(Long bookingId);
}