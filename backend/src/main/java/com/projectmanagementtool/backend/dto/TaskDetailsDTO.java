package com.projectmanagementtool.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDetailsDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private String status;
    private ProjectDTO project;
    private AssigneeDTO assignee;
    private Integer priority;
    private List<TaskEventDTO> taskHistory;
    private String myRole;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectDTO {
        private Long id;
        private String name;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssigneeDTO {
        private Long id;
        private String username;
        private String email;
        private String role;
    }
} 