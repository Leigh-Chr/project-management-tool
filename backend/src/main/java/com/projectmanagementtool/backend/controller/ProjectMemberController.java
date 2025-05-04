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
@RequestMapping("/api/projects/{projectId}/members")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;
    private final ProjectMemberMapper projectMemberMapper;

    @GetMapping("/{id}")
    public ResponseEntity<ProjectMemberDto> getProjectMember(@PathVariable Long projectId, @PathVariable Long id) {
        return projectMemberService.findById(id)
                .filter(member -> member.getProject().getId().equals(projectId))
                .map(projectMemberMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers(@PathVariable Long projectId) {
        List<ProjectMemberDto> dtos = projectMemberService.findByProjectId(projectId).stream()
                .map(projectMemberMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<ProjectMemberDto> createProjectMember(
            @PathVariable Long projectId,
            @RequestBody ProjectMemberRequestDto request) {
        
        // S'assurer que projectId dans le chemin correspond à celui dans la requête
        request.setProjectId(projectId);
        
        ProjectMember projectMember = projectMemberService.createProjectMember(request);
        return ResponseEntity.ok(projectMemberMapper.toDto(projectMember));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjectMember(@PathVariable Long projectId, @PathVariable Long id) {
        ProjectMember member = projectMemberService.getProjectMember(id);
        if (!member.getProject().getId().equals(projectId)) {
            return ResponseEntity.notFound().build();
        }
        
        projectMemberService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/role/{roleId}")
    public ResponseEntity<ProjectMemberDto> updateProjectMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long id,
            @PathVariable Long roleId) {
        
        ProjectMember member = projectMemberService.getProjectMember(id);
        if (!member.getProject().getId().equals(projectId)) {
            return ResponseEntity.notFound().build();
        }
        
        // Créer une demande pour mettre à jour le rôle
        ProjectMemberRequestDto request = new ProjectMemberRequestDto();
        request.setProjectId(projectId);
        request.setUserId(member.getUser().getId());
        request.setRoleId(roleId);
        
        ProjectMember updatedMember = projectMemberService.updateProjectMember(id, request);
        return ResponseEntity.ok(projectMemberMapper.toDto(updatedMember));
    }
} 