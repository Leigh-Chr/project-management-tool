package com.projectmanagementtool.backend.repository;

import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Status status);
    List<Project> findByNameContainingIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<Project> findByStatusId(Long statusId);
} 