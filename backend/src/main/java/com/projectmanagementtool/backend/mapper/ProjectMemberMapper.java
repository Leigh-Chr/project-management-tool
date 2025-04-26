package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.ProjectMemberDto;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ProjectMemberMapper {
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "projectName", source = "project.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "role", source = "role.name")
    ProjectMemberDto toDto(ProjectMember projectMember);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "project", ignore = true)
    ProjectMember toEntity(ProjectMemberDto projectMemberDto);
} 