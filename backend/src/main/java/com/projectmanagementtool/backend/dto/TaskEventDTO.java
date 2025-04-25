package com.projectmanagementtool.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskEventDTO {
    private Long id;
    private String description;
    private LocalDateTime date;
    private LocalDateTime createdAt;
    private Long taskId;
    private String taskName;
} 