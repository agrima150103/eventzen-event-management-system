package com.eventzen.service;

import com.eventzen.dto.request.BudgetRequest;
import com.eventzen.dto.response.BudgetResponse;
import com.eventzen.dto.response.BudgetSummaryResponse;

import java.util.List;

public interface BudgetService {
    BudgetResponse createBudget(BudgetRequest request);
    List<BudgetResponse> getAllBudgets();
    BudgetResponse getBudgetById(Long id);
    BudgetResponse updateBudget(Long id, BudgetRequest request);
    void deleteBudget(Long id);
    List<BudgetResponse> getBudgetsByEvent(Long eventId);
    BudgetSummaryResponse getBudgetSummaryByEvent(Long eventId);
}