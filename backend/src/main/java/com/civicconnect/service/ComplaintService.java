package com.civicconnect.service;

import com.civicconnect.dto.*;
import com.civicconnect.entity.*;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository historyRepository;
    private final DepartmentRepository departmentRepository;
    private final OfficerRepository officerRepository;
    private final FeedbackRepository feedbackRepository;
    private final AuthService authService;

    public ComplaintService(ComplaintRepository complaintRepository, ComplaintHistoryRepository historyRepository,
                            DepartmentRepository departmentRepository, OfficerRepository officerRepository,
                            FeedbackRepository feedbackRepository, AuthService authService) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.departmentRepository = departmentRepository;
        this.officerRepository = officerRepository;
        this.feedbackRepository = feedbackRepository;
        this.authService = authService;
    }

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request) {
        User citizen = authService.getCurrentAuthenticatedUser();

        String complaintNumber = generateComplaintNumber();

        Complaint complaint = Complaint.builder()
                .complaintNumber(complaintNumber)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory())
                .status(ComplaintStatus.SUBMITTED)
                .priority(request.getPriority())
                .municipalCorporation(request.getMunicipalCorporation())
                .location(request.getLocation().trim())
                .area(request.getArea().trim())
                .pincode(request.getPincode().trim())
                .imageUrl(request.getImageUrl())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .citizen(citizen)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Add initial history record
        ComplaintHistory initialHistory = ComplaintHistory.builder()
                .complaint(savedComplaint)
                .oldStatus(null)
                .newStatus(ComplaintStatus.SUBMITTED)
                .comment("Complaint registered by citizen")
                .updatedBy(citizen.getName())
                .build();

        historyRepository.save(initialHistory);

        return mapToResponse(savedComplaint);
    }

    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        return mapToResponse(complaint);
    }

    public ComplaintResponse trackComplaint(String complaintNumber) {
        Complaint complaint = complaintRepository.findByComplaintNumber(complaintNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("No complaint found with ID: " + complaintNumber));
        return mapToResponse(complaint);
    }

    public List<ComplaintResponse> getCitizenComplaints(Long citizenId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Long targetCitizenId = (citizenId != null) ? citizenId : currentUser.getId();

        // Ensure citizens can only see their own complaints
        if (currentUser.getRole() == Role.ROLE_CITIZEN && !currentUser.getId().equals(targetCitizenId)) {
            throw new BadRequestException("You can only access your own complaints");
        }

        return complaintRepository.findByCitizenIdOrderByCreatedAtDesc(targetCitizenId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<ComplaintResponse> getAllComplaints(
            String keyword,
            ComplaintStatus status,
            ComplaintCategory category,
            Priority priority,
            MunicipalCorporation corporation,
            Long departmentId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Complaint> complaintPage = complaintRepository.searchComplaints(
                keyword, status, category, priority, corporation, departmentId, pageable
        );
        return complaintPage.map(this::mapToResponse);
    }

    public List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getComplaintsByCategory(ComplaintCategory category) {
        return complaintRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse updateComplaint(Long id, ComplaintRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            if (!complaint.getCitizen().getId().equals(currentUser.getId())) {
                throw new BadRequestException("You can only edit your own complaints");
            }
            if (complaint.getStatus() != ComplaintStatus.SUBMITTED) {
                throw new BadRequestException("Cannot edit complaint after it has been reviewed or assigned");
            }
        }

        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setCategory(request.getCategory());
        complaint.setPriority(request.getPriority());
        complaint.setMunicipalCorporation(request.getMunicipalCorporation());
        complaint.setLocation(request.getLocation().trim());
        complaint.setArea(request.getArea().trim());
        complaint.setPincode(request.getPincode().trim());
        if (request.getImageUrl() != null) {
            complaint.setImageUrl(request.getImageUrl());
        }
        if (request.getLatitude() != null) complaint.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) complaint.setLongitude(request.getLongitude());

        return mapToResponse(complaintRepository.save(complaint));
    }

    @Transactional
    public void deleteComplaint(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            if (!complaint.getCitizen().getId().equals(currentUser.getId())) {
                throw new BadRequestException("You can only delete your own complaints");
            }
            if (complaint.getStatus() != ComplaintStatus.SUBMITTED) {
                throw new BadRequestException("Cannot delete complaint that is already in progress or resolved");
            }
        }

        complaintRepository.delete(complaint);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, StatusUpdateRequest request) {
        User updater = authService.getCurrentAuthenticatedUser();
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        ComplaintStatus oldStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.getStatus();

        if (oldStatus == newStatus) {
            return mapToResponse(complaint);
        }

        // Workflow validation: cannot mark RESOLVED directly from SUBMITTED
        if (newStatus == ComplaintStatus.RESOLVED && (oldStatus == ComplaintStatus.SUBMITTED || oldStatus == ComplaintStatus.UNDER_REVIEW)) {
            throw new BadRequestException("Complaint must be assigned or in progress before it can be resolved");
        }

        complaint.setStatus(newStatus);
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            if (newStatus == ComplaintStatus.REJECTED) {
                complaint.setRejectionReason(request.getRemarks().trim());
            } else {
                complaint.setResolutionRemarks(request.getRemarks().trim());
            }
        }

        if (newStatus == ComplaintStatus.RESOLVED || newStatus == ComplaintStatus.CLOSED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        Complaint updated = complaintRepository.save(complaint);

        // Record history
        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(updated)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .comment(request.getRemarks() != null ? request.getRemarks().trim() : "Status updated to " + newStatus)
                .updatedBy(updater.getName() + " (" + updater.getRole().name().replace("ROLE_", "") + ")")
                .build();

        historyRepository.save(history);

        return mapToResponse(updated);
    }

    @Transactional
    public ComplaintResponse resolveComplaint(Long id, ResolveRequest request) {
        User updater = authService.getCurrentAuthenticatedUser();
        if (updater.getRole() == Role.ROLE_CITIZEN) {
            throw new BadRequestException("Citizens are not authorized to resolve complaints");
        }

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (complaint.getStatus() == ComplaintStatus.RESOLVED || complaint.getStatus() == ComplaintStatus.CLOSED) {
            throw new BadRequestException("Complaint is already marked as " + complaint.getStatus());
        }
        if (complaint.getStatus() == ComplaintStatus.REJECTED) {
            throw new BadRequestException("Cannot resolve a rejected complaint");
        }
        if (complaint.getStatus() == ComplaintStatus.SUBMITTED) {
            throw new BadRequestException("Complaint must be reviewed/assigned before resolution");
        }

        if (request.getRemark() == null || request.getRemark().trim().isBlank()) {
            throw new BadRequestException("Resolution remarks are required");
        }

        // Officer check: officer can only resolve complaints assigned to them or their department
        if (updater.getRole() == Role.ROLE_OFFICER) {
            Officer officer = officerRepository.findByEmail(updater.getEmail()).orElse(null);
            if (officer != null) {
                boolean isAssignedToOfficer = complaint.getAssignedOfficer() != null && complaint.getAssignedOfficer().getId().equals(officer.getId());
                boolean isAssignedToDept = complaint.getDepartment() != null && officer.getDepartment() != null && complaint.getDepartment().getId().equals(officer.getDepartment().getId());
                if (!isAssignedToOfficer && !isAssignedToDept) {
                    throw new BadRequestException("You can only resolve complaints assigned to you or your department");
                }
            }
        }

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolutionRemarks(request.getRemark().trim());
        complaint.setResolvedAt(LocalDateTime.now());

        Complaint updated = complaintRepository.save(complaint);

        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(updated)
                .oldStatus(oldStatus)
                .newStatus(ComplaintStatus.RESOLVED)
                .comment("Resolved: " + request.getRemark().trim())
                .updatedBy(updater.getName() + " (" + updater.getRole().name().replace("ROLE_", "") + ")")
                .build();

        historyRepository.save(history);

        return mapToResponse(updated);
    }

    @Transactional
    public ComplaintResponse rejectComplaint(Long id, RejectRequest request) {
        User updater = authService.getCurrentAuthenticatedUser();
        if (updater.getRole() == Role.ROLE_CITIZEN) {
            throw new BadRequestException("Citizens are not authorized to reject complaints");
        }

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (complaint.getStatus() == ComplaintStatus.RESOLVED || complaint.getStatus() == ComplaintStatus.CLOSED) {
            throw new BadRequestException("Cannot reject a resolved/closed complaint");
        }
        if (complaint.getStatus() == ComplaintStatus.REJECTED) {
            throw new BadRequestException("Complaint is already rejected");
        }

        if (request.getReason() == null || request.getReason().trim().isBlank()) {
            throw new BadRequestException("Rejection reason is required");
        }

        if (updater.getRole() == Role.ROLE_OFFICER) {
            Officer officer = officerRepository.findByEmail(updater.getEmail()).orElse(null);
            if (officer != null) {
                boolean isAssignedToOfficer = complaint.getAssignedOfficer() != null && complaint.getAssignedOfficer().getId().equals(officer.getId());
                boolean isAssignedToDept = complaint.getDepartment() != null && officer.getDepartment() != null && complaint.getDepartment().getId().equals(officer.getDepartment().getId());
                if (!isAssignedToOfficer && !isAssignedToDept) {
                    throw new BadRequestException("You can only reject complaints assigned to you or your department");
                }
            }
        }

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.REJECTED);
        complaint.setRejectionReason(request.getReason().trim());

        Complaint updated = complaintRepository.save(complaint);

        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(updated)
                .oldStatus(oldStatus)
                .newStatus(ComplaintStatus.REJECTED)
                .comment("Rejected: " + request.getReason().trim())
                .updatedBy(updater.getName() + " (" + updater.getRole().name().replace("ROLE_", "") + ")")
                .build();

        historyRepository.save(history);

        return mapToResponse(updated);
    }

    @Transactional
    public ComplaintResponse startProgress(Long id) {
        User updater = authService.getCurrentAuthenticatedUser();
        if (updater.getRole() == Role.ROLE_CITIZEN) {
            throw new BadRequestException("Citizens cannot change complaint progress");
        }

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (complaint.getStatus() == ComplaintStatus.RESOLVED || complaint.getStatus() == ComplaintStatus.CLOSED || complaint.getStatus() == ComplaintStatus.REJECTED) {
            throw new BadRequestException("Cannot move a " + complaint.getStatus() + " complaint to IN_PROGRESS");
        }

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        Complaint updated = complaintRepository.save(complaint);

        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(updated)
                .oldStatus(oldStatus)
                .newStatus(ComplaintStatus.IN_PROGRESS)
                .comment("Work in progress initiated by " + updater.getName())
                .updatedBy(updater.getName() + " (" + updater.getRole().name().replace("ROLE_", "") + ")")
                .build();

        historyRepository.save(history);

        return mapToResponse(updated);
    }

    @Transactional
    public ComplaintResponse assignDepartmentAndOfficer(Long id, AssignRequest request) {
        User updater = authService.getCurrentAuthenticatedUser();
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Officer officer = null;
        if (request.getOfficerId() != null) {
            officer = officerRepository.findById(request.getOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + request.getOfficerId()));
        }

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setDepartment(department);
        complaint.setAssignedOfficer(officer);

        // If status was SUBMITTED or UNDER_REVIEW, automatically change to ASSIGNED
        if (complaint.getStatus() == ComplaintStatus.SUBMITTED || complaint.getStatus() == ComplaintStatus.UNDER_REVIEW) {
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        Complaint updated = complaintRepository.save(complaint);

        String comment = "Assigned to department: " + department.getName() +
                (officer != null ? " (Officer: " + officer.getName() + ")" : "") +
                (request.getRemarks() != null && !request.getRemarks().isBlank() ? ". Remarks: " + request.getRemarks() : "");

        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(updated)
                .oldStatus(oldStatus)
                .newStatus(complaint.getStatus())
                .comment(comment)
                .updatedBy(updater.getName())
                .build();

        historyRepository.save(history);

        return mapToResponse(updated);
    }

    public OfficerDashboardDTO getOfficerDashboardStats() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Officer officer = officerRepository.findByEmail(currentUser.getEmail()).orElse(null);

        Long officerId = (officer != null) ? officer.getId() : null;
        Long deptId = (officer != null && officer.getDepartment() != null) ? officer.getDepartment().getId() : null;

        List<Complaint> officerComplaints = (officerId != null)
                ? complaintRepository.findByAssignedOfficerIdOrderByCreatedAtDesc(officerId)
                : (deptId != null ? complaintRepository.findByDepartmentIdOrderByCreatedAtDesc(deptId) : complaintRepository.findAll());

        long total = officerComplaints.size();
        long pending = officerComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.ASSIGNED || c.getStatus() == ComplaintStatus.UNDER_REVIEW || c.getStatus() == ComplaintStatus.SUBMITTED).count();
        long inProgress = officerComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS).count();
        long resolved = officerComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED).count();
        long rejected = officerComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.REJECTED).count();
        long urgent = officerComplaints.stream().filter(c -> c.getPriority() == Priority.URGENT).count();

        Map<String, Long> byStatus = officerComplaints.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus().name(), Collectors.counting()));

        Map<String, Long> byCategory = officerComplaints.stream()
                .collect(Collectors.groupingBy(c -> c.getCategory().getDisplayName(), Collectors.counting()));

        List<ComplaintResponse> recent = officerComplaints.stream()
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return OfficerDashboardDTO.builder()
                .officerId(officerId)
                .officerName(officer != null ? officer.getName() : currentUser.getName())
                .officerEmail(currentUser.getEmail())
                .departmentName(officer != null && officer.getDepartment() != null ? officer.getDepartment().getName() : "All Municipal Operations")
                .corporation(officer != null && officer.getDepartment() != null ? officer.getDepartment().getMunicipalCorporation().name() : "BMC/TMC")
                .totalAssigned(total)
                .pendingComplaints(pending)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .rejectedComplaints(rejected)
                .urgentComplaints(urgent)
                .complaintsByStatus(byStatus)
                .complaintsByCategory(byCategory)
                .recentComplaints(recent)
                .build();
    }

    public Page<ComplaintResponse> getOfficerAssignedComplaints(
            String keyword,
            ComplaintStatus status,
            int page,
            int size
    ) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Officer officer = officerRepository.findByEmail(currentUser.getEmail()).orElse(null);

        Long officerId = (officer != null) ? officer.getId() : null;
        Long deptId = (officer != null && officer.getDepartment() != null) ? officer.getDepartment().getId() : null;

        Pageable pageable = PageRequest.of(page, size);
        Page<Complaint> complaintPage = complaintRepository.searchOfficerComplaints(
                officerId, deptId, keyword, status, pageable
        );
        return complaintPage.map(this::mapToResponse);
    }

    public DashboardStatsDTO getDashboardStats() {
        long total = complaintRepository.count();
        long submitted = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long underReview = complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW);
        long assigned = complaintRepository.countByStatus(ComplaintStatus.ASSIGNED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long rejected = complaintRepository.countByStatus(ComplaintStatus.REJECTED);
        long urgent = complaintRepository.countByPriority(Priority.URGENT);

        long bmc = complaintRepository.countByMunicipalCorporation(MunicipalCorporation.BMC);
        long tmc = complaintRepository.countByMunicipalCorporation(MunicipalCorporation.TMC);

        Map<String, Long> byCategory = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupByCategory()) {
            byCategory.put(((ComplaintCategory) row[0]).getDisplayName(), (Long) row[1]);
        }

        Map<String, Long> byStatus = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupByStatus()) {
            byStatus.put(((ComplaintStatus) row[0]).name(), (Long) row[1]);
        }

        Map<String, Long> byCorporation = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupByCorporation()) {
            byCorporation.put(((MunicipalCorporation) row[0]).name(), (Long) row[1]);
        }

        Map<String, Long> byDept = new HashMap<>();
        for (Object[] row : complaintRepository.countGroupByDepartment()) {
            byDept.put((String) row[0], (Long) row[1]);
        }

        return DashboardStatsDTO.builder()
                .totalComplaints(total)
                .submittedComplaints(submitted)
                .underReviewComplaints(underReview)
                .assignedComplaints(assigned)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .rejectedComplaints(rejected)
                .urgentComplaints(urgent)
                .bmcComplaints(bmc)
                .tmcComplaints(tmc)
                .complaintsByCategory(byCategory)
                .complaintsByStatus(byStatus)
                .complaintsByCorporation(byCorporation)
                .complaintsByDepartment(byDept)
                .build();
    }

    private synchronized String generateComplaintNumber() {
        int currentYear = Year.now().getValue();
        long count = complaintRepository.count() + 1;
        return String.format("CMP-%d-%04d", currentYear, count);
    }

    public ComplaintResponse mapToResponse(Complaint complaint) {
        List<ComplaintResponse.HistoryItemDTO> historyDTOs = historyRepository
                .findByComplaintIdOrderByCreatedAtAsc(complaint.getId())
                .stream()
                .map(h -> ComplaintResponse.HistoryItemDTO.builder()
                        .id(h.getId())
                        .oldStatus(h.getOldStatus())
                        .newStatus(h.getNewStatus())
                        .comment(h.getComment())
                        .updatedBy(h.getUpdatedBy())
                        .createdAt(h.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        ComplaintResponse.FeedbackItemDTO feedbackDTO = null;
        Optional<Feedback> feedbackOpt = feedbackRepository.findByComplaintId(complaint.getId());
        if (feedbackOpt.isPresent()) {
            Feedback f = feedbackOpt.get();
            feedbackDTO = ComplaintResponse.FeedbackItemDTO.builder()
                    .id(f.getId())
                    .rating(f.getRating())
                    .comment(f.getComment())
                    .citizenName(f.getCitizen() != null ? f.getCitizen().getName() : null)
                    .createdAt(f.getCreatedAt())
                    .build();
        }

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .complaintNumber(complaint.getComplaintNumber())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .categoryDisplayName(complaint.getCategory() != null ? complaint.getCategory().getDisplayName() : null)
                .status(complaint.getStatus())
                .priority(complaint.getPriority())
                .municipalCorporation(complaint.getMunicipalCorporation())
                .location(complaint.getLocation())
                .area(complaint.getArea())
                .pincode(complaint.getPincode())
                .imageUrl(complaint.getImageUrl())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .resolutionRemarks(complaint.getResolutionRemarks())
                .rejectionReason(complaint.getRejectionReason())
                .citizenId(complaint.getCitizen() != null ? complaint.getCitizen().getId() : null)
                .citizenName(complaint.getCitizen() != null ? complaint.getCitizen().getName() : null)
                .citizenEmail(complaint.getCitizen() != null ? complaint.getCitizen().getEmail() : null)
                .citizenPhone(complaint.getCitizen() != null ? complaint.getCitizen().getPhone() : null)
                .departmentId(complaint.getDepartment() != null ? complaint.getDepartment().getId() : null)
                .departmentName(complaint.getDepartment() != null ? complaint.getDepartment().getName() : null)
                .assignedOfficerId(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getId() : null)
                .assignedOfficerName(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getName() : null)
                .assignedOfficerPhone(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getPhone() : null)
                .assignedOfficerEmail(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getEmail() : null)
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .history(historyDTOs)
                .feedback(feedbackDTO)
                .build();
    }
}
