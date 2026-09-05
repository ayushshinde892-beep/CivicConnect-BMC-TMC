package com.civicconnect.controller;

import com.civicconnect.dto.ComplaintResponse;
import com.civicconnect.dto.OfficerDashboardDTO;
import com.civicconnect.dto.RejectRequest;
import com.civicconnect.dto.ResolveRequest;
import com.civicconnect.entity.ComplaintStatus;
import com.civicconnect.exception.ApiResponse;
import com.civicconnect.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer")
public class OfficerPortalController {

    private final ComplaintService complaintService;

    public OfficerPortalController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<OfficerDashboardDTO>> getOfficerDashboard() {
        OfficerDashboardDTO stats = complaintService.getOfficerDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Officer dashboard statistics fetched", stats));
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>> getAssignedComplaints(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ComplaintResponse> complaints = complaintService.getOfficerAssignedComplaints(keyword, status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Assigned complaints fetched successfully", complaints));
    }

    @PutMapping("/complaints/{id}/start-progress")
    public ResponseEntity<ApiResponse<ComplaintResponse>> startProgress(@PathVariable Long id) {
        ComplaintResponse response = complaintService.startProgress(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint moved to In Progress", response));
    }

    @PutMapping("/complaints/{id}/resolve")
    public ResponseEntity<ApiResponse<ComplaintResponse>> resolveComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ResolveRequest request
    ) {
        ComplaintResponse response = complaintService.resolveComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint resolved successfully", response));
    }

    @PutMapping("/complaints/{id}/reject")
    public ResponseEntity<ApiResponse<ComplaintResponse>> rejectComplaint(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest request
    ) {
        ComplaintResponse response = complaintService.rejectComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint rejected with reason", response));
    }
}
