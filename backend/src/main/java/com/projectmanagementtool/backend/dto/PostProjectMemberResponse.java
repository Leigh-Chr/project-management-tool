package com.projectmanagementtool.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostProjectMemberResponse {
    private Long id;
    private String project;
    private String username;
    private String email;
    private String role;
} 