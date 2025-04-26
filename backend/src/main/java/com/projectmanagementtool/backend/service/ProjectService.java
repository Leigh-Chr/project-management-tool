package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.ProjectDetailsDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.dto.ProjectRequestDto;
import com.projectmanagementtool.backend.model.Project;

import java.util.List;

public interface ProjectService {
    List<ProjectDto> getAllProjects();
    ProjectDto getProject(Long id);
    ProjectDetailsDto getProjectDetails(Long id);
    ProjectDto createProject(ProjectRequestDto projectRequest);
    ProjectDto deleteProject(Long id);
    ProjectDto updateProject(Long id, ProjectRequestDto projectRequest);
    ProjectDto updateProjectStatus(Long id, String status);
} 