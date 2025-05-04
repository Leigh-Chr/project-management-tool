package com.projectmanagementtool.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskDetailsDto {
    private Long id;
    private String name;
    private String description;
    private String status;
    private Long projectId;
    private ProjectMemberDto assignee;
    private Integer priority;
    private String myRole;
    private LocalDate dueDate;
    private List<TaskEventDto> taskHistory;
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    public void setAssignee(ProjectMemberDto assignee) {
        this.assignee = assignee;
    }
    
    public void setPriority(Integer priority) {
        this.priority = priority;
    }
    
    public void setMyRole(String myRole) {
        this.myRole = myRole;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public void setTaskHistory(List<TaskEventDto> taskHistory) {
        this.taskHistory = taskHistory;
    }
} 