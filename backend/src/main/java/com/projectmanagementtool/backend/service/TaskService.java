package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskDTO;
import com.projectmanagementtool.backend.dto.TaskDetailsDTO;
import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.dto.TaskRequestDTO;
import com.projectmanagementtool.backend.mapper.TaskMapper;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.repository.ProjectMemberRepository;
import com.projectmanagementtool.backend.repository.ProjectRepository;
import com.projectmanagementtool.backend.repository.RoleRepository;
import com.projectmanagementtool.backend.repository.StatusRepository;
import com.projectmanagementtool.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final StatusRepository statusRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final RoleRepository roleRepository;
    private final TaskMapper taskMapper;
    private final TaskEventService taskEventService;

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return taskRepository.findAll().stream()
                .map(task -> {
                    TaskDTO dto = taskMapper.toDTO(task);
                    dto.setMyRole(getUserRoleInProject(task.getProject().getId(), username));
                    dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        TaskDTO dto = taskMapper.toDTO(task);
        dto.setMyRole(getUserRoleInProject(task.getProject().getId(), username));
        dto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
        return dto;
    }

    @Transactional(readOnly = true)
    public TaskDetailsDTO getTaskDetails(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        List<TaskEventDTO> taskHistory = taskEventService.getTaskEvents(id);
        String myRole = getUserRoleInProject(task.getProject().getId(), username);
        
        TaskDetailsDTO dto = new TaskDetailsDTO();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus().getName());
        dto.setPriority(task.getPriority());
        dto.setTaskHistory(taskHistory);
        dto.setMyRole(myRole);
        
        // Project details
        TaskDetailsDTO.ProjectDTO projectDTO = new TaskDetailsDTO.ProjectDTO();
        projectDTO.setId(task.getProject().getId());
        projectDTO.setName(task.getProject().getName());
        projectDTO.setDescription(task.getProject().getDescription());
        projectDTO.setStartDate(task.getProject().getStartDate());
        projectDTO.setEndDate(task.getProject().getEndDate());
        projectDTO.setStatus(task.getProject().getStatus().getName());
        dto.setProject(projectDTO);
        
        // Assignee details
        if (task.getAssignee() != null) {
            TaskDetailsDTO.AssigneeDTO assigneeDTO = new TaskDetailsDTO.AssigneeDTO();
            assigneeDTO.setId(task.getAssignee().getId());
            assigneeDTO.setUsername(task.getAssignee().getUser().getUsername());
            assigneeDTO.setEmail(task.getAssignee().getUser().getEmail());
            assigneeDTO.setRole(task.getAssignee().getRole().getName());
            dto.setAssignee(assigneeDTO);
        }
        
        return dto;
    }

    @Transactional
    public TaskDTO createTask(TaskRequestDTO taskRequestDTO) {
        // Vérifier que l'utilisateur est admin
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = getUserRoleInProject(taskRequestDTO.getProjectId(), username);
        if (!"Admin".equals(role)) {
            throw new RuntimeException("Only admins can create tasks");
        }

        // Vérifier que le projet existe
        Project project = projectRepository.findById(taskRequestDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + taskRequestDTO.getProjectId()));

        // Vérifier que le statut existe
        Status status = statusRepository.findById(taskRequestDTO.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found with id: " + taskRequestDTO.getStatusId()));

        // Vérifier que l'assigné existe et appartient au projet
        ProjectMember assignee = null;
        if (taskRequestDTO.getAssigneeId() != null) {
            assignee = projectMemberRepository.findById(taskRequestDTO.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("ProjectMember not found with id: " + taskRequestDTO.getAssigneeId()));
            
            if (!assignee.getProject().getId().equals(project.getId())) {
                throw new RuntimeException("Assignee does not belong to the project");
            }
        }

        // Créer la tâche
        Task task = taskMapper.toEntity(taskRequestDTO);
        task.setProject(project);
        task.setStatus(status);
        task.setAssignee(assignee);

        // Sauvegarder la tâche
        Task savedTask = taskRepository.save(task);
        
        // Créer un événement pour la création de la tâche
        taskEventService.createTaskEvent(savedTask.getId(), "Task " + savedTask.getName() + " was created");
        
        // Si un assigné est spécifié, créer un événement d'assignation
        if (assignee != null) {
            taskEventService.createTaskEvent(savedTask.getId(), "Assigned to " + assignee.getUser().getUsername());
        }
        
        TaskDTO dto = taskMapper.toDTO(savedTask);
        dto.setMyRole(role);
        dto.setTaskHistory(taskEventService.getTaskEvents(savedTask.getId()));
        return dto;
    }

    @Transactional
    public TaskDTO updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        // Vérifier que l'utilisateur est admin
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = getUserRoleInProject(taskRequestDTO.getProjectId(), username);
        if (!"Admin".equals(role)) {
            throw new RuntimeException("Only admins can update tasks");
        }

        // Vérifier que la tâche existe
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        // Vérifier que le projet existe
        Project project = projectRepository.findById(taskRequestDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + taskRequestDTO.getProjectId()));

        // Vérifier que le statut existe
        Status status = statusRepository.findById(taskRequestDTO.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found with id: " + taskRequestDTO.getStatusId()));

        // Vérifier que l'assigné existe et appartient au projet
        ProjectMember assignee = null;
        if (taskRequestDTO.getAssigneeId() != null) {
            assignee = projectMemberRepository.findById(taskRequestDTO.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("ProjectMember not found with id: " + taskRequestDTO.getAssigneeId()));
            
            if (!assignee.getProject().getId().equals(project.getId())) {
                throw new RuntimeException("Assignee does not belong to the project");
            }
        }

        // Créer des événements pour les changements
        if (!task.getStatus().getId().equals(status.getId())) {
            taskEventService.createTaskEvent(id, "Status changed to " + status.getName());
        }
        
        if (task.getAssignee() == null && assignee != null) {
            taskEventService.createTaskEvent(id, "Assigned to " + assignee.getUser().getUsername());
        } else if (task.getAssignee() != null && assignee == null) {
            taskEventService.createTaskEvent(id, "Unassigned");
        } else if (task.getAssignee() != null && assignee != null && 
                  !task.getAssignee().getId().equals(assignee.getId())) {
            taskEventService.createTaskEvent(id, "Reassigned to " + assignee.getUser().getUsername());
        }

        // Mettre à jour la tâche
        task.setName(taskRequestDTO.getName());
        task.setDescription(taskRequestDTO.getDescription());
        task.setDueDate(taskRequestDTO.getDueDate());
        task.setPriority(taskRequestDTO.getPriority());
        task.setProject(project);
        task.setStatus(status);
        task.setAssignee(assignee);

        // Sauvegarder la tâche
        Task updatedTask = taskRepository.save(task);
        TaskDTO dto = taskMapper.toDTO(updatedTask);
        dto.setMyRole(role);
        dto.setTaskHistory(taskEventService.getTaskEvents(updatedTask.getId()));
        return dto;
    }

    @Transactional
    public void deleteTask(Long id) {
        // Vérifier que l'utilisateur est admin ou member
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = getUserRoleInProject(task.getProject().getId(), username);
        if (!"Admin".equals(role) && !"Member".equals(role)) {
            throw new RuntimeException("Only admins and members can delete tasks");
        }
        
        // Supprimer les événements de la tâche
        taskEventService.deleteTaskEvents(id);
        
        // Supprimer la tâche
        taskRepository.deleteById(id);
    }
    
    private String getUserRoleInProject(Long projectId, String username) {
        ProjectMember projectMember = projectMemberRepository.findByProjectIdAndUserUsername(projectId, username);
        if (projectMember == null) {
            return null;
        }
        return projectMember.getRole().getName();
    }
} 