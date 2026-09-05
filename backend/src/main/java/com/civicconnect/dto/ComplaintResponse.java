package com.civicconnect.dto;

import com.civicconnect.entity.*;

import java.time.LocalDateTime;
import java.util.List;

public class ComplaintResponse {

    private Long id;
    private String complaintNumber;
    private String title;
    private String description;
    private ComplaintCategory category;
    private String categoryDisplayName;
    private ComplaintStatus status;
    private Priority priority;
    private MunicipalCorporation municipalCorporation;
    private String location;
    private String area;
    private String pincode;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private String resolutionRemarks;
    private String rejectionReason;

    // Citizen Info
    private Long citizenId;
    private String citizenName;
    private String citizenEmail;
    private String citizenPhone;

    // Department & Officer Info
    private Long departmentId;
    private String departmentName;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    private String assignedOfficerPhone;
    private String assignedOfficerEmail;

    // Dates
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    // History & Feedback
    private List<HistoryItemDTO> history;
    private FeedbackItemDTO feedback;

    public ComplaintResponse() {
    }

    public ComplaintResponse(Long id, String complaintNumber, String title, String description,
                             ComplaintCategory category, String categoryDisplayName, ComplaintStatus status,
                             Priority priority, MunicipalCorporation municipalCorporation, String location,
                             String area, String pincode, String imageUrl, Double latitude, Double longitude,
                             String resolutionRemarks, String rejectionReason, Long citizenId, String citizenName, String citizenEmail,
                             String citizenPhone, Long departmentId, String departmentName, Long assignedOfficerId,
                             String assignedOfficerName, String assignedOfficerPhone, String assignedOfficerEmail,
                             LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt,
                             List<HistoryItemDTO> history, FeedbackItemDTO feedback) {
        this.id = id;
        this.complaintNumber = complaintNumber;
        this.title = title;
        this.description = description;
        this.category = category;
        this.categoryDisplayName = categoryDisplayName;
        this.status = status;
        this.priority = priority;
        this.municipalCorporation = municipalCorporation;
        this.location = location;
        this.area = area;
        this.pincode = pincode;
        this.imageUrl = imageUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.resolutionRemarks = resolutionRemarks;
        this.rejectionReason = rejectionReason;
        this.citizenId = citizenId;
        this.citizenName = citizenName;
        this.citizenEmail = citizenEmail;
        this.citizenPhone = citizenPhone;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.assignedOfficerId = assignedOfficerId;
        this.assignedOfficerName = assignedOfficerName;
        this.assignedOfficerPhone = assignedOfficerPhone;
        this.assignedOfficerEmail = assignedOfficerEmail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.history = history;
        this.feedback = feedback;
    }

    public static ComplaintResponseBuilder builder() {
        return new ComplaintResponseBuilder();
    }

    public static class ComplaintResponseBuilder {
        private Long id;
        private String complaintNumber;
        private String title;
        private String description;
        private ComplaintCategory category;
        private String categoryDisplayName;
        private ComplaintStatus status;
        private Priority priority;
        private MunicipalCorporation municipalCorporation;
        private String location;
        private String area;
        private String pincode;
        private String imageUrl;
        private Double latitude;
        private Double longitude;
        private String resolutionRemarks;
        private String rejectionReason;
        private Long citizenId;
        private String citizenName;
        private String citizenEmail;
        private String citizenPhone;
        private Long departmentId;
        private String departmentName;
        private Long assignedOfficerId;
        private String assignedOfficerName;
        private String assignedOfficerPhone;
        private String assignedOfficerEmail;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime resolvedAt;
        private List<HistoryItemDTO> history;
        private FeedbackItemDTO feedback;

