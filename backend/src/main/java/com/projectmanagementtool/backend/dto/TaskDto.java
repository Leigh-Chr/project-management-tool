package com.projectmanagementtool.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private String status;
    private ProjectDto project;
    private ProjectMemberDto assignee;
    private String myRole;
    private List<TaskEventDto> taskHistory;
    
    private TaskDto(TaskDtoBuilder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.dueDate = builder.dueDate;
        this.priority = builder.priority;
        this.status = builder.status;
        this.project = builder.project;
        this.assignee = builder.assignee;
        this.myRole = builder.myRole;
        this.taskHistory = builder.taskHistory;
    }
    
    public TaskDto() {
        // Default constructor required
    }
    
    public static TaskDtoBuilder builder() {
        return new TaskDtoBuilder();
    }
    
    public static class TaskDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private LocalDate dueDate;
        private Integer priority;
        private String status;
        private ProjectDto project;
        private ProjectMemberDto assignee;
        private String myRole;
        private List<TaskEventDto> taskHistory;
        
        public TaskDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public TaskDtoBuilder name(String name) {
            this.name = name;
            return this;
        }
        
        public TaskDtoBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public TaskDtoBuilder dueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
            return this;
        }
        
        public TaskDtoBuilder priority(Integer priority) {
            this.priority = priority;
            return this;
        }
        
        public TaskDtoBuilder status(String status) {
            this.status = status;
            return this;
        }
        
        public TaskDtoBuilder project(ProjectDto project) {
            this.project = project;
            return this;
        }
        
        public TaskDtoBuilder assignee(ProjectMemberDto assignee) {
            this.assignee = assignee;
            return this;
        }
        
        public TaskDtoBuilder myRole(String myRole) {
            this.myRole = myRole;
            return this;
        }
        
        public TaskDtoBuilder taskHistory(List<TaskEventDto> taskHistory) {
            this.taskHistory = taskHistory;
            return this;
        }
        
        public TaskDto build() {
            return new TaskDto(this);
        }
    }
} 