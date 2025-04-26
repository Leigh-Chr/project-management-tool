package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.ProjectMemberDto;
import com.projectmanagementtool.backend.dto.ProjectMemberRequestDto;
import com.projectmanagementtool.backend.mapper.ProjectMemberMapper;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project-members")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;
    private final ProjectMemberMapper projectMemberMapper;

    @GetMapping("/{id}")
    public ResponseEntity<ProjectMemberDto> getProjectMember(@PathVariable Long id) {
        return projectMemberService.findById(id)
                .map(projectMemberMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers() {
        List<ProjectMemberDto> dtos = projectMemberService.findAll().stream()
                .map(projectMemberMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembersByProject(@PathVariable Long projectId) {
        List<ProjectMemberDto> dtos = projectMemberService.findByProjectId(projectId).stream()
                .map(projectMemberMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembersByUser(@PathVariable Long userId) {
        List<ProjectMemberDto> dtos = projectMemberService.findByUserId(userId).stream()
                .map(projectMemberMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/project/{projectId}/user/{userId}")
    public ResponseEntity<ProjectMemberDto> getProjectMemberByProjectAndUser(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        return projectMemberService.findByProjectIdAndUserId(projectId, userId)
                .map(projectMemberMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProjectMemberDto> createProjectMember(@RequestBody ProjectMemberRequestDto request) {
        ProjectMember saved = projectMemberService.createProjectMember(request);
        return ResponseEntity.ok(projectMemberMapper.toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProjectMemberDto> deleteProjectMember(@PathVariable Long id) {
        return projectMemberService.findById(id)
                .map(member -> {
                    projectMemberService.deleteById(id);
                    return ResponseEntity.ok(projectMemberMapper.toDto(member));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectMemberDto> updateProjectMember(
            @PathVariable Long id,
            @RequestBody ProjectMemberRequestDto request) {
        ProjectMember updated = projectMemberService.updateProjectMember(id, request);
        return ResponseEntity.ok(projectMemberMapper.toDto(updated));
    }
} 