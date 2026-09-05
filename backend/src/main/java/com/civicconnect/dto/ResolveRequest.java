package com.civicconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResolveRequest {

    @NotBlank(message = "Resolution remarks are required")
    @Size(min = 5, max = 2000, message = "Resolution remarks must be between 5 and 2000 characters")
    private String remark;

    public ResolveRequest() {}

    public ResolveRequest(String remark) {
        this.remark = remark;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
