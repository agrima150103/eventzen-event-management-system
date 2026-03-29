package com.eventzen.repository;

import com.eventzen.entity.Booking;
import com.eventzen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}