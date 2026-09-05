package com.civicconnect.controller;

import com.civicconnect.dto.DepartmentDTO;
import com.civicconnect.entity.MunicipalCorporation;
import com.civicconnect.exception.ApiResponse;
import com.civicconnect.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments(
            @RequestParam(required = false) MunicipalCorporation corporation
    ) {
        List<DepartmentDTO> list = departmentService.getAllDepartments(corporation);
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable Long id) {
        DepartmentDTO dept = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success("Department retrieved", dept));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@Valid @RequestBody DepartmentDTO dto) {
        DepartmentDTO created = departmentService.createDepartment(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentDTO dto
    ) {
        DepartmentDTO updated = departmentService.updateDepartment(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully"));
    }
}
