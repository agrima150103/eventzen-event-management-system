package com.eventzen.dto.response;

import com.eventzen.enums.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String organizerName;
    private Integer totalSeats;
    private Integer bookedSeats;
    private Double ticketPrice;
    private EventStatus status;
    private Long venueId;
    private String venueName;
}