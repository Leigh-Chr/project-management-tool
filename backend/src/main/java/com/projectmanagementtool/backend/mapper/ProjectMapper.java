package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.ProjectDetailsDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProjectMemberMapper.class, TaskMapper.class})
public interface ProjectMapper {
    @Mapping(target = "status", source = "status.name")
    @Mapping(target = "myRole", ignore = true)
    @Mapping(target = "projectMembers", source = "members")
    @Mapping(target = "tasks", source = "tasks")
    ProjectDto toDto(Project project);

    @Mapping(target = "status", source = "status.name")
    @Mapping(target = "projectMembers", source = "members")
    @Mapping(target = "tasks", source = "tasks")
    @Mapping(target = "myRole", ignore = true)
    ProjectDetailsDto toDetailsDto(Project project);
} 