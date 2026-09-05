package com.civicconnect.dto;

import java.util.Map;

public class DashboardStatsDTO {

    private long totalComplaints;
    private long submittedComplaints;
    private long underReviewComplaints;
    private long assignedComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long rejectedComplaints;
    private long urgentComplaints;

    private long bmcComplaints;
    private long tmcComplaints;

    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByStatus;
    private Map<String, Long> complaintsByCorporation;
    private Map<String, Long> complaintsByDepartment;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalComplaints, long submittedComplaints, long underReviewComplaints,
                             long assignedComplaints, long inProgressComplaints, long resolvedComplaints,
                             long rejectedComplaints, long urgentComplaints, long bmcComplaints,
                             long tmcComplaints, Map<String, Long> complaintsByCategory,
                             Map<String, Long> complaintsByStatus, Map<String, Long> complaintsByCorporation,
                             Map<String, Long> complaintsByDepartment) {
        this.totalComplaints = totalComplaints;
        this.submittedComplaints = submittedComplaints;
        this.underReviewComplaints = underReviewComplaints;
        this.assignedComplaints = assignedComplaints;
        this.inProgressComplaints = inProgressComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.rejectedComplaints = rejectedComplaints;
        this.urgentComplaints = urgentComplaints;
        this.bmcComplaints = bmcComplaints;
        this.tmcComplaints = tmcComplaints;
        this.complaintsByCategory = complaintsByCategory;
        this.complaintsByStatus = complaintsByStatus;
        this.complaintsByCorporation = complaintsByCorporation;
        this.complaintsByDepartment = complaintsByDepartment;
    }

    public static DashboardStatsDTOBuilder builder() {
        return new DashboardStatsDTOBuilder();
    }

    public static class DashboardStatsDTOBuilder {
        private long totalComplaints;
        private long submittedComplaints;
        private long underReviewComplaints;
        private long assignedComplaints;
        private long inProgressComplaints;
        private long resolvedComplaints;
        private long rejectedComplaints;
        private long urgentComplaints;
        private long bmcComplaints;
        private long tmcComplaints;
        private Map<String, Long> complaintsByCategory;
        private Map<String, Long> complaintsByStatus;
        private Map<String, Long> complaintsByCorporation;
        private Map<String, Long> complaintsByDepartment;

        public DashboardStatsDTOBuilder totalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; return this; }
        public DashboardStatsDTOBuilder submittedComplaints(long submittedComplaints) { this.submittedComplaints = submittedComplaints; return this; }
        public DashboardStatsDTOBuilder underReviewComplaints(long underReviewComplaints) { this.underReviewComplaints = underReviewComplaints; return this; }
        public DashboardStatsDTOBuilder assignedComplaints(long assignedComplaints) { this.assignedComplaints = assignedComplaints; return this; }
        public DashboardStatsDTOBuilder inProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; return this; }
        public DashboardStatsDTOBuilder resolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; return this; }
        public DashboardStatsDTOBuilder rejectedComplaints(long rejectedComplaints) { this.rejectedComplaints = rejectedComplaints; return this; }
        public DashboardStatsDTOBuilder urgentComplaints(long urgentComplaints) { this.urgentComplaints = urgentComplaints; return this; }
        public DashboardStatsDTOBuilder bmcComplaints(long bmcComplaints) { this.bmcComplaints = bmcComplaints; return this; }
        public DashboardStatsDTOBuilder tmcComplaints(long tmcComplaints) { this.tmcComplaints = tmcComplaints; return this; }
        public DashboardStatsDTOBuilder complaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; return this; }
        public DashboardStatsDTOBuilder complaintsByStatus(Map<String, Long> complaintsByStatus) { this.complaintsByStatus = complaintsByStatus; return this; }
        public DashboardStatsDTOBuilder complaintsByCorporation(Map<String, Long> complaintsByCorporation) { this.complaintsByCorporation = complaintsByCorporation; return this; }
        public DashboardStatsDTOBuilder complaintsByDepartment(Map<String, Long> complaintsByDepartment) { this.complaintsByDepartment = complaintsByDepartment; return this; }

        public DashboardStatsDTO build() {
            return new DashboardStatsDTO(totalComplaints, submittedComplaints, underReviewComplaints, assignedComplaints,
                    inProgressComplaints, resolvedComplaints, rejectedComplaints, urgentComplaints, bmcComplaints,
                    tmcComplaints, complaintsByCategory, complaintsByStatus, complaintsByCorporation, complaintsByDepartment);
        }
    }

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }
    public long getSubmittedComplaints() { return submittedComplaints; }
    public void setSubmittedComplaints(long submittedComplaints) { this.submittedComplaints = submittedComplaints; }
    public long getUnderReviewComplaints() { return underReviewComplaints; }
    public void setUnderReviewComplaints(long underReviewComplaints) { this.underReviewComplaints = underReviewComplaints; }
    public long getAssignedComplaints() { return assignedComplaints; }
    public void setAssignedComplaints(long assignedComplaints) { this.assignedComplaints = assignedComplaints; }
    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }
    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }
    public long getRejectedComplaints() { return rejectedComplaints; }
    public void setRejectedComplaints(long rejectedComplaints) { this.rejectedComplaints = rejectedComplaints; }
    public long getUrgentComplaints() { return urgentComplaints; }
    public void setUrgentComplaints(long urgentComplaints) { this.urgentComplaints = urgentComplaints; }
    public long getBmcComplaints() { return bmcComplaints; }
    public void setBmcComplaints(long bmcComplaints) { this.bmcComplaints = bmcComplaints; }
    public long getTmcComplaints() { return tmcComplaints; }
    public void setTmcComplaints(long tmcComplaints) { this.tmcComplaints = tmcComplaints; }
    public Map<String, Long> getComplaintsByCategory() { return complaintsByCategory; }
    public void setComplaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; }
    public Map<String, Long> getComplaintsByStatus() { return complaintsByStatus; }
    public void setComplaintsByStatus(Map<String, Long> complaintsByStatus) { this.complaintsByStatus = complaintsByStatus; }
    public Map<String, Long> getComplaintsByCorporation() { return complaintsByCorporation; }
    public void setComplaintsByCorporation(Map<String, Long> complaintsByCorporation) { this.complaintsByCorporation = complaintsByCorporation; }
    public Map<String, Long> getComplaintsByDepartment() { return complaintsByDepartment; }
    public void setComplaintsByDepartment(Map<String, Long> complaintsByDepartment) { this.complaintsByDepartment = complaintsByDepartment; }
}
