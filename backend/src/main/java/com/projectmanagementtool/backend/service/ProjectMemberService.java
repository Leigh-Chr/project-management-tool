package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.ProjectMemberRequestDto;
import com.projectmanagementtool.backend.model.ProjectMember;
import java.util.List;
import java.util.Optional;

public interface ProjectMemberService {
    List<ProjectMember> findAll();
    Optional<ProjectMember> findById(Long id);
    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByUserId(Long userId);
    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);
    ProjectMember save(ProjectMember projectMember);
    void deleteById(Long id);
    ProjectMember updateProjectMember(Long id, ProjectMemberRequestDto request);
    ProjectMember createProjectMember(ProjectMemberRequestDto request);
} 