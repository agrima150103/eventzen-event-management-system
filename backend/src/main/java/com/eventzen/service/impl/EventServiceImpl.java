package com.eventzen.service.impl;

import com.eventzen.dto.request.EventRequest;
import com.eventzen.dto.response.EventResponse;
import com.eventzen.entity.Event;
import com.eventzen.entity.Venue;
import com.eventzen.enums.EventStatus;
import com.eventzen.repository.EventRepository;
import com.eventzen.repository.VenueRepository;
import com.eventzen.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    @Override
    public EventResponse createEvent(EventRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + request.getVenueId()));

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .organizerName(request.getOrganizerName())
                .totalSeats(request.getTotalSeats())
                .bookedSeats(0)
                .ticketPrice(request.getTicketPrice())
                .status(EventStatus.UPCOMING)
                .venue(venue)
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return mapToResponse(event);
    }

    @Override
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + request.getVenueId()));

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setOrganizerName(request.getOrganizerName());
        event.setTotalSeats(request.getTotalSeats());
        event.setTicketPrice(request.getTicketPrice());
        event.setVenue(venue);

        Event updatedEvent = eventRepository.save(event);
        return mapToResponse(updatedEvent);
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        eventRepository.delete(event);
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .category(event.getCategory())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .organizerName(event.getOrganizerName())
                .totalSeats(event.getTotalSeats())
                .bookedSeats(event.getBookedSeats())
                .ticketPrice(event.getTicketPrice())
                .status(event.getStatus())
                .venueId(event.getVenue().getId())
                .venueName(event.getVenue().getName())
                .build();
    }
}