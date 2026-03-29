package com.eventzen.repository;

import com.eventzen.entity.Event;
import com.eventzen.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByEvent(Event event);
    List<Vendor> findByServiceType(String serviceType);
}