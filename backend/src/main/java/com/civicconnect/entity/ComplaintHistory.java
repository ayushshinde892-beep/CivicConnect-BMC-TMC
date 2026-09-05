package com.civicconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_history")
public class ComplaintHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private ComplaintStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private ComplaintStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "updated_by")
    private String updatedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ComplaintHistory() {
    }

    public ComplaintHistory(Long id, Complaint complaint, ComplaintStatus oldStatus, ComplaintStatus newStatus, String comment, String updatedBy, LocalDateTime createdAt) {
        this.id = id;
        this.complaint = complaint;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.comment = comment;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
    }

    public static ComplaintHistoryBuilder builder() {
        return new ComplaintHistoryBuilder();
    }

    public static class ComplaintHistoryBuilder {
        private Long id;
        private Complaint complaint;
        private ComplaintStatus oldStatus;
        private ComplaintStatus newStatus;
        private String comment;
        private String updatedBy;
        private LocalDateTime createdAt;

        public ComplaintHistoryBuilder id(Long id) { this.id = id; return this; }
        public ComplaintHistoryBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public ComplaintHistoryBuilder oldStatus(ComplaintStatus oldStatus) { this.oldStatus = oldStatus; return this; }
        public ComplaintHistoryBuilder newStatus(ComplaintStatus newStatus) { this.newStatus = newStatus; return this; }
        public ComplaintHistoryBuilder comment(String comment) { this.comment = comment; return this; }
        public ComplaintHistoryBuilder updatedBy(String updatedBy) { this.updatedBy = updatedBy; return this; }
        public ComplaintHistoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ComplaintHistory build() {
            return new ComplaintHistory(id, complaint, oldStatus, newStatus, comment, updatedBy, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

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
