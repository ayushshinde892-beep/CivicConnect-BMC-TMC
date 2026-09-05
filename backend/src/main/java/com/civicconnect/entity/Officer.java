package com.civicconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "officers")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    public Officer() {
    }

    public Officer(Long id, String name, String email, String phone, Department department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
    }

    public static OfficerBuilder builder() {
        return new OfficerBuilder();
    }

    public static class OfficerBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Department department;

        public OfficerBuilder id(Long id) { this.id = id; return this; }
        public OfficerBuilder name(String name) { this.name = name; return this; }
        public OfficerBuilder email(String email) { this.email = email; return this; }
        public OfficerBuilder phone(String phone) { this.phone = phone; return this; }
        public OfficerBuilder department(Department department) { this.department = department; return this; }

        public Officer build() {
            return new Officer(id, name, email, phone, department);
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

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
}
