package com.eventzen.service.impl;

import com.eventzen.dto.request.BookingRequest;
import com.eventzen.dto.response.BookingResponse;
import com.eventzen.entity.Booking;
import com.eventzen.entity.Event;
import com.eventzen.entity.User;
import com.eventzen.enums.BookingStatus;
import com.eventzen.repository.BookingRepository;
import com.eventzen.repository.EventRepository;
import com.eventzen.repository.UserRepository;
import com.eventzen.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    // ─────────────────────────────────────────────
    // 1. CREATE BOOKING
    // ─────────────────────────────────────────────
    @Override
    @Transactional  // ensures DB is updated atomically (all or nothing)
    public BookingResponse createBooking(BookingRequest request) {

        // Step 1: Find the user — throw error if not found
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + request.getUserId()));

        // Step 2: Find the event — throw error if not found
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException(
                        "Event not found with id: " + request.getEventId()));

        // Step 3: Check available seats
        // availableSeats = totalSeats - bookedSeats
        int availableSeats = event.getTotalSeats() - event.getBookedSeats();

        if (request.getNumberOfSeats() > availableSeats) {
            throw new RuntimeException(
                    "Not enough seats available! Requested: "
                    + request.getNumberOfSeats()
                    + ", Available: " + availableSeats);
        }

        // Step 4: Calculate total amount to pay
        double totalAmount = request.getNumberOfSeats() * event.getTicketPrice();

        // Step 5: Create the booking object
        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .numberOfSeats(request.getNumberOfSeats())
                .totalAmount(totalAmount)
                .bookingStatus(BookingStatus.CONFIRMED)
                .build();

        // Step 6: Save the booking to database
        Booking savedBooking = bookingRepository.save(booking);

        // Step 7: Reduce available seats in the event
        // e.g. if 100 total and 10 booked, now bookedSeats becomes 10 + 2 = 12
        event.setBookedSeats(event.getBookedSeats() + request.getNumberOfSeats());
        eventRepository.save(event);

        // Step 8: Return response
        return mapToResponse(savedBooking);
    }

    // ─────────────────────────────────────────────
    // 2. GET BOOKINGS BY USER
    // ─────────────────────────────────────────────
    @Override
    public List<BookingResponse> getBookingsByUser(Long userId) {

        // Find user first
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + userId));

        // Get all bookings for this user and convert to response
        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ─────────────────────────────────────────────
    // 3. CANCEL BOOKING
    // ─────────────────────────────────────────────
    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {

        // Step 1: Find the booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with id: " + bookingId));

        // Step 2: Check if already cancelled
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled!");
        }

        // Step 3: Release the seats back to the event
        Event event = booking.getEvent();
        event.setBookedSeats(event.getBookedSeats() - booking.getNumberOfSeats());
        eventRepository.save(event);

        // Step 4: Mark booking as CANCELLED
        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponse(updatedBooking);
    }

    // ─────────────────────────────────────────────
    // Helper: Convert Booking entity → BookingResponse
    // ─────────────────────────────────────────────
    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userFullName(booking.getUser().getFullName())
                .userEmail(booking.getUser().getEmail())
                .eventId(booking.getEvent().getId())
                .eventName(booking.getEvent().getName())
                .eventCategory(booking.getEvent().getCategory())
                .numberOfSeats(booking.getNumberOfSeats())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .bookingDate(booking.getBookingDate())
                .build();
    }
}