package com.projectmanagementtool.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectMemberDTO {
    private Long id;
    private String project;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 