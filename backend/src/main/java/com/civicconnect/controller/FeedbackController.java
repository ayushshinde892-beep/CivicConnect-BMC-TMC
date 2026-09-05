package com.civicconnect.controller;

import com.civicconnect.dto.ComplaintResponse;
import com.civicconnect.dto.FeedbackRequest;
import com.civicconnect.exception.ApiResponse;
import com.civicconnect.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse.FeedbackItemDTO>> submitFeedback(
            @Valid @RequestBody FeedbackRequest request
    ) {
        ComplaintResponse.FeedbackItemDTO feedback = feedbackService.submitFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you for your feedback!", feedback));
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<ComplaintResponse.FeedbackItemDTO>> getFeedback(
            @PathVariable Long complaintId
    ) {
        ComplaintResponse.FeedbackItemDTO feedback = feedbackService.getFeedbackByComplaintId(complaintId);
        return ResponseEntity.ok(ApiResponse.success("Feedback retrieved", feedback));
    }
}
