package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.dto.ProjectMemberRequestDto;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.User;
import com.projectmanagementtool.backend.repository.ProjectMemberRepository;
import com.projectmanagementtool.backend.repository.ProjectRepository;
import com.projectmanagementtool.backend.repository.UserRepository;
import com.projectmanagementtool.backend.repository.RoleRepository;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> findAll() {
        List<ProjectMember> members = projectMemberRepository.findAll();
        members.forEach(member -> {
            member.getProject().getName(); // Initialize project
            member.getUser().getUsername(); // Initialize user
            member.getRole().getName(); // Initialize role
        });
        return members;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProjectMember> findById(Long id) {
        return projectMemberRepository.findById(id)
                .map(member -> {
                    member.getProject().getName(); // Initialize project
                    member.getUser().getUsername(); // Initialize user
                    member.getRole().getName(); // Initialize role
                    return member;
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> findByProjectId(Long projectId) {
        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);
        members.forEach(member -> {
            member.getProject().getName(); // Initialize project
            member.getUser().getUsername(); // Initialize user
            member.getRole().getName(); // Initialize role
        });
        return members;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> findByUserId(Long userId) {
        List<ProjectMember> members = projectMemberRepository.findByUserId(userId);
        members.forEach(member -> {
            member.getProject().getName(); // Initialize project
            member.getUser().getUsername(); // Initialize user
            member.getRole().getName(); // Initialize role
        });
        return members;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(member -> {
                    member.getProject().getName(); // Initialize project
                    member.getUser().getUsername(); // Initialize user
                    member.getRole().getName(); // Initialize role
                    return member;
                });
    }

    @Override
    public ProjectMember save(ProjectMember projectMember) {
        return projectMemberRepository.save(projectMember);
    }

    @Override
    public void deleteById(Long id) {
        projectMemberRepository.deleteById(id);
    }

    @Override
    public ProjectMember updateProjectMember(Long id, ProjectMemberRequestDto request) {
        return projectMemberRepository.findById(id)
                .map(existingMember -> {
                    // Verify that the project member belongs to the specified project
                    if (!existingMember.getProject().getId().equals(request.getProjectId())) {
                        throw new IllegalArgumentException("Cannot change project for existing project member");
                    }
                    
                    // Verify that the user matches
                    if (!existingMember.getUser().getId().equals(request.getUserId())) {
                        throw new IllegalArgumentException("Cannot change user for existing project member");
                    }
                    
                    // Update the role
                    Role role = roleRepository.findById(request.getRoleId())
                            .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + request.getRoleId()));
                    existingMember.setRole(role);
                    
                    ProjectMember updated = projectMemberRepository.save(existingMember);
                    updated.getProject().getName(); // Initialize project
                    updated.getUser().getUsername(); // Initialize user
                    updated.getRole().getName(); // Initialize role
                    return updated;
                })
                .orElseThrow(() -> new EntityNotFoundException("Project member not found with id: " + id));
    }

    @Override
    public ProjectMember createProjectMember(ProjectMemberRequestDto request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + request.getProjectId()));
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + request.getUserId()));
        
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id: " + request.getRoleId()));

        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(project);
        projectMember.setUser(user);
        projectMember.setRole(role);

        return projectMemberRepository.save(projectMember);
    }
} 