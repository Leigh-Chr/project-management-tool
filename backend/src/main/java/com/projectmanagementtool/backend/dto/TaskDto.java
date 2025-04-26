package com.projectmanagementtool.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private String status;
    private Long projectId;
    private ProjectMemberDto assignee;
    private Integer priority;
    private List<TaskEventDto> taskHistory;
    private String myRole;
} 