package com.civicconnect.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class FeedbackRequest {

    @NotNull(message = "Complaint ID is required")
    private Long complaintId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    private String comment;

    public FeedbackRequest() {
    }

    public FeedbackRequest(Long complaintId, Integer rating, String comment) {
        this.complaintId = complaintId;
        this.rating = rating;
        this.comment = comment;
    }

    public static FeedbackRequestBuilder builder() {
        return new FeedbackRequestBuilder();
    }

    public static class FeedbackRequestBuilder {
        private Long complaintId;
        private Integer rating;
        private String comment;

        public FeedbackRequestBuilder complaintId(Long complaintId) { this.complaintId = complaintId; return this; }
        public FeedbackRequestBuilder rating(Integer rating) { this.rating = rating; return this; }
        public FeedbackRequestBuilder comment(String comment) { this.comment = comment; return this; }

        public FeedbackRequest build() {
            return new FeedbackRequest(complaintId, rating, comment);
        }
    }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
