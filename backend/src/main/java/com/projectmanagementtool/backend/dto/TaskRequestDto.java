package com.projectmanagementtool.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestDto {
    private Long projectId;
    private String name;
    private String description;
    private LocalDate dueDate;
    private Integer priority;
    private Long assigneeId;
    private Long statusId;
    
    // Getters
    public Long getProjectId() {
        return projectId;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public Integer getPriority() {
        return priority;
    }
    
    public Long getAssigneeId() {
        return assigneeId;
    }
    
    public Long getStatusId() {
        return statusId;
    }
    
    // Setters
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public void setPriority(Integer priority) {
        this.priority = priority;
    }
    
    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }
    
    public void setStatusId(Long statusId) {
        this.statusId = statusId;
    }
} 