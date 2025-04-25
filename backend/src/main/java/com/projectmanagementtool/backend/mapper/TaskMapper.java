package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskDTO;
import com.projectmanagementtool.backend.dto.TaskDetailsDTO;
import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.dto.TaskRequestDTO;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "assignee.id", target = "assigneeId")
    @Mapping(source = "assignee.user.username", target = "assigneeName")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "myRole", ignore = true)
    @Mapping(target = "taskHistory", ignore = true)
    TaskDTO toDTO(Task task);

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "project.name", target = "projectName")
    @Mapping(source = "assignee.id", target = "assigneeId")
    @Mapping(source = "assignee.user.username", target = "assigneeName")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "events", target = "taskHistory")
    @Mapping(target = "myRole", ignore = true)
    TaskDetailsDTO toDetailsDTO(Task task);

    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "task.name", target = "taskName")
    TaskEventDTO toEventDTO(TaskEvent event);

    List<TaskEventDTO> toEventDTOList(List<TaskEvent> events);

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
        dto.setStatus(project.getStatus() != null ? project.getStatus().getName() : null);
        return dto;
    }

    default TaskDTO.AssigneeDTO toAssigneeDTO(ProjectMember assignee) {
        if (assignee == null) {
            return null;
        }
        TaskDTO.AssigneeDTO dto = new TaskDTO.AssigneeDTO();
        dto.setId(assignee.getId());
        dto.setUsername(assignee.getUser().getUsername());
        dto.setEmail(assignee.getUser().getEmail());
        dto.setRole(assignee.getRole() != null ? assignee.getRole().getName() : null);
        return dto;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    Task toEntity(TaskRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateTaskFromDTO(TaskDTO taskDTO, @MappingTarget Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateTaskFromDetailsDTO(TaskDetailsDTO taskDetailsDTO, @MappingTarget Task task);
} 