package com.projectmanagementtool.backend.repository;

import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByNameContainingIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    List<Project> findByProjectStatusId(Long projectStatusId);
    List<Project> findByProjectManagerId(Long projectManagerId);
    List<Project> findByProjectTypeId(Long projectTypeId);
    List<Project> findByProjectManagerIdAndProjectStatusId(Long projectManagerId, Long projectStatusId);
    List<Project> findByProjectManagerIdAndProjectTypeId(Long projectManagerId, Long projectTypeId);
    List<Project> findByProjectTypeIdAndProjectStatusId(Long projectTypeId, Long projectStatusId);
    List<Project> findByProjectManagerIdAndProjectTypeIdAndProjectStatusId(Long projectManagerId, Long projectTypeId, Long projectStatusId);
} 