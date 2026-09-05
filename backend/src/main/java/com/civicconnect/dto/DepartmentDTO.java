package com.civicconnect.dto;

import com.civicconnect.entity.MunicipalCorporation;
import jakarta.validation.constraints.NotBlank;

public class DepartmentDTO {
    private Long id;

    @NotBlank(message = "Department name is required")
    private String name;

    private MunicipalCorporation municipalCorporation;
    private long officerCount;
    private long complaintCount;

    public DepartmentDTO() {
    }

    public DepartmentDTO(Long id, String name, MunicipalCorporation municipalCorporation, long officerCount, long complaintCount) {
        this.id = id;
        this.name = name;
        this.municipalCorporation = municipalCorporation;
        this.officerCount = officerCount;
        this.complaintCount = complaintCount;
    }

    public static DepartmentDTOBuilder builder() {
        return new DepartmentDTOBuilder();
    }

    public static class DepartmentDTOBuilder {
        private Long id;
        private String name;
        private MunicipalCorporation municipalCorporation;
        private long officerCount;
        private long complaintCount;

        public DepartmentDTOBuilder id(Long id) { this.id = id; return this; }
        public DepartmentDTOBuilder name(String name) { this.name = name; return this; }
        public DepartmentDTOBuilder municipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; return this; }
        public DepartmentDTOBuilder officerCount(long officerCount) { this.officerCount = officerCount; return this; }
        public DepartmentDTOBuilder complaintCount(long complaintCount) { this.complaintCount = complaintCount; return this; }

        public DepartmentDTO build() {
            return new DepartmentDTO(id, name, municipalCorporation, officerCount, complaintCount);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public MunicipalCorporation getMunicipalCorporation() { return municipalCorporation; }
    public void setMunicipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; }
    public long getOfficerCount() { return officerCount; }
    public void setOfficerCount(long officerCount) { this.officerCount = officerCount; }
    public long getComplaintCount() { return complaintCount; }
    public void setComplaintCount(long complaintCount) { this.complaintCount = complaintCount; }
}
