package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.ProjectMemberDTO;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.springframework.stereotype.Component;

@Component
public class ProjectMemberMapper {

    public ProjectMemberDTO toDTO(ProjectMember projectMember) {
        if (projectMember == null) {
            return null;
        }

        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(projectMember.getId());
        dto.setProjectId(projectMember.getProject().getId());
        dto.setUserId(projectMember.getUser().getId());
        dto.setUsername(projectMember.getUser().getUsername());
        dto.setEmail(projectMember.getUser().getEmail());
        dto.setRole(projectMember.getRole().name());

        return dto;
    }

    public ProjectMember toEntity(ProjectMemberDTO dto) {
        if (dto == null) {
            return null;
        }

        ProjectMember entity = new ProjectMember();
        entity.setId(dto.getId());
        // Note: Project and User entities should be set by the service layer
        // as they require database lookups

        return entity;
    }
} 