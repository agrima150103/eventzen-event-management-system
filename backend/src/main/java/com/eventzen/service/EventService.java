package com.eventzen.service;

import com.eventzen.dto.request.EventRequest;
import com.eventzen.dto.response.EventResponse;

import java.util.List;

public interface EventService {
    EventResponse createEvent(EventRequest request);
    List<EventResponse> getAllEvents();
    EventResponse getEventById(Long id);
    EventResponse updateEvent(Long id, EventRequest request);
    void deleteEvent(Long id);
}