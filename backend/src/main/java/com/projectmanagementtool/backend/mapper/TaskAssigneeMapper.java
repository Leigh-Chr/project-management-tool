package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskAssigneeDto;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskAssigneeMapper {
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "role", source = "role.name")
    TaskAssigneeDto toDto(ProjectMember projectMember);
} 