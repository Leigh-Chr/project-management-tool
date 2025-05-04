package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.ProjectDetailsDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.dto.ProjectMemberDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {
    private final TaskMapper taskMapper;

    public ProjectMapper(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    public ProjectDto toDto(Project project, String myRole) {
        if (project == null) return null;
        
        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus() != null ? project.getStatus().getName() : null)
                .myRole(myRole)
                .build();
    }

    public ProjectDetailsDto toDetailsDto(Project project, String myRole) {
        if (project == null) return null;

        List<ProjectMemberDto> memberDtos = project.getMembers().stream()
                .map(this::toMemberDto)
                .collect(Collectors.toList());

        List<TaskDto> taskDtos = project.getTasks().stream()
                .map(task -> taskMapper.toDto(task, myRole))
                .collect(Collectors.toList());

        return ProjectDetailsDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus() != null ? project.getStatus().getName() : null)
                .myRole(myRole)
                .projectMembers(memberDtos)
                .tasks(taskDtos)
                .build();
    }

    private ProjectMemberDto toMemberDto(ProjectMember member) {
        if (member == null) return null;

        return ProjectMemberDto.builder()
                .id(member.getId())
                .project(member.getProject().getName())
                .username(member.getUser().getUsername())
                .email(member.getUser().getEmail())
                .role(member.getRole().getName())
                .build();
    }
} 