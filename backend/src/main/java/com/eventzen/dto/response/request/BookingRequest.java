package com.eventzen.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    // Which user is booking
    @NotNull(message = "User ID is required")
    private Long userId;

    // Which event to book
    @NotNull(message = "Event ID is required")
    private Long eventId;

    // How many seats they want
    @NotNull(message = "Number of seats is required")
    @Min(value = 1, message = "Must book at least 1 seat")
    private Integer numberOfSeats;
}