package com.civicconnect.service;

import com.civicconnect.dto.ComplaintResponse;
import com.civicconnect.dto.FeedbackRequest;
import com.civicconnect.entity.Complaint;
import com.civicconnect.entity.ComplaintStatus;
import com.civicconnect.entity.Feedback;
import com.civicconnect.entity.User;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.repository.ComplaintRepository;
import com.civicconnect.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;
    private final AuthService authService;

    public FeedbackService(FeedbackRepository feedbackRepository, ComplaintRepository complaintRepository, AuthService authService) {
        this.feedbackRepository = feedbackRepository;
        this.complaintRepository = complaintRepository;
        this.authService = authService;
    }

    @Transactional
    public ComplaintResponse.FeedbackItemDTO submitFeedback(FeedbackRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + request.getComplaintId()));

        if (!complaint.getCitizen().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only provide feedback on your own complaints");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new BadRequestException("Feedback can only be submitted for RESOLVED or CLOSED complaints");
        }

        if (feedbackRepository.findByComplaintId(complaint.getId()).isPresent()) {
            throw new BadRequestException("Feedback has already been submitted for this complaint");
        }

        Feedback feedback = Feedback.builder()
                .complaint(complaint)
                .rating(request.getRating())
                .comment(request.getComment())
                .citizen(currentUser)
                .build();

        Feedback saved = feedbackRepository.save(feedback);

        return ComplaintResponse.FeedbackItemDTO.builder()
                .id(saved.getId())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .citizenName(currentUser.getName())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public ComplaintResponse.FeedbackItemDTO getFeedbackByComplaintId(Long complaintId) {
        Feedback feedback = feedbackRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found for complaint id: " + complaintId));

        return ComplaintResponse.FeedbackItemDTO.builder()
                .id(feedback.getId())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .citizenName(feedback.getCitizen().getName())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
