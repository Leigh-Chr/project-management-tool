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
public class TaskDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private Long projectId;
    private Long assigneeId;
    private String assigneeName;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ProjectDTO project;
    private AssigneeDTO assignee;
    private List<TaskEventDTO> taskHistory;
    private String myRole;

    @Data
    public static class ProjectDTO {
        private Long id;
        private String name;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
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