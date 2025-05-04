package com.projectmanagementtool.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectDetailsDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String myRole;
    private List<ProjectMemberDto> projectMembers;
    private List<TaskDto> tasks;
    
    private ProjectDetailsDto(ProjectDetailsDtoBuilder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.startDate = builder.startDate;
        this.endDate = builder.endDate;
        this.status = builder.status;
        this.myRole = builder.myRole;
        this.projectMembers = builder.projectMembers;
        this.tasks = builder.tasks;
    }
    
    public ProjectDetailsDto() {
        // Default constructor required
    }
    
    public static ProjectDetailsDtoBuilder builder() {
        return new ProjectDetailsDtoBuilder();
    }
    
    public void setTasks(List<TaskDto> tasks) {
        this.tasks = tasks;
    }
    
    public static class ProjectDetailsDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String myRole;
        private List<ProjectMemberDto> projectMembers;
        private List<TaskDto> tasks;
        
        public ProjectDetailsDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public ProjectDetailsDtoBuilder name(String name) {
            this.name = name;
            return this;
        }
        
        public ProjectDetailsDtoBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public ProjectDetailsDtoBuilder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }
        
        public ProjectDetailsDtoBuilder endDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }
        
        public ProjectDetailsDtoBuilder status(String status) {
            this.status = status;
            return this;
        }
        
        public ProjectDetailsDtoBuilder myRole(String myRole) {
            this.myRole = myRole;
            return this;
        }
        
        public ProjectDetailsDtoBuilder projectMembers(List<ProjectMemberDto> projectMembers) {
            this.projectMembers = projectMembers;
            return this;
        }
        
        public ProjectDetailsDtoBuilder tasks(List<TaskDto> tasks) {
            this.tasks = tasks;
            return this;
        }
        
        public ProjectDetailsDto build() {
            return new ProjectDetailsDto(this);
        }
    }
} 