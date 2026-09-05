package com.civicconnect.service;

import com.civicconnect.dto.DepartmentDTO;
import com.civicconnect.entity.Department;
import com.civicconnect.entity.MunicipalCorporation;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.repository.ComplaintRepository;
import com.civicconnect.repository.DepartmentRepository;
import com.civicconnect.repository.OfficerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final OfficerRepository officerRepository;
    private final ComplaintRepository complaintRepository;

    public DepartmentService(DepartmentRepository departmentRepository, OfficerRepository officerRepository,
                             ComplaintRepository complaintRepository) {
        this.departmentRepository = departmentRepository;
        this.officerRepository = officerRepository;
        this.complaintRepository = complaintRepository;
    }

    public List<DepartmentDTO> getAllDepartments(MunicipalCorporation corp) {
        List<Department> list = (corp != null)
                ? departmentRepository.findByMunicipalCorporation(corp)
                : departmentRepository.findAll();

        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapToDTO(dept);
    }

    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.findByName(dto.getName()).isPresent()) {
            throw new BadRequestException("Department with name '" + dto.getName() + "' already exists");
        }
        Department dept = Department.builder()
                .name(dto.getName().trim())
                .municipalCorporation(dto.getMunicipalCorporation())
                .build();
        return mapToDTO(departmentRepository.save(dept));
    }

    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        dept.setName(dto.getName().trim());
        dept.setMunicipalCorporation(dto.getMunicipalCorporation());
        return mapToDTO(departmentRepository.save(dept));
    }

    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        departmentRepository.delete(dept);
    }

    private DepartmentDTO mapToDTO(Department dept) {
        long officerCount = officerRepository.findByDepartmentId(dept.getId()).size();
        long complaintCount = complaintRepository.findByDepartmentId(dept.getId()).size();

        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .municipalCorporation(dept.getMunicipalCorporation())
                .officerCount(officerCount)
                .complaintCount(complaintCount)
                .build();
    }
}
