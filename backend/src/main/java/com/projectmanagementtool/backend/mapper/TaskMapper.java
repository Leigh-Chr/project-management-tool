package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.dto.TaskEventDto;
import com.projectmanagementtool.backend.dto.ProjectMemberDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    public Task toEntity(TaskRequestDto dto) {
        if (dto == null) return null;
        
        Task task = new Task();
        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setPriority(dto.getPriority());
        
        return task;
    }

    public TaskDto toDto(Task task, String myRole) {
        if (task == null) return null;

        TaskDto.TaskDtoBuilder builder = TaskDto.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .status(task.getStatus() != null ? task.getStatus().getName() : null)
                .project(ProjectDto.builder()
                        .id(task.getProject().getId())
                        .name(task.getProject().getName())
                        .description(task.getProject().getDescription())
                        .status(task.getProject().getStatus() != null ? task.getProject().getStatus().getName() : null)
                        .myRole(myRole)
                        .build())
                .myRole(myRole)
                .taskHistory(task.getEvents() != null ? toEventDtos(task.getEvents()) : null);

        // Set assignee if exists
        if (task.getAssignee() != null) {
            ProjectMember assignee = task.getAssignee();
            builder.assignee(ProjectMemberDto.builder()
                    .id(assignee.getId())
                    .username(assignee.getUser().getUsername())
                    .email(assignee.getUser().getEmail())
                    .role(assignee.getRole().getName())
                    .build());
        }

        return builder.build();
    }

    private List<TaskEventDto> toEventDtos(List<TaskEvent> events) {
        if (events == null) return null;

        return events.stream()
                .map(this::toEventDto)
                .collect(Collectors.toList());
    }

    private TaskEventDto toEventDto(TaskEvent event) {
        if (event == null) return null;

        return TaskEventDto.builder()
                .id(event.getId())
                .taskId(event.getTask().getId())
                .description(event.getDescription())
                .date(event.getDate())
                .build();
    }

    @Mapping(target = "status", source = "task.status.name")
    @Mapping(target = "projectId", source = "task.project.id")
    public TaskDetailsDto toDetailsDto(Task task, String myRole) {
        if (task == null) return null;
        
        TaskDetailsDto dto = new TaskDetailsDto();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus() != null ? task.getStatus().getName() : null);
        dto.setProjectId(task.getProject() != null ? task.getProject().getId() : null);
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setMyRole(myRole);
        
        return dto;
    }

    public void updateTaskFromDto(TaskRequestDto dto, Task task) {
        if (dto == null || task == null) return;

        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setPriority(dto.getPriority());
    }
} 