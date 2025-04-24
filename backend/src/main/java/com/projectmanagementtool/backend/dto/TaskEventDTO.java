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
    private Long taskId;
    private String description;
    private LocalDateTime date;
} 