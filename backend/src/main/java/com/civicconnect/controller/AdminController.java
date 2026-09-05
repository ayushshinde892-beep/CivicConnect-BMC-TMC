package com.civicconnect.controller;

import com.civicconnect.dto.AssignRequest;
import com.civicconnect.dto.ComplaintResponse;
import com.civicconnect.dto.DashboardStatsDTO;
import com.civicconnect.dto.StatusUpdateRequest;
import com.civicconnect.entity.Role;
import com.civicconnect.entity.User;
import com.civicconnect.exception.ApiResponse;
import com.civicconnect.repository.UserRepository;
import com.civicconnect.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    public AdminController(ComplaintService complaintService, UserRepository userRepository) {
        this.complaintService = complaintService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = complaintService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics fetched", stats));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        ComplaintResponse response = complaintService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated successfully", response));
    }

    @PutMapping("/complaints/{id}/assign")
    public ResponseEntity<ApiResponse<ComplaintResponse>> assignComplaint(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequest request
    ) {
        ComplaintResponse response = complaintService.assignDepartmentAndOfficer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned successfully", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(@RequestParam(required = false) Role role) {
        List<User> users = (role != null) ? userRepository.findByRole(role) : userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }
}
