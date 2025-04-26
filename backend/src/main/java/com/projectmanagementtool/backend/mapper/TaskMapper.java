package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {TaskEventMapper.class, ProjectMemberMapper.class})
public interface TaskMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "status", ignore = true)
    Task toEntity(TaskRequestDto taskRequest);

    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "status", source = "status.name")
    @Mapping(target = "taskHistory", source = "events")
    @Mapping(target = "assignee.role", source = "assignee.role", qualifiedByName = "roleToString")
    TaskDto toDto(Task task);

    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "status", source = "status.name")
    @Mapping(target = "taskHistory", source = "events")
    @Mapping(target = "assignee.role", source = "assignee.role", qualifiedByName = "roleToString")
    TaskDetailsDto toDetailsDto(Task task);

    @Named("roleToString")
    default String roleToString(Role role) {
        return role != null ? role.getName() : null;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateTaskFromDto(TaskRequestDto taskRequest, @MappingTarget Task task);
} 