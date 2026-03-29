package com.eventzen.dto.response;

import com.eventzen.enums.BudgetCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private Long eventId;
    private String eventName;
    private BudgetCategory category;
    private String description;
    private Double allocatedAmount;
    private Double spentAmount;
    // Remaining = allocated - spent
    private Double remainingAmount;
    // % of budget used
    private Double usagePercentage;
}