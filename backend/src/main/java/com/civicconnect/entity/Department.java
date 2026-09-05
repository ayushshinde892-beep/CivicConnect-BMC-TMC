package com.civicconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "municipal_corporation")
    private MunicipalCorporation municipalCorporation;

    public Department() {
    }

    public Department(Long id, String name, MunicipalCorporation municipalCorporation) {
        this.id = id;
        this.name = name;
        this.municipalCorporation = municipalCorporation;
    }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private Long id;
        private String name;
        private MunicipalCorporation municipalCorporation;

        public DepartmentBuilder id(Long id) { this.id = id; return this; }
        public DepartmentBuilder name(String name) { this.name = name; return this; }
        public DepartmentBuilder municipalCorporation(MunicipalCorporation municipalCorporation) {
            this.municipalCorporation = municipalCorporation;
            return this;
        }

        public Department build() {
            return new Department(id, name, municipalCorporation);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public MunicipalCorporation getMunicipalCorporation() { return municipalCorporation; }
    public void setMunicipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; }
}
