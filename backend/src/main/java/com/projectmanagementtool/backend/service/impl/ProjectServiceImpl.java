package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.dto.ProjectDetailsDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.dto.ProjectRequestDto;
import com.projectmanagementtool.backend.mapper.ProjectMapper;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.repository.ProjectRepository;
import com.projectmanagementtool.backend.repository.StatusRepository;
import com.projectmanagementtool.backend.service.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final StatusRepository statusRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDto getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        return projectMapper.toDto(project);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDetailsDto getProjectDetails(Long id) {
        Project project = projectRepository.findByIdWithTasksAndMembers(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        return projectMapper.toDetailsDto(project);
    }

    @Override
    @Transactional
    public ProjectDto createProject(ProjectRequestDto projectRequest) {
        Status status = statusRepository.findById(projectRequest.getStatusId())
                .orElseThrow(() -> new EntityNotFoundException("Status not found with id: " + projectRequest.getStatusId()));

        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setStartDate(projectRequest.getStartDate());
        project.setEndDate(projectRequest.getEndDate());
        project.setStatus(status);

        Project savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject);
    }

    @Override
    @Transactional
    public ProjectDto deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
        return projectMapper.toDto(project);
    }

    @Override
    @Transactional
    public ProjectDto updateProject(Long id, ProjectRequestDto projectRequest) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        
        Status status = statusRepository.findById(projectRequest.getStatusId())
                .orElseThrow(() -> new EntityNotFoundException("Status not found with id: " + projectRequest.getStatusId()));
        
        existingProject.setName(projectRequest.getName());
        existingProject.setDescription(projectRequest.getDescription());
        existingProject.setStartDate(projectRequest.getStartDate());
        existingProject.setEndDate(projectRequest.getEndDate());
        existingProject.setStatus(status);
        
        Project updatedProject = projectRepository.save(existingProject);
        return projectMapper.toDto(updatedProject);
    }

    @Override
    @Transactional
    public ProjectDto updateProjectStatus(Long id, String statusName) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        
        Status status = statusRepository.findByName(statusName)
                .orElseThrow(() -> new EntityNotFoundException("Status not found with name: " + statusName));
        
        project.setStatus(status);
        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDto(updatedProject);
    }
} 