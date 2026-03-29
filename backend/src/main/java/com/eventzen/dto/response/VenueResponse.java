package com.eventzen.dto.response;

import com.eventzen.enums.VenueStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VenueResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private Integer capacity;
    private String amenities;
    private VenueStatus status;
}