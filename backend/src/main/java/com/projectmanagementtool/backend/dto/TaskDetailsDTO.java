package com.projectmanagementtool.backend.dto;

import com.projectmanagementtool.backend.model.Status;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDetailsDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private Long projectId;
    private String projectName;
    private Long assigneeId;
    private String assigneeName;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TaskEventDTO> taskHistory;
    private String myRole;
} 