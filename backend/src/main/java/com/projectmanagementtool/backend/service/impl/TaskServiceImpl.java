package com.projectmanagementtool.backend.service.impl;

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
import com.projectmanagementtool.backend.service.TaskService;
import com.projectmanagementtool.backend.service.TaskEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final SecurityUtils securityUtils;
    private final ProjectRepository projectRepository;
    private final TaskEventRepository taskEventRepository;
    private final ProjectMemberMapper projectMemberMapper;
    private final TaskEventService taskEventService;

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(task -> {
                    String myRole = getMyRole(task.getProject());
                    if (myRole == null) {
                        return null;
                    }
                    
                    // Check if status exists
                    if (task.getStatus() == null) {
                        return null;
                    }
                    
                    // Check if project exists
                    if (task.getProject() == null) {
                        return null;
                    }
                    
                    TaskDto dto = taskMapper.toDto(task, myRole);
                    if (dto != null) {
                        // Set task history
                        dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
                    }
                    
                    return dto;
                })
                .filter(task -> task != null)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(task -> {
                    String myRole = getMyRole(task.getProject());
                    TaskDto dto = taskMapper.toDto(task, myRole);
                    if (dto != null) {
                        dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByAssigneeId(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(task -> {
                    String myRole = getMyRole(task.getProject());
                    TaskDto dto = taskMapper.toDto(task, myRole);
                    if (dto != null) {
                        dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProjectIdAndStatusId(Long projectId, Long statusId) {
        return taskRepository.findByProjectIdAndStatusId(projectId, statusId).stream()
                .map(task -> {
                    String myRole = getMyRole(task.getProject());
                    TaskDto dto = taskMapper.toDto(task, myRole);
                    if (dto != null) {
                        dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String myRole = getMyRole(task.getProject());
        if (myRole == null) {
            return null;
        }

        TaskDto dto = taskMapper.toDto(task, myRole);
        if (dto != null) {
            dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDetailsDto getTaskDetails(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        Project project = task.getProject();
        String myRole = getMyRole(project);
        if (myRole == null) {
            return null;
        }

        // Check if status exists
        if (task.getStatus() == null) {
            return null;
        }

        // Check if project exists
        if (project == null) {
            return null;
        }

        TaskDetailsDto dto = taskMapper.toDetailsDto(task, myRole);
        if (dto != null) {
            // Set assignee details
            ProjectMember assignee = task.getAssignee();
            if (assignee != null) {
                ProjectMemberDto assigneeDto = projectMemberMapper.toDto(assignee);
                assigneeDto.setUsername(assignee.getUser().getUsername());
                assigneeDto.setEmail(assignee.getUser().getEmail());
                assigneeDto.setRole(assignee.getRole().getName());
                dto.setAssignee(assigneeDto);
            }
            
            // Set task history
            List<TaskEventDto> taskHistory = taskEventService.getTaskEvents(task.getId());
            dto.setTaskHistory(taskHistory);
            
            // Set dueDate and priority
            dto.setDueDate(task.getDueDate());
            dto.setPriority(task.getPriority());
        }

        return dto;
    }

    @Override
    @Transactional
    public TaskDto createTask(TaskRequestDto request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        String myRole = getMyRole(project);
        if (!"Admin".equals(myRole)) {
            throw new UnauthorizedException("Only admin can create tasks");
        }

        Task task = taskMapper.toEntity(request);
        task.setProject(project);
        
        // Set status
        if (request.getStatusId() != null) {
            task.setStatus(project.getStatus());
        }
        
        // Set assignee if provided
        if (request.getAssigneeId() != null) {
            project.getMembers().stream()
                .filter(member -> member.getId().equals(request.getAssigneeId()))
                .findFirst()
                .ifPresent(task::setAssignee);
        }
        
        // Create task event for creation
        TaskEvent event = new TaskEvent();
        event.setTask(task);
        event.setDescription("Task created");
        event.setDate(LocalDateTime.now());
        
        // Save task and event
        Task savedTask = taskRepository.save(task);
        taskEventRepository.save(event);
        
        return getTask(savedTask.getId());
    }

    @Override
    @Transactional
    public TaskDto updateTask(Long id, TaskRequestDto request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String myRole = getMyRole(task.getProject());
        if (!"Admin".equals(myRole)) {
            throw new UnauthorizedException("Only admin can update tasks");
        }
        
        // Keep track of changes for event logging
        String oldName = task.getName();
        String oldDescription = task.getDescription();
        Integer oldPriority = task.getPriority();
        
        // Update task fields
        if (request.getName() != null && !request.getName().equals(oldName)) {
            task.setName(request.getName());
            createTaskEvent(task, "Task name changed from '" + oldName + "' to '" + request.getName() + "'");
        }
        
        if (request.getDescription() != null && !request.getDescription().equals(oldDescription)) {
            task.setDescription(request.getDescription());
            createTaskEvent(task, "Task description updated");
        }
        
        if (request.getPriority() != null && !request.getPriority().equals(oldPriority)) {
            task.setPriority(request.getPriority());
            createTaskEvent(task, "Task priority changed from " + oldPriority + " to " + request.getPriority());
        }
        
        // ... autres mises à jour
        
        Task updatedTask = taskRepository.save(task);
        return getTask(updatedTask.getId());
    }

    @Override
    @Transactional
    public boolean deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        String myRole = getMyRole(task.getProject());
        if (!"Admin".equals(myRole)) {
            throw new UnauthorizedException("Only admin can delete tasks");
        }
        
        taskRepository.delete(task);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return project.getMembers();
    }
    
    private void createTaskEvent(Task task, String description) {
        TaskEvent event = new TaskEvent();
        event.setTask(task);
        event.setDescription(description);
        event.setDate(LocalDateTime.now());
        taskEventRepository.save(event);
    }
    
    private String getMyRole(Project project) {
        User currentUser = securityUtils.getCurrentUser();
        if (project == null || currentUser == null) return null;
        
        return project.getMembers().stream()
                .filter(member -> member.getUser().getId().equals(currentUser.getId()))
                .map(member -> member.getRole().getName())
                .findFirst()
                .orElse(null);
    }
    
    @Override
    public boolean existsById(Long id) {
        return taskRepository.existsById(id);
    }
    
    @Override
    public Task getTaskEntityById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }
} 