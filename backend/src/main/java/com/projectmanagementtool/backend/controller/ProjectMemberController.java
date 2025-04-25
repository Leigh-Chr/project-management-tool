package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.ProjectMemberDTO;
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
    public ResponseEntity<ProjectMemberDTO> getProjectMember(@PathVariable Long id) {
        return projectMemberService.findById(id)
                .map(projectMemberMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers() {
        List<ProjectMemberDTO> dtos = projectMemberService.findAll().stream()
                .map(projectMemberMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembersByProject(@PathVariable Long projectId) {
        List<ProjectMemberDTO> dtos = projectMemberService.findByProjectId(projectId).stream()
                .map(projectMemberMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<ProjectMemberDTO> createProjectMember(@RequestBody ProjectMember projectMember) {
        ProjectMember saved = projectMemberService.save(projectMember);
        return ResponseEntity.ok(projectMemberMapper.toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProjectMemberDTO> deleteProjectMember(@PathVariable Long id) {
        return projectMemberService.findById(id)
                .map(member -> {
                    projectMemberService.deleteById(id);
                    return ResponseEntity.ok(projectMemberMapper.toDTO(member));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectMemberDTO> updateProjectMember(
            @PathVariable Long id,
            @RequestBody ProjectMember projectMember) {
        ProjectMember updated = projectMemberService.updateProjectMember(id, projectMember);
        return ResponseEntity.ok(projectMemberMapper.toDTO(updated));
    }
} 