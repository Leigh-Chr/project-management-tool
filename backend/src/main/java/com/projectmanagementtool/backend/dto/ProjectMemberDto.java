package com.projectmanagementtool.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectMemberDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long userId;
    private String username;
    private String email;
    private String role;
} 