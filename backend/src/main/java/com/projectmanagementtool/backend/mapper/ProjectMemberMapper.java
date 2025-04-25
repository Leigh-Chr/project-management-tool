package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.ProjectMemberDTO;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMemberMapper {
    
    @Mapping(source = "project.name", target = "project")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "role.name", target = "role")
    ProjectMemberDTO toDTO(ProjectMember projectMember);

    @Mapping(target = "project", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "role", ignore = true)
    ProjectMember toEntity(ProjectMemberDTO projectMemberDTO);
} 