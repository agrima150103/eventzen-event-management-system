package com.eventzen.controller;

import com.eventzen.dto.request.BudgetRequest;
import com.eventzen.dto.response.ApiResponse;
import com.eventzen.dto.response.BudgetResponse;
import com.eventzen.dto.response.BudgetSummaryResponse;
import com.eventzen.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(request);
        return ResponseEntity.ok(
                ApiResponse.success("Budget created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets() {
        List<BudgetResponse> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(
                ApiResponse.success("Budgets fetched successfully", budgets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(
            @PathVariable Long id) {
        BudgetResponse response = budgetService.getBudgetById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Budget fetched successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Budget updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBudget(
            @PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(
                ApiResponse.success("Budget deleted successfully", null));
    }

    // Get all budgets for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsByEvent(
            @PathVariable Long eventId) {
        List<BudgetResponse> budgets = budgetService.getBudgetsByEvent(eventId);
        return ResponseEntity.ok(
                ApiResponse.success("Budgets fetched for event", budgets));
    }

    // Get budget summary (total allocated vs spent) for an event
    @GetMapping("/event/{eventId}/summary")
    public ResponseEntity<ApiResponse<BudgetSummaryResponse>> getBudgetSummary(
            @PathVariable Long eventId) {
        BudgetSummaryResponse summary = budgetService.getBudgetSummaryByEvent(eventId);
        return ResponseEntity.ok(
                ApiResponse.success("Budget summary fetched", summary));
    }
}