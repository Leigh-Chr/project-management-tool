package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.model.Task;

import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTasks();
    List<TaskDto> getAllTasksForCurrentUser();
    List<TaskDto> getTasksByProjectId(Long projectId);
    List<TaskDto> getTasksByAssigneeId(Long assigneeId);
    List<TaskDto> getTasksByProjectIdAndStatusId(Long projectId, Long statusId);
    TaskDto getTaskById(Long id);
    TaskDetailsDto getTaskDetails(Long id);
    TaskDto createTask(TaskRequestDto taskRequestDto);
    TaskDto updateTask(Long id, TaskRequestDto taskRequestDto);
    TaskDto updateTaskStatus(Long id, Status status);
    TaskDto deleteTask(Long id);
    boolean existsById(Long id);
    Task getTaskEntityById(Long id);
} 