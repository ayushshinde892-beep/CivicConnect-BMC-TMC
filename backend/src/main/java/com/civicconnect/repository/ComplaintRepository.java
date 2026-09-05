package com.civicconnect.repository;

import com.civicconnect.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByCategory(ComplaintCategory category);

    List<Complaint> findByMunicipalCorporation(MunicipalCorporation municipalCorporation);

    List<Complaint> findByDepartmentId(Long departmentId);

    long countByStatus(ComplaintStatus status);

    long countByPriority(Priority priority);

    long countByMunicipalCorporation(MunicipalCorporation municipalCorporation);

    long countByCategory(ComplaintCategory category);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT c.municipalCorporation, COUNT(c) FROM Complaint c GROUP BY c.municipalCorporation")
    List<Object[]> countGroupByCorporation();

    @Query("SELECT c.department.name, COUNT(c) FROM Complaint c WHERE c.department IS NOT NULL GROUP BY c.department.name")
    List<Object[]> countGroupByDepartment();

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.citizen.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:corporation IS NULL OR c.municipalCorporation = :corporation) AND " +
           "(:departmentId IS NULL OR (c.department IS NOT NULL AND c.department.id = :departmentId)) " +
           "ORDER BY c.createdAt DESC")
    Page<Complaint> searchComplaints(
            @Param("keyword") String keyword,
            @Param("status") ComplaintStatus status,
            @Param("category") ComplaintCategory category,
            @Param("priority") Priority priority,
            @Param("corporation") MunicipalCorporation corporation,
            @Param("departmentId") Long departmentId,
            Pageable pageable
    );

    @Query("SELECT c FROM Complaint c WHERE " +
           "((:officerId IS NOT NULL AND c.assignedOfficer.id = :officerId) OR " +
           " (:departmentId IS NOT NULL AND c.department.id = :departmentId)) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(c.citizen.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) " +
           "ORDER BY c.createdAt DESC")
    Page<Complaint> searchOfficerComplaints(
            @Param("officerId") Long officerId,
            @Param("departmentId") Long departmentId,
            @Param("keyword") String keyword,
            @Param("status") ComplaintStatus status,
            Pageable pageable
    );

    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);

    List<Complaint> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    long countByAssignedOfficerId(Long officerId);

    long countByAssignedOfficerIdAndStatus(Long officerId, ComplaintStatus status);

    long countByDepartmentId(Long departmentId);

    long countByDepartmentIdAndStatus(Long departmentId, ComplaintStatus status);
}
