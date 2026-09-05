package com.civicconnect.controller;

import com.civicconnect.dto.ComplaintRequest;
import com.civicconnect.dto.ComplaintResponse;
import com.civicconnect.entity.ComplaintCategory;
import com.civicconnect.entity.ComplaintStatus;
import com.civicconnect.entity.MunicipalCorporation;
import com.civicconnect.entity.Priority;
import com.civicconnect.exception.ApiResponse;
import com.civicconnect.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        ComplaintResponse response = complaintService.createComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint registered successfully. Your Complaint ID is " + response.getComplaintNumber(), response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ComplaintResponse>>> getAllComplaints(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) ComplaintCategory category,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) MunicipalCorporation corporation,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ComplaintResponse> complaints = complaintService.getAllComplaints(
                keyword, status, category, priority, corporation, departmentId, page, size
        );
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched successfully", complaints));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintById(@PathVariable Long id) {
        ComplaintResponse response = complaintService.getComplaintById(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint retrieved", response));
    }

    @GetMapping("/track/{complaintNumber}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> trackComplaint(@PathVariable String complaintNumber) {
        ComplaintResponse response = complaintService.trackComplaint(complaintNumber);
        return ResponseEntity.ok(ApiResponse.success("Complaint tracking details found", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getMyComplaints() {
        List<ComplaintResponse> complaints = complaintService.getCitizenComplaints(null);
        return ResponseEntity.ok(ApiResponse.success("My complaints retrieved", complaints));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getComplaintsByCitizen(@PathVariable Long citizenId) {
        List<ComplaintResponse> complaints = complaintService.getCitizenComplaints(citizenId);
        return ResponseEntity.ok(ApiResponse.success("Citizen complaints retrieved", complaints));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getComplaintsByStatus(@PathVariable ComplaintStatus status) {
        List<ComplaintResponse> complaints = complaintService.getComplaintsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Complaints filtered by status", complaints));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getComplaintsByCategory(@PathVariable ComplaintCategory category) {
        List<ComplaintResponse> complaints = complaintService.getComplaintsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Complaints filtered by category", complaints));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintRequest request
    ) {
        ComplaintResponse response = complaintService.updateComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint updated successfully", response));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<ComplaintResponse>> resolveComplaint(
            @PathVariable Long id,
            @Valid @RequestBody com.civicconnect.dto.ResolveRequest request
    ) {
        ComplaintResponse response = complaintService.resolveComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint marked as resolved successfully", response));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ComplaintResponse>> rejectComplaint(
            @PathVariable Long id,
            @Valid @RequestBody com.civicconnect.dto.RejectRequest request
    ) {
        ComplaintResponse response = complaintService.rejectComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint rejected with reason", response));
    }

    @PutMapping("/{id}/start-progress")
    public ResponseEntity<ApiResponse<ComplaintResponse>> startProgress(@PathVariable Long id) {
        ComplaintResponse response = complaintService.startProgress(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint moved to In Progress", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint deleted successfully"));
    }
}
