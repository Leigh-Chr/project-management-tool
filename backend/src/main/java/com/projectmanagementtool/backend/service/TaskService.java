package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.dto.TaskEventDto;
import com.projectmanagementtool.backend.dto.ProjectMemberDto;
import com.projectmanagementtool.backend.exception.ResourceNotFoundException;
import com.projectmanagementtool.backend.exception.UnauthorizedException;
import com.projectmanagementtool.backend.mapper.TaskMapper;
import com.projectmanagementtool.backend.mapper.ProjectMemberMapper;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.User;
import com.projectmanagementtool.backend.repository.ProjectRepository;
import com.projectmanagementtool.backend.repository.TaskEventRepository;
import com.projectmanagementtool.backend.repository.TaskRepository;
import com.projectmanagementtool.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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