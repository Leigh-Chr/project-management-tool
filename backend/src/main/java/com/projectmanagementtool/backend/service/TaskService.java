package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.ProjectMember;

import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTasks();
    
    TaskDto getTask(Long id);
    
    TaskDetailsDto getTaskDetails(Long id);
    
    List<TaskDto> getTasksByProjectId(Long projectId);
    
    List<TaskDto> getTasksByAssigneeId(Long assigneeId);
    
    List<TaskDto> getTasksByProjectIdAndStatusId(Long projectId, Long statusId);
    
    TaskDto createTask(TaskRequestDto request);
    
    TaskDto updateTask(Long id, TaskRequestDto request);
    
    boolean deleteTask(Long id);
    
    List<ProjectMember> getProjectMembers(Long projectId);
    
    // Méthodes manquantes utilisées dans TaskEventController
    boolean existsById(Long id);
    
    Task getTaskEntityById(Long id);
} 