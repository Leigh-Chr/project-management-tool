package com.projectmanagementtool.backend.dto;

import lombok.Data;

@Data
public class ProjectMemberRequestDto {
    private Long projectId;
    private Long userId;
    private Long roleId;
} 