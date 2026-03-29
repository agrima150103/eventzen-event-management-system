package com.eventzen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSummaryResponse {
    private Long eventId;
    private String eventName;
    private Double totalAllocated;
    private Double totalSpent;
    private Double totalRemaining;
    private Double overallUsagePercentage;
    private List<BudgetResponse> budgetItems;
}