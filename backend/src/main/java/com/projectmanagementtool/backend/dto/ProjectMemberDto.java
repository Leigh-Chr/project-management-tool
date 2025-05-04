package com.projectmanagementtool.backend.dto;

import lombok.Data;

@Data
public class ProjectMemberDto {
    private Long id;
    private String project;
    private String username;
    private String email;
    private String role;
    
    private ProjectMemberDto(ProjectMemberDtoBuilder builder) {
        this.id = builder.id;
        this.project = builder.project;
        this.username = builder.username;
        this.email = builder.email;
        this.role = builder.role;
    }
    
    public ProjectMemberDto() {
        // Default constructor required
    }
    
    public static ProjectMemberDtoBuilder builder() {
        return new ProjectMemberDtoBuilder();
    }
    
    public static class ProjectMemberDtoBuilder {
        private Long id;
        private String project;
        private String username;
        private String email;
        private String role;
        
        public ProjectMemberDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public ProjectMemberDtoBuilder project(String project) {
            this.project = project;
            return this;
        }
        
        public ProjectMemberDtoBuilder username(String username) {
            this.username = username;
            return this;
        }
        
        public ProjectMemberDtoBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public ProjectMemberDtoBuilder role(String role) {
            this.role = role;
            return this;
        }
        
        public ProjectMemberDto build() {
            return new ProjectMemberDto(this);
        }
    }
} 