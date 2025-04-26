package com.projectmanagementtool.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestDto {
    private Long projectId;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private Long assigneeId;
    private Long statusId;
} 