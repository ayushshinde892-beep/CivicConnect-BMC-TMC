package com.civicconnect.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_number", nullable = false, unique = true)
    private String complaintNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "municipal_corporation", nullable = false)
    private MunicipalCorporation municipalCorporation;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String pincode;

    @Column(name = "image_url")
    private String imageUrl;

    private Double latitude;

    private Double longitude;

    @Column(name = "resolution_remarks", columnDefinition = "TEXT")
    private String resolutionRemarks;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_officer_id")
    private Officer assignedOfficer;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<ComplaintHistory> history = new ArrayList<>();

    @OneToOne(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    private Feedback feedback;

    public Complaint() {
    }

    public Complaint(Long id, String complaintNumber, String title, String description,
                     ComplaintCategory category, ComplaintStatus status, Priority priority,
                     MunicipalCorporation municipalCorporation, String location, String area,
                     String pincode, String imageUrl, Double latitude, Double longitude,
                     String resolutionRemarks, String rejectionReason, User citizen, Department department,
                     Officer assignedOfficer, LocalDateTime createdAt, LocalDateTime updatedAt,
                     LocalDateTime resolvedAt, List<ComplaintHistory> history, Feedback feedback) {
        this.id = id;
        this.complaintNumber = complaintNumber;
        this.title = title;
        this.description = description;
        this.category = category;
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
        this.citizen = citizen;
        this.department = department;
        this.assignedOfficer = assignedOfficer;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.history = (history != null) ? history : new ArrayList<>();
        this.feedback = feedback;
    }

    public static ComplaintBuilder builder() {
        return new ComplaintBuilder();
    }

    public static class ComplaintBuilder {
        private Long id;
        private String complaintNumber;
        private String title;
        private String description;
        private ComplaintCategory category;
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
        private User citizen;
        private Department department;
        private Officer assignedOfficer;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime resolvedAt;
        private List<ComplaintHistory> history = new ArrayList<>();
        private Feedback feedback;

        public ComplaintBuilder id(Long id) { this.id = id; return this; }
        public ComplaintBuilder complaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; return this; }
        public ComplaintBuilder title(String title) { this.title = title; return this; }
        public ComplaintBuilder description(String description) { this.description = description; return this; }
        public ComplaintBuilder category(ComplaintCategory category) { this.category = category; return this; }
        public ComplaintBuilder status(ComplaintStatus status) { this.status = status; return this; }
        public ComplaintBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ComplaintBuilder municipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; return this; }
        public ComplaintBuilder location(String location) { this.location = location; return this; }
        public ComplaintBuilder area(String area) { this.area = area; return this; }
        public ComplaintBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public ComplaintBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ComplaintBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ComplaintBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ComplaintBuilder resolutionRemarks(String resolutionRemarks) { this.resolutionRemarks = resolutionRemarks; return this; }
        public ComplaintBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public ComplaintBuilder citizen(User citizen) { this.citizen = citizen; return this; }
        public ComplaintBuilder department(Department department) { this.department = department; return this; }
        public ComplaintBuilder assignedOfficer(Officer assignedOfficer) { this.assignedOfficer = assignedOfficer; return this; }
        public ComplaintBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ComplaintBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public ComplaintBuilder history(List<ComplaintHistory> history) { this.history = history; return this; }
        public ComplaintBuilder feedback(Feedback feedback) { this.feedback = feedback; return this; }

        public Complaint build() {
            return new Complaint(id, complaintNumber, title, description, category, status, priority,
                    municipalCorporation, location, area, pincode, imageUrl, latitude, longitude,
                    resolutionRemarks, rejectionReason, citizen, department, assignedOfficer, createdAt, updatedAt,
                    resolvedAt, history, feedback);
        }
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

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Officer getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(Officer assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public List<ComplaintHistory> getHistory() { return history; }
    public void setHistory(List<ComplaintHistory> history) { this.history = history; }

    public Feedback getFeedback() { return feedback; }
    public void setFeedback(Feedback feedback) { this.feedback = feedback; }
}
