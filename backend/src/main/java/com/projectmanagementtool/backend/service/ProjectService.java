package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.Status;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    
    List<Project> getProjectsByStatusId(Long statusId);
    
    Project getProjectById(Long id);
    
    Project createProject(Project project);
    
    Project updateProject(Long id, Project project);
    
    Project updateProjectStatus(Long id, Status status);
    
    void deleteProject(Long id);
} 