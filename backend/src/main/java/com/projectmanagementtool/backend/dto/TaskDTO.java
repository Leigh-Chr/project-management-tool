package com.projectmanagementtool.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime dueDate;
    private String status;
    private ProjectDTO project;
    private AssigneeDTO assignee;
    private Integer priority;
    private List<TaskEventDTO> taskHistory;
    private String myRole;

    @Data
    public static class ProjectDTO {
        private Long id;
        private String name;
        private String description;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String status;
        private String myRole;
    }

    @Data
    public static class AssigneeDTO {
        private Long id;
        private String username;
        private String email;
        private String role;
    }
} 