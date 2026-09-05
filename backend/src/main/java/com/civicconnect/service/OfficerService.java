package com.civicconnect.service;

import com.civicconnect.dto.OfficerDTO;
import com.civicconnect.entity.Department;
import com.civicconnect.entity.Officer;
import com.civicconnect.exception.BadRequestException;
import com.civicconnect.exception.ResourceNotFoundException;
import com.civicconnect.repository.DepartmentRepository;
import com.civicconnect.repository.OfficerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfficerService {

    private final OfficerRepository officerRepository;
    private final DepartmentRepository departmentRepository;

    public OfficerService(OfficerRepository officerRepository, DepartmentRepository departmentRepository) {
        this.officerRepository = officerRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<OfficerDTO> getAllOfficers(Long departmentId) {
        List<Officer> list = (departmentId != null)
                ? officerRepository.findByDepartmentId(departmentId)
                : officerRepository.findAll();

        return list.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public OfficerDTO getOfficerById(Long id) {
        Officer officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
        return mapToDTO(officer);
    }

    public OfficerDTO createOfficer(OfficerDTO dto) {
        if (officerRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Officer with email '" + dto.getEmail() + "' already exists");
        }

        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        Officer officer = Officer.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .phone(dto.getPhone().trim())
                .department(dept)
                .build();

        return mapToDTO(officerRepository.save(officer));
    }

    public OfficerDTO updateOfficer(Long id, OfficerDTO dto) {
        Officer officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));

        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        officer.setName(dto.getName().trim());
        officer.setEmail(dto.getEmail().trim().toLowerCase());
        officer.setPhone(dto.getPhone().trim());
        officer.setDepartment(dept);

        return mapToDTO(officerRepository.save(officer));
    }

    public void deleteOfficer(Long id) {
        Officer officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
        officerRepository.delete(officer);
    }

    private OfficerDTO mapToDTO(Officer officer) {
        return OfficerDTO.builder()
                .id(officer.getId())
                .name(officer.getName())
                .email(officer.getEmail())
                .phone(officer.getPhone())
                .departmentId(officer.getDepartment() != null ? officer.getDepartment().getId() : null)
                .departmentName(officer.getDepartment() != null ? officer.getDepartment().getName() : null)
                .build();
    }
}
