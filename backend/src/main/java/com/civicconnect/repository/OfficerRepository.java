package com.civicconnect.repository;

import com.civicconnect.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByEmail(String email);
    List<Officer> findByDepartmentId(Long departmentId);
}
