package com.eventzen.repository;

import com.eventzen.entity.Budget;
import com.eventzen.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByEvent(Event event);
}