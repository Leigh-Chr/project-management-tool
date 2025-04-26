package com.projectmanagementtool.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskEventDto {
    private Long id;
    private Long taskId;
    private String description;
    private LocalDateTime date;
} 