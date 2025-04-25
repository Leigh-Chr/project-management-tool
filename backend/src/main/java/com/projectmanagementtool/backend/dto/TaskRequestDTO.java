package com.projectmanagementtool.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private Long projectId;
    private Long assigneeId;
    private Long statusId;
} 