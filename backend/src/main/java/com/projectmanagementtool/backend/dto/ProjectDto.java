package com.projectmanagementtool.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String myRole;
    
    private ProjectDto(ProjectDtoBuilder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.status = builder.status;
        this.startDate = builder.startDate;
        this.endDate = builder.endDate;
        this.myRole = builder.myRole;
    }
    
    public ProjectDto() {
        // Default constructor required
    }
    
    public static ProjectDtoBuilder builder() {
        return new ProjectDtoBuilder();
    }
    
    public static class ProjectDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private String status;
        private LocalDate startDate;
        private LocalDate endDate;
        private String myRole;
        
        public ProjectDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public ProjectDtoBuilder name(String name) {
            this.name = name;
            return this;
        }
        
        public ProjectDtoBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public ProjectDtoBuilder status(String status) {
            this.status = status;
            return this;
        }
        
        public ProjectDtoBuilder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }
        
        public ProjectDtoBuilder endDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }
        
        public ProjectDtoBuilder myRole(String myRole) {
            this.myRole = myRole;
            return this;
        }
        
        public ProjectDto build() {
            return new ProjectDto(this);
        }
    }
} 