package com.eventzen.entity;

import com.eventzen.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String contactPerson;
    private String email;
    private String phone;

    // Type of service: Catering, Decoration, Photography, etc.
    private String serviceType;

    private Double costPerEvent;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private VendorStatus status;

    // Which event this vendor is assigned to (optional)
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = VendorStatus.ACTIVE;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}