package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.mapper.TaskMapper;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.repository.ProjectMemberRepository;
import com.projectmanagementtool.backend.repository.ProjectRepository;
import com.projectmanagementtool.backend.repository.StatusRepository;
import com.projectmanagementtool.backend.repository.TaskRepository;
import com.projectmanagementtool.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final StatusRepository statusRepository;

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    private Optional<ProjectMember> getCurrentUserProjectMember(Long projectId) {
        return projectMemberRepository.findByProjectIdAndUserUsername(projectId, getCurrentUsername());
    }

    private String getUserRole(Long projectId) {
        return getCurrentUserProjectMember(projectId)
                .map(member -> member.getRole().getName())
                .orElse(null);
    }

    private boolean hasPermission(Long projectId, String requiredRole) {
        String userRole = getUserRole(projectId);
        if (userRole == null) {
            return false;
        }
        
        if ("Admin".equals(requiredRole)) {
            return "Admin".equals(userRole);
        } else if ("Member".equals(requiredRole)) {
            return "Admin".equals(userRole) || "Member".equals(userRole);
        }
        
        return true; // Observer can view
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .filter(task -> hasPermission(task.getProject().getId(), "Observer"))
                .map(task -> {
                    TaskDto dto = taskMapper.toDto(task);
                    dto.setMyRole(getUserRole(task.getProject().getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasksForCurrentUser() {
        String username = getCurrentUsername();
        return taskRepository.findAll().stream()
                .filter(task -> {
                    String role = getUserRole(task.getProject().getId());
                    return role != null && (
                        task.getAssignee() != null && task.getAssignee().getUser().getUsername().equals(username) ||
                        "Admin".equals(role) ||
                        "Member".equals(role)
                    );
                })
                .map(task -> {
                    TaskDto dto = taskMapper.toDto(task);
                    dto.setMyRole(getUserRole(task.getProject().getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProjectId(Long projectId) {
        if (!hasPermission(projectId, "Observer")) {
            return List.of();
        }
        
        return taskRepository.findByProjectId(projectId).stream()
                .map(task -> {
                    TaskDto dto = taskMapper.toDto(task);
                    dto.setMyRole(getUserRole(projectId));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByAssigneeId(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .filter(task -> hasPermission(task.getProject().getId(), "Observer"))
                .map(task -> {
                    TaskDto dto = taskMapper.toDto(task);
                    dto.setMyRole(getUserRole(task.getProject().getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProjectIdAndStatusId(Long projectId, Long statusId) {
        if (!hasPermission(projectId, "Observer")) {
            return List.of();
        }
        
        return taskRepository.findByProjectIdAndStatusId(projectId, statusId).stream()
                .map(task -> {
                    TaskDto dto = taskMapper.toDto(task);
                    dto.setMyRole(getUserRole(projectId));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        if (!hasPermission(task.getProject().getId(), "Observer")) {
            throw new RuntimeException("Access denied");
        }
        
        TaskDto dto = taskMapper.toDto(task);
        dto.setMyRole(getUserRole(task.getProject().getId()));
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDetailsDto getTaskDetails(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        if (!hasPermission(task.getProject().getId(), "Observer")) {
            throw new RuntimeException("Access denied");
        }
        
        TaskDetailsDto dto = taskMapper.toDetailsDto(task);
        dto.setMyRole(getUserRole(task.getProject().getId()));
        return dto;
    }

    @Override
    @Transactional
    public TaskDto createTask(TaskRequestDto taskRequestDto) {
        if (!hasPermission(taskRequestDto.getProjectId(), "Member")) {
            throw new RuntimeException("Access denied");
        }
        
        Project project = projectRepository.findById(taskRequestDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
                
        Status status = statusRepository.findById(taskRequestDto.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));
                
        ProjectMember assignee = null;
        if (taskRequestDto.getAssigneeId() != null) {
            assignee = projectMemberRepository.findById(taskRequestDto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
        }
        
        Task task = taskMapper.toEntity(taskRequestDto);
        task.setProject(project);
        task.setStatus(status);
        task.setAssignee(assignee);
        
        Task savedTask = taskRepository.save(task);
        
        TaskDto dto = taskMapper.toDto(savedTask);
        dto.setMyRole(getUserRole(taskRequestDto.getProjectId()));
        return dto;
    }

    @Override
    @Transactional
    public TaskDto updateTask(Long id, TaskRequestDto taskRequestDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        if (!hasPermission(existingTask.getProject().getId(), "Member")) {
            throw new RuntimeException("Access denied");
        }
        
        taskMapper.updateTaskFromDto(taskRequestDto, existingTask);
        Task updatedTask = taskRepository.save(existingTask);
        
        TaskDto dto = taskMapper.toDto(updatedTask);
        dto.setMyRole(getUserRole(existingTask.getProject().getId()));
        return dto;
    }

    @Override
    @Transactional
    public TaskDto updateTaskStatus(Long id, Status status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        if (!hasPermission(task.getProject().getId(), "Member")) {
            throw new RuntimeException("Access denied");
        }
        
        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        
        TaskDto dto = taskMapper.toDto(updatedTask);
        dto.setMyRole(getUserRole(task.getProject().getId()));
        return dto;
    }

    @Override
    @Transactional
    public TaskDto deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
                
        if (!hasPermission(task.getProject().getId(), "Admin")) {
            throw new RuntimeException("Access denied");
        }
        
        TaskDto dto = taskMapper.toDto(task);
        dto.setMyRole(getUserRole(task.getProject().getId()));
        
        taskRepository.delete(task);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return taskRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Task getTaskEntityById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
} 