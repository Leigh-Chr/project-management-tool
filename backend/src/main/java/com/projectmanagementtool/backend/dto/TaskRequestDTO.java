package com.projectmanagementtool.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {
    private Long projectId;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private Long assigneeId;
    private Long statusId;
} 