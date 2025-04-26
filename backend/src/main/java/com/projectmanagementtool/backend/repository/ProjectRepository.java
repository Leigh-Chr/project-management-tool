package com.projectmanagementtool.backend.repository;

import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Status status);
    List<Project> findByNameContainingIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<Project> findByStatusId(Long statusId);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks LEFT JOIN FETCH p.members WHERE p.id = :id")
    Optional<Project> findByIdWithTasksAndMembers(@Param("id") Long id);
} 