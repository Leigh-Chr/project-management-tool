package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.DeleteProjectMemberResponse;
import com.projectmanagementtool.backend.dto.GetProjectMemberResponse;
import com.projectmanagementtool.backend.dto.PostProjectMemberResponse;
import com.projectmanagementtool.backend.dto.ProjectMemberDTO;
import com.projectmanagementtool.backend.mapper.ProjectMemberMapper;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project-members")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;
    private final ProjectMemberMapper projectMemberMapper;

    @Autowired
    public ProjectMemberController(ProjectMemberService projectMemberService, ProjectMemberMapper projectMemberMapper) {
        this.projectMemberService = projectMemberService;
        this.projectMemberMapper = projectMemberMapper;
    }

    @GetMapping
    public ResponseEntity<List<ProjectMemberDTO>> getAllProjectMembers() {
        List<ProjectMemberDTO> dtos = projectMemberService.findAll().stream()
                .map(projectMemberMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetProjectMemberResponse> getProjectMemberById(@PathVariable Long id) {
        return projectMemberService.findById(id)
                .map(projectMember -> {
                    GetProjectMemberResponse response = new GetProjectMemberResponse();
                    response.setId(projectMember.getId());
                    response.setProject(projectMember.getProject().getName());
                    response.setUsername(projectMember.getUser().getUsername());
                    response.setEmail(projectMember.getUser().getEmail());
                    response.setRole(projectMember.getRole().name());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembersByProjectId(@PathVariable Long projectId) {
        List<ProjectMemberDTO> dtos = projectMemberService.findByProjectId(projectId).stream()
                .map(projectMemberMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembersByUserId(@PathVariable Long userId) {
        List<ProjectMemberDTO> dtos = projectMemberService.findByUserId(userId).stream()
                .map(projectMemberMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<PostProjectMemberResponse> createProjectMember(@RequestBody ProjectMemberDTO projectMemberDTO) {
        // Vérifier que l'utilisateur est admin du projet
        ProjectMember creator = projectMemberService.findByProjectIdAndUserId(
                projectMemberDTO.getProjectId(), projectMemberDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User is not a member of the project"));
        if (!Role.ADMIN.equals(creator.getRole())) {
            throw new RuntimeException("Only project admins can add members");
        }

        ProjectMember projectMember = projectMemberMapper.toEntity(projectMemberDTO);
        ProjectMember savedMember = projectMemberService.save(projectMember);

        PostProjectMemberResponse response = new PostProjectMemberResponse();
        response.setId(savedMember.getId());
        response.setProject(savedMember.getProject().getName());
        response.setUsername(savedMember.getUser().getUsername());
        response.setEmail(savedMember.getUser().getEmail());
        response.setRole(savedMember.getRole().name());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectMemberDTO> updateProjectMember(
            @PathVariable Long id,
            @RequestBody ProjectMemberDTO projectMemberDTO) {
        return projectMemberService.findById(id)
                .map(existingMember -> {
                    // Vérifier que l'utilisateur est admin du projet
                    ProjectMember updater = projectMemberService.findByProjectIdAndUserId(
                            existingMember.getProject().getId(), projectMemberDTO.getUserId())
                            .orElseThrow(() -> new RuntimeException("User is not a member of the project"));
                    if (!Role.ADMIN.equals(updater.getRole())) {
                        throw new RuntimeException("Only project admins can update members");
                    }

                    projectMemberDTO.setId(id);
                    ProjectMember projectMember = projectMemberMapper.toEntity(projectMemberDTO);
                    ProjectMember updatedMember = projectMemberService.save(projectMember);
                    return ResponseEntity.ok(projectMemberMapper.toDTO(updatedMember));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteProjectMemberResponse> deleteProjectMember(@PathVariable Long id) {
        return projectMemberService.findById(id)
                .map(member -> {
                    // Vérifier que l'utilisateur est admin du projet
                    ProjectMember deleter = projectMemberService.findByProjectIdAndUserId(
                            member.getProject().getId(), member.getUser().getId())
                            .orElseThrow(() -> new RuntimeException("User is not a member of the project"));
                    if (!Role.ADMIN.equals(deleter.getRole())) {
                        throw new RuntimeException("Only project admins can delete members");
                    }

                    DeleteProjectMemberResponse response = new DeleteProjectMemberResponse();
                    response.setId(member.getId());
                    response.setProject(member.getProject().getName());
                    response.setUsername(member.getUser().getUsername());
                    response.setEmail(member.getUser().getEmail());
                    response.setRole(member.getRole().name());

                    projectMemberService.deleteById(id);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}/user/{userId}")
    public ResponseEntity<ProjectMemberDTO> getProjectMemberByProjectIdAndUserId(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        return projectMemberService.findByProjectIdAndUserId(projectId, userId)
                .map(projectMemberMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 