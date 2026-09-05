package com.civicconnect.dto;

import java.util.List;
import java.util.Map;

public class OfficerDashboardDTO {

    private Long officerId;
    private String officerName;
    private String officerEmail;
    private String departmentName;
    private String corporation;

    private long totalAssigned;
    private long pendingComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long rejectedComplaints;
    private long urgentComplaints;

    private Map<String, Long> complaintsByStatus;
    private Map<String, Long> complaintsByCategory;
    private List<ComplaintResponse> recentComplaints;

    public OfficerDashboardDTO() {}

    public OfficerDashboardDTO(Long officerId, String officerName, String officerEmail,
                               String departmentName, String corporation, long totalAssigned,
                               long pendingComplaints, long inProgressComplaints, long resolvedComplaints,
                               long rejectedComplaints, long urgentComplaints,
                               Map<String, Long> complaintsByStatus, Map<String, Long> complaintsByCategory,
                               List<ComplaintResponse> recentComplaints) {
        this.officerId = officerId;
        this.officerName = officerName;
        this.officerEmail = officerEmail;
        this.departmentName = departmentName;
        this.corporation = corporation;
        this.totalAssigned = totalAssigned;
        this.pendingComplaints = pendingComplaints;
        this.inProgressComplaints = inProgressComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.rejectedComplaints = rejectedComplaints;
        this.urgentComplaints = urgentComplaints;
        this.complaintsByStatus = complaintsByStatus;
        this.complaintsByCategory = complaintsByCategory;
        this.recentComplaints = recentComplaints;
    }

    public static OfficerDashboardDTOBuilder builder() {
        return new OfficerDashboardDTOBuilder();
    }

    public static class OfficerDashboardDTOBuilder {
        private Long officerId;
        private String officerName;
        private String officerEmail;
        private String departmentName;
        private String corporation;
        private long totalAssigned;
        private long pendingComplaints;
        private long inProgressComplaints;
        private long resolvedComplaints;
        private long rejectedComplaints;
        private long urgentComplaints;
        private Map<String, Long> complaintsByStatus;
        private Map<String, Long> complaintsByCategory;
        private List<ComplaintResponse> recentComplaints;

        public OfficerDashboardDTOBuilder officerId(Long officerId) { this.officerId = officerId; return this; }
        public OfficerDashboardDTOBuilder officerName(String officerName) { this.officerName = officerName; return this; }
        public OfficerDashboardDTOBuilder officerEmail(String officerEmail) { this.officerEmail = officerEmail; return this; }
        public OfficerDashboardDTOBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public OfficerDashboardDTOBuilder corporation(String corporation) { this.corporation = corporation; return this; }
        public OfficerDashboardDTOBuilder totalAssigned(long totalAssigned) { this.totalAssigned = totalAssigned; return this; }
        public OfficerDashboardDTOBuilder pendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; return this; }
        public OfficerDashboardDTOBuilder inProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; return this; }
        public OfficerDashboardDTOBuilder resolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; return this; }
        public OfficerDashboardDTOBuilder rejectedComplaints(long rejectedComplaints) { this.rejectedComplaints = rejectedComplaints; return this; }
        public OfficerDashboardDTOBuilder urgentComplaints(long urgentComplaints) { this.urgentComplaints = urgentComplaints; return this; }
        public OfficerDashboardDTOBuilder complaintsByStatus(Map<String, Long> complaintsByStatus) { this.complaintsByStatus = complaintsByStatus; return this; }
        public OfficerDashboardDTOBuilder complaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; return this; }
        public OfficerDashboardDTOBuilder recentComplaints(List<ComplaintResponse> recentComplaints) { this.recentComplaints = recentComplaints; return this; }

        public OfficerDashboardDTO build() {
            return new OfficerDashboardDTO(officerId, officerName, officerEmail, departmentName, corporation,
                    totalAssigned, pendingComplaints, inProgressComplaints, resolvedComplaints, rejectedComplaints,
                    urgentComplaints, complaintsByStatus, complaintsByCategory, recentComplaints);
        }
    }

    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }
    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }
    public String getOfficerEmail() { return officerEmail; }
    public void setOfficerEmail(String officerEmail) { this.officerEmail = officerEmail; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getCorporation() { return corporation; }
    public void setCorporation(String corporation) { this.corporation = corporation; }
    public long getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(long totalAssigned) { this.totalAssigned = totalAssigned; }
    public long getPendingComplaints() { return pendingComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; }
    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }
    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }
    public long getRejectedComplaints() { return rejectedComplaints; }
    public void setRejectedComplaints(long rejectedComplaints) { this.rejectedComplaints = rejectedComplaints; }
    public long getUrgentComplaints() { return urgentComplaints; }
    public void setUrgentComplaints(long urgentComplaints) { this.urgentComplaints = urgentComplaints; }
    public Map<String, Long> getComplaintsByStatus() { return complaintsByStatus; }
    public void setComplaintsByStatus(Map<String, Long> complaintsByStatus) { this.complaintsByStatus = complaintsByStatus; }
    public Map<String, Long> getComplaintsByCategory() { return complaintsByCategory; }
    public void setComplaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; }
    public List<ComplaintResponse> getRecentComplaints() { return recentComplaints; }
    public void setRecentComplaints(List<ComplaintResponse> recentComplaints) { this.recentComplaints = recentComplaints; }
}