        public ComplaintResponseBuilder id(Long id) { this.id = id; return this; }
        public ComplaintResponseBuilder complaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; return this; }
        public ComplaintResponseBuilder title(String title) { this.title = title; return this; }
        public ComplaintResponseBuilder description(String description) { this.description = description; return this; }
        public ComplaintResponseBuilder category(ComplaintCategory category) { this.category = category; return this; }
        public ComplaintResponseBuilder categoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; return this; }
        public ComplaintResponseBuilder status(ComplaintStatus status) { this.status = status; return this; }
        public ComplaintResponseBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ComplaintResponseBuilder municipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; return this; }
        public ComplaintResponseBuilder location(String location) { this.location = location; return this; }
        public ComplaintResponseBuilder area(String area) { this.area = area; return this; }
        public ComplaintResponseBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public ComplaintResponseBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ComplaintResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ComplaintResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ComplaintResponseBuilder resolutionRemarks(String resolutionRemarks) { this.resolutionRemarks = resolutionRemarks; return this; }
        public ComplaintResponseBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public ComplaintResponseBuilder citizenId(Long citizenId) { this.citizenId = citizenId; return this; }
        public ComplaintResponseBuilder citizenName(String citizenName) { this.citizenName = citizenName; return this; }
        public ComplaintResponseBuilder citizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; return this; }
        public ComplaintResponseBuilder citizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; return this; }
        public ComplaintResponseBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public ComplaintResponseBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public ComplaintResponseBuilder assignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; return this; }
        public ComplaintResponseBuilder assignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; return this; }
        public ComplaintResponseBuilder assignedOfficerPhone(String assignedOfficerPhone) { this.assignedOfficerPhone = assignedOfficerPhone; return this; }
        public ComplaintResponseBuilder assignedOfficerEmail(String assignedOfficerEmail) { this.assignedOfficerEmail = assignedOfficerEmail; return this; }
        public ComplaintResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ComplaintResponseBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public ComplaintResponseBuilder history(List<HistoryItemDTO> history) { this.history = history; return this; }
        public ComplaintResponseBuilder feedback(FeedbackItemDTO feedback) { this.feedback = feedback; return this; }

        public ComplaintResponse build() {
            return new ComplaintResponse(id, complaintNumber, title, description, category, categoryDisplayName,
                    status, priority, municipalCorporation, location, area, pincode, imageUrl, latitude, longitude,
                    resolutionRemarks, rejectionReason, citizenId, citizenName, citizenEmail, citizenPhone, departmentId, departmentName,
                    assignedOfficerId, assignedOfficerName, assignedOfficerPhone, assignedOfficerEmail,
                    createdAt, updatedAt, resolvedAt, history, feedback);
        }
    }

    public static class HistoryItemDTO {
        private Long id;
        private ComplaintStatus oldStatus;
        private ComplaintStatus newStatus;
        private String comment;
        private String updatedBy;
        private LocalDateTime createdAt;

        public HistoryItemDTO() {}
        public HistoryItemDTO(Long id, ComplaintStatus oldStatus, ComplaintStatus newStatus, String comment, String updatedBy, LocalDateTime createdAt) {
            this.id = id;
            this.oldStatus = oldStatus;
            this.newStatus = newStatus;
            this.comment = comment;
            this.updatedBy = updatedBy;
            this.createdAt = createdAt;
        }

        public static HistoryItemDTOBuilder builder() { return new HistoryItemDTOBuilder(); }
        public static class HistoryItemDTOBuilder {
            private Long id;
            private ComplaintStatus oldStatus;
            private ComplaintStatus newStatus;
            private String comment;
            private String updatedBy;
            private LocalDateTime createdAt;

            public HistoryItemDTOBuilder id(Long id) { this.id = id; return this; }
            public HistoryItemDTOBuilder oldStatus(ComplaintStatus oldStatus) { this.oldStatus = oldStatus; return this; }
            public HistoryItemDTOBuilder newStatus(ComplaintStatus newStatus) { this.newStatus = newStatus; return this; }
            public HistoryItemDTOBuilder comment(String comment) { this.comment = comment; return this; }
            public HistoryItemDTOBuilder updatedBy(String updatedBy) { this.updatedBy = updatedBy; return this; }
            public HistoryItemDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public HistoryItemDTO build() {
                return new HistoryItemDTO(id, oldStatus, newStatus, comment, updatedBy, createdAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public ComplaintStatus getOldStatus() { return oldStatus; }
        public void setOldStatus(ComplaintStatus oldStatus) { this.oldStatus = oldStatus; }
        public ComplaintStatus getNewStatus() { return newStatus; }
        public void setNewStatus(ComplaintStatus newStatus) { this.newStatus = newStatus; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public String getUpdatedBy() { return updatedBy; }
        public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class FeedbackItemDTO {
        private Long id;
        private Integer rating;
        private String comment;
        private String citizenName;
        private LocalDateTime createdAt;

        public FeedbackItemDTO() {}
        public FeedbackItemDTO(Long id, Integer rating, String comment, String citizenName, LocalDateTime createdAt) {
            this.id = id;
            this.rating = rating;
            this.comment = comment;
            this.citizenName = citizenName;
            this.createdAt = createdAt;
        }

        public static FeedbackItemDTOBuilder builder() { return new FeedbackItemDTOBuilder(); }
        public static class FeedbackItemDTOBuilder {
            private Long id;
            private Integer rating;
            private String comment;
            private String citizenName;
            private LocalDateTime createdAt;

            public FeedbackItemDTOBuilder id(Long id) { this.id = id; return this; }
            public FeedbackItemDTOBuilder rating(Integer rating) { this.rating = rating; return this; }
            public FeedbackItemDTOBuilder comment(String comment) { this.comment = comment; return this; }
            public FeedbackItemDTOBuilder citizenName(String citizenName) { this.citizenName = citizenName; return this; }
            public FeedbackItemDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

            public FeedbackItemDTO build() {
                return new FeedbackItemDTO(id, rating, comment, citizenName, createdAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public String getCitizenName() { return citizenName; }
        public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ComplaintCategory getCategory() { return category; }
    public void setCategory(ComplaintCategory category) { this.category = category; }
    public String getCategoryDisplayName() { return categoryDisplayName; }
    public void setCategoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; }
    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public MunicipalCorporation getMunicipalCorporation() { return municipalCorporation; }
    public void setMunicipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getResolutionRemarks() { return resolutionRemarks; }
    public void setResolutionRemarks(String resolutionRemarks) { this.resolutionRemarks = resolutionRemarks; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }
    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }
    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; }
    public String getAssignedOfficerPhone() { return assignedOfficerPhone; }
    public void setAssignedOfficerPhone(String assignedOfficerPhone) { this.assignedOfficerPhone = assignedOfficerPhone; }
    public String getAssignedOfficerEmail() { return assignedOfficerEmail; }
    public void setAssignedOfficerEmail(String assignedOfficerEmail) { this.assignedOfficerEmail = assignedOfficerEmail; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public List<HistoryItemDTO> getHistory() { return history; }
    public void setHistory(List<HistoryItemDTO> history) { this.history = history; }
    public FeedbackItemDTO getFeedback() { return feedback; }
    public void setFeedback(FeedbackItemDTO feedback) { this.feedback = feedback; }
}
