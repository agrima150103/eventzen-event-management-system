package com.eventzen.dto.request;

import com.eventzen.enums.BudgetCategory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class BudgetRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Category is required")
    private BudgetCategory category;

    private String description;

    @NotNull(message = "Allocated amount is required")
    @Min(value = 0, message = "Amount must be positive")
    private Double allocatedAmount;

    private Double spentAmount;
}