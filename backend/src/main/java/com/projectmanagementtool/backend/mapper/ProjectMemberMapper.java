package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.ProjectMemberDto;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.springframework.stereotype.Component;

@Component
public class ProjectMemberMapper {
    public ProjectMemberDto toDto(ProjectMember projectMember) {
        if (projectMember == null) {
            return null;
        }
        ProjectMemberDto dto = new ProjectMemberDto();
        dto.setId(projectMember.getId());
        dto.setProject(projectMember.getProject().getName());
        dto.setUsername(projectMember.getUser().getUsername());
        dto.setEmail(projectMember.getUser().getEmail());
        dto.setRole(projectMember.getRole().getName());
        return dto;
    }
} 