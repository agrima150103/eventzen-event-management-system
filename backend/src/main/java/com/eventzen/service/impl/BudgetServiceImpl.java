package com.eventzen.service.impl;

import com.eventzen.dto.request.BudgetRequest;
import com.eventzen.dto.response.BudgetResponse;
import com.eventzen.dto.response.BudgetSummaryResponse;
import com.eventzen.entity.Budget;
import com.eventzen.entity.Event;
import com.eventzen.exception.ResourceNotFoundException;
import com.eventzen.repository.BudgetRepository;
import com.eventzen.repository.EventRepository;
import com.eventzen.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final EventRepository eventRepository;

    @Override
    public BudgetResponse createBudget(BudgetRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + request.getEventId()));

        Budget budget = Budget.builder()
                .event(event)
                .category(request.getCategory())
                .description(request.getDescription())
                .allocatedAmount(request.getAllocatedAmount())
                .spentAmount(request.getSpentAmount() != null
                        ? request.getSpentAmount() : 0.0)
                .build();

        Budget saved = budgetRepository.save(budget);
        return mapToResponse(saved);
    }

    @Override
    public List<BudgetResponse> getAllBudgets() {
        return budgetRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BudgetResponse getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Budget not found with id: " + id));
        return mapToResponse(budget);
    }

    @Override
    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Budget not found with id: " + id));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + request.getEventId()));

        budget.setEvent(event);
        budget.setCategory(request.getCategory());
        budget.setDescription(request.getDescription());
        budget.setAllocatedAmount(request.getAllocatedAmount());
        if (request.getSpentAmount() != null) {
            budget.setSpentAmount(request.getSpentAmount());
        }

        Budget updated = budgetRepository.save(budget);
        return mapToResponse(updated);
    }

    @Override
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Budget not found with id: " + id));
        budgetRepository.delete(budget);
    }

    @Override
    public List<BudgetResponse> getBudgetsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));
        return budgetRepository.findByEvent(event)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BudgetSummaryResponse getBudgetSummaryByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));

        List<Budget> budgets = budgetRepository.findByEvent(event);
        List<BudgetResponse> budgetItems = budgets.stream()
                .map(this::mapToResponse)
                .toList();

        // Calculate totals
        double totalAllocated = budgets.stream()
                .mapToDouble(Budget::getAllocatedAmount)
                .sum();
        double totalSpent = budgets.stream()
                .mapToDouble(Budget::getSpentAmount)
                .sum();
        double totalRemaining = totalAllocated - totalSpent;
        double usagePercentage = totalAllocated > 0
                ? (totalSpent / totalAllocated) * 100 : 0;

        return BudgetSummaryResponse.builder()
                .eventId(event.getId())
                .eventName(event.getName())
                .totalAllocated(totalAllocated)
                .totalSpent(totalSpent)
                .totalRemaining(totalRemaining)
                .overallUsagePercentage(Math.round(usagePercentage * 100.0) / 100.0)
                .budgetItems(budgetItems)
                .build();
    }

    private BudgetResponse mapToResponse(Budget budget) {
        double remaining = budget.getAllocatedAmount() - budget.getSpentAmount();
        double usagePercentage = budget.getAllocatedAmount() > 0
                ? (budget.getSpentAmount() / budget.getAllocatedAmount()) * 100 : 0;

        return BudgetResponse.builder()
                .id(budget.getId())
                .eventId(budget.getEvent().getId())
                .eventName(budget.getEvent().getName())
                .category(budget.getCategory())
                .description(budget.getDescription())
                .allocatedAmount(budget.getAllocatedAmount())
                .spentAmount(budget.getSpentAmount())
                .remainingAmount(remaining)
                .usagePercentage(Math.round(usagePercentage * 100.0) / 100.0)
                .build();
    }
}