package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.ProjectDetailsDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.dto.ProjectRequestDto;
import com.projectmanagementtool.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ProjectDetailsDto> getProjectDetails(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectDetails(id));
    }

    @GetMapping("/status/{statusId}")
    public ResponseEntity<List<ProjectDto>> getProjectsByStatus(@PathVariable Long statusId) {
        return ResponseEntity.ok(projectService.getProjectsByStatusId(statusId));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectRequestDto projectRequest) {
        return ResponseEntity.ok(projectService.createProject(projectRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequestDto projectRequest) {
        return ResponseEntity.ok(projectService.updateProject(id, projectRequest));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectDto> updateProjectStatus(@PathVariable Long id, @RequestBody String status) {
        return ResponseEntity.ok(projectService.updateProjectStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProjectDto> deleteProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.deleteProject(id));
    }
} 