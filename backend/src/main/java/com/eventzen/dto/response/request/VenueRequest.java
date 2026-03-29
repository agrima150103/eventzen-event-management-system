package com.eventzen.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VenueRequest {

    @NotBlank(message = "Venue name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String amenities;
}