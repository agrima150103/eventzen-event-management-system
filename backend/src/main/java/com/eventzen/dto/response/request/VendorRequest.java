package com.eventzen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VendorRequest {

    @NotBlank(message = "Vendor name is required")
    private String name;

    private String contactPerson;
    private String email;
    private String phone;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    private Double costPerEvent;
    private String description;

    // Optional - assign vendor to an event
    private Long eventId;
}