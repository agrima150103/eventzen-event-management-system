package com.eventzen.dto.response;

import com.eventzen.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private Long eventId;
    private String eventName;
    private String eventCategory;
    private Integer numberOfSeats;
    private Double totalAmount;
    private BookingStatus bookingStatus;
    private LocalDateTime bookingDate;
}