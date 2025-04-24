package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskDTO;
import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.dto.TaskRequestDTO;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(source = "status.name", target = "status")
    @Mapping(source = "project", target = "project", qualifiedByName = "toProjectDTO")
    @Mapping(source = "assignee", target = "assignee", qualifiedByName = "toAssigneeDTO")
    @Mapping(source = "events", target = "taskHistory")
    TaskDTO toDTO(Task task);

    @Mapping(source = "projectId", target = "project.id")
    @Mapping(source = "statusId", target = "status.id")
    @Mapping(source = "assigneeId", target = "assignee.id")
    Task toEntity(TaskRequestDTO dto);

    @Mapping(source = "description", target = "description")
    @Mapping(source = "date", target = "date")
    TaskEventDTO toDTO(TaskEvent event);

    List<TaskEventDTO> toDTOList(List<TaskEvent> events);

    @Named("toProjectDTO")
    default TaskDTO.ProjectDTO toProjectDTO(Project project) {
        if (project == null) {
            return null;
        }
        TaskDTO.ProjectDTO dto = new TaskDTO.ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus().getName());
        return dto;
    }

    @Named("toAssigneeDTO")
    default TaskDTO.AssigneeDTO toAssigneeDTO(ProjectMember assignee) {
        if (assignee == null) {
            return null;
        }
        TaskDTO.AssigneeDTO dto = new TaskDTO.AssigneeDTO();
        dto.setId(assignee.getId());
        dto.setUsername(assignee.getUser().getUsername());
        dto.setEmail(assignee.getUser().getEmail());
        dto.setRole(assignee.getRole().getName());
        return dto;
    }
} 