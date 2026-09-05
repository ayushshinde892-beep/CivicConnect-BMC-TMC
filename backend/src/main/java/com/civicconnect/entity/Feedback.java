package com.civicconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false, unique = true)
    private Complaint complaint;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Feedback() {
    }

    public Feedback(Long id, Complaint complaint, Integer rating, String comment, User citizen, LocalDateTime createdAt) {
        this.id = id;
        this.complaint = complaint;
        this.rating = rating;
        this.comment = comment;
        this.citizen = citizen;
        this.createdAt = createdAt;
    }

    public static FeedbackBuilder builder() {
        return new FeedbackBuilder();
    }

    public static class FeedbackBuilder {
        private Long id;
        private Complaint complaint;
        private Integer rating;
        private String comment;
        private User citizen;
        private LocalDateTime createdAt;

        public FeedbackBuilder id(Long id) { this.id = id; return this; }
        public FeedbackBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public FeedbackBuilder rating(Integer rating) { this.rating = rating; return this; }
        public FeedbackBuilder comment(String comment) { this.comment = comment; return this; }
        public FeedbackBuilder citizen(User citizen) { this.citizen = citizen; return this; }
        public FeedbackBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Feedback build() {
            return new Feedback(id, complaint, rating, comment, citizen, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
