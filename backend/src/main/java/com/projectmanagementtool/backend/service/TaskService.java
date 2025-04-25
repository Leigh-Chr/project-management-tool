package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskDTO;
import com.projectmanagementtool.backend.dto.TaskDetailsDTO;
import com.projectmanagementtool.backend.dto.TaskRequestDTO;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.model.Task;

import java.util.List;

public interface TaskService {
    List<TaskDTO> getAllTasks();
    
    TaskDetailsDTO getTaskById(Long id);
    
    TaskDetailsDTO getTaskDetails(Long id);
    
    List<TaskDTO> getTasksByProjectId(Long projectId);
    
    List<TaskDTO> getTasksByAssigneeId(Long assigneeId);
    
    List<TaskDTO> getTasksByProjectIdAndStatusId(Long projectId, Long statusId);
    
    TaskDTO createTask(TaskRequestDTO taskRequestDTO);
    
    TaskDTO updateTask(Long id, TaskRequestDTO taskRequestDTO);
    
    TaskDTO updateTaskStatus(Long id, Status status);
    
    void deleteTask(Long id);

    boolean existsById(Long id);

    Task findById(Long id);
} 