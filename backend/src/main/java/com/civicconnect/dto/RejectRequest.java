package com.civicconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RejectRequest {

    @NotBlank(message = "Rejection reason is required")
    @Size(min = 5, max = 2000, message = "Rejection reason must be between 5 and 2000 characters")
    private String reason;

    public RejectRequest() {}

    public RejectRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
