package com.eventzen.dto.response;

import com.eventzen.enums.VendorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {
    private Long id;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String serviceType;
    private Double costPerEvent;
    private String description;
    private VendorStatus status;
    private Long eventId;
    private String eventName;
}