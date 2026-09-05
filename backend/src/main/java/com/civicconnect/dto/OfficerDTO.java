package com.civicconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OfficerDTO {
    private Long id;

    @NotBlank(message = "Officer name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private String departmentName;

    public OfficerDTO() {
    }

    public OfficerDTO(Long id, String name, String email, String phone, Long departmentId, String departmentName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }

    public static OfficerDTOBuilder builder() {
        return new OfficerDTOBuilder();
    }

    public static class OfficerDTOBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Long departmentId;
        private String departmentName;

        public OfficerDTOBuilder id(Long id) { this.id = id; return this; }
        public OfficerDTOBuilder name(String name) { this.name = name; return this; }
        public OfficerDTOBuilder email(String email) { this.email = email; return this; }
        public OfficerDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public OfficerDTOBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public OfficerDTOBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }

        public OfficerDTO build() {
            return new OfficerDTO(id, name, email, phone, departmentId, departmentName);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
}
