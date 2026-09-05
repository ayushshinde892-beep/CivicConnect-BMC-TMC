package com.civicconnect.controller;

import com.civicconnect.dto.OfficerDTO;
import com.civicconnect.exception.ApiResponse;
import com.civicconnect.service.OfficerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OfficerDTO>>> getAllOfficers(
            @RequestParam(required = false) Long departmentId
    ) {
        List<OfficerDTO> list = officerService.getAllOfficers(departmentId);
        return ResponseEntity.ok(ApiResponse.success("Officers retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OfficerDTO>> getOfficerById(@PathVariable Long id) {
        OfficerDTO officer = officerService.getOfficerById(id);
        return ResponseEntity.ok(ApiResponse.success("Officer retrieved", officer));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OfficerDTO>> createOfficer(@Valid @RequestBody OfficerDTO dto) {
        OfficerDTO created = officerService.createOfficer(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Officer created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OfficerDTO>> updateOfficer(
            @PathVariable Long id,
            @Valid @RequestBody OfficerDTO dto
    ) {
        OfficerDTO updated = officerService.updateOfficer(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Officer updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOfficer(@PathVariable Long id) {
        officerService.deleteOfficer(id);
        return ResponseEntity.ok(ApiResponse.success("Officer deleted successfully"));
    }
}
