package com.civicconnect.dto;

import jakarta.validation.constraints.NotNull;

public class AssignRequest {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private Long officerId;
    private String remarks;

    public AssignRequest() {
    }

    public AssignRequest(Long departmentId, Long officerId, String remarks) {
        this.departmentId = departmentId;
        this.officerId = officerId;
        this.remarks = remarks;
    }

    public static AssignRequestBuilder builder() {
        return new AssignRequestBuilder();
    }

    public static class AssignRequestBuilder {
        private Long departmentId;
        private Long officerId;
        private String remarks;

        public AssignRequestBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public AssignRequestBuilder officerId(Long officerId) { this.officerId = officerId; return this; }
        public AssignRequestBuilder remarks(String remarks) { this.remarks = remarks; return this; }

        public AssignRequest build() {
            return new AssignRequest(departmentId, officerId, remarks);
        }
    }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
