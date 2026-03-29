package com.eventzen.service.impl;

import com.eventzen.dto.request.BookingRequest;
import com.eventzen.dto.response.BookingResponse;
import com.eventzen.entity.Booking;
import com.eventzen.entity.Event;
import com.eventzen.entity.User;
import com.eventzen.enums.BookingStatus;
import com.eventzen.exception.BadRequestException;
import com.eventzen.exception.ResourceNotFoundException;
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

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + request.getUserId()));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + request.getEventId()));

        int availableSeats = event.getTotalSeats() - event.getBookedSeats();

        if (request.getNumberOfSeats() > availableSeats) {
            throw new BadRequestException(
                    "Not enough seats available! Requested: "
                    + request.getNumberOfSeats()
                    + ", Available: " + availableSeats);
        }

        double totalAmount = request.getNumberOfSeats() * event.getTicketPrice();

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .numberOfSeats(request.getNumberOfSeats())
                .totalAmount(totalAmount)
                .bookingStatus(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        event.setBookedSeats(event.getBookedSeats() + request.getNumberOfSeats());
        eventRepository.save(event);

        return mapToResponse(savedBooking);
    }

    @Override
    public List<BookingResponse> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled!");
        }

        Event event = booking.getEvent();
        event.setBookedSeats(event.getBookedSeats() - booking.getNumberOfSeats());
        eventRepository.save(event);

        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponse(updatedBooking);
    }

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