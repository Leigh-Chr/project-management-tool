package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.ProjectDetailsDto;
import com.projectmanagementtool.backend.dto.ProjectDto;
import com.projectmanagementtool.backend.dto.ProjectRequestDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.mapper.ProjectMapper;
import com.projectmanagementtool.backend.mapper.TaskMapper;
import com.projectmanagementtool.backend.model.Project;
import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.User;
import com.projectmanagementtool.backend.repository.ProjectRepository;
import com.projectmanagementtool.backend.repository.RoleRepository;
import com.projectmanagementtool.backend.repository.StatusRepository;
import com.projectmanagementtool.backend.repository.TaskRepository;
import com.projectmanagementtool.backend.security.SecurityUtils;
import com.projectmanagementtool.backend.exception.ResourceNotFoundException;
import com.projectmanagementtool.backend.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final RoleRepository roleRepository;
    private final SecurityUtils securityUtils;
    private final StatusRepository statusRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final TaskEventService taskEventService;

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(project -> {
                    String myRole = getMyRole(project);
                    if (myRole == null) {
                        return null;
                    }

                    Status status = project.getStatus();
                    if (status == null) {
                        return null;
                    }

                    return projectMapper.toDto(project, myRole);
                })
                .filter(project -> project != null)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        String myRole = getMyRole(project);
        if (myRole == null) {
            return null;
        }

        Status status = project.getStatus();
        if (status == null) {
            return null;
        }

        return projectMapper.toDto(project, myRole);
    }

    @Transactional(readOnly = true)
    public ProjectDetailsDto getProjectDetails(Long id) {
        // D'abord charger le projet avec ses membres
        Project projectWithMembers = projectRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        // Ensuite charger le projet avec ses tâches
        Project projectWithTasks = projectRepository.findByIdWithTasks(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        // Utiliser les membres du premier chargement
        Project project = projectWithMembers;
        // Ajouter les tâches du second chargement
        project.setTasks(projectWithTasks.getTasks());

        String myRole = getMyRole(project);
        if (myRole == null) {
            return null;
        }

        Status status = project.getStatus();
        if (status == null) {
            return null;
        }

        ProjectDetailsDto dto = projectMapper.toDetailsDto(project, myRole);

        // Set tasks with details
        List<TaskDto> tasks = project.getTasks().stream()
                .map(task -> {
                    TaskDto taskDto = taskMapper.toDto(task, myRole);
                    if (taskDto != null) {
                        // Set task history
                        taskDto.setTaskHistory(taskEventService.getTaskEvents(task.getId()));
                    }
                    return taskDto;
                })
                .filter(task -> task != null)
                .collect(Collectors.toList());
        dto.setTasks(tasks);

        return dto;
    }

    @Transactional
    public ProjectDto createProject(ProjectRequestDto request) {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("User must be authenticated to create a project");
        }

        Status status = statusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Status not found with id: " + request.getStatusId()));

        Role adminRole = roleRepository.findByName("Admin")
                .orElseThrow(() -> new ResourceNotFoundException("Admin role not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(status);

        Project savedProject = projectRepository.save(project);

        // Add current user as admin
        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(savedProject);
        projectMember.setUser(currentUser);
        projectMember.setRole(adminRole);
        savedProject.getMembers().add(projectMember);

        return projectMapper.toDto(projectRepository.save(savedProject), "Admin");
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectRequestDto request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        String myRole = getMyRole(project);
        if (!"Admin".equals(myRole)) {
            throw new UnauthorizedException("Only admin can update project");
        }

        Status status = statusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Status not found with id: " + request.getStatusId()));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(status);

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDto(updatedProject, myRole);
    }

    @Transactional
    public ProjectDto deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        String myRole = getMyRole(project);
        if (!"Admin".equals(myRole)) {
            throw new UnauthorizedException("Only admin can delete project");
        }

        // Delete all tasks and their history
        List<Task> tasks = taskRepository.findByProjectId(id);
        for (Task task : tasks) {
            taskEventService.deleteTaskEvents(task.getId());
        }
        taskRepository.deleteAll(tasks);

        // Delete project and its members
        ProjectDto projectDto = projectMapper.toDto(project, myRole);
        projectRepository.delete(project);

        return projectDto;
    }
    
    @Transactional
    public ProjectDto updateProjectStatus(Long id, String statusName) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        String myRole = getMyRole(project);
        if (!"Admin".equals(myRole) && !"Member".equals(myRole)) {
            throw new UnauthorizedException("Only admin or member can update project status");
        }
        
        Status status = statusRepository.findByName(statusName)
                .orElseThrow(() -> new ResourceNotFoundException("Status not found with name: " + statusName));
        
        project.setStatus(status);
        Project updatedProject = projectRepository.save(project);
        
        return projectMapper.toDto(updatedProject, myRole);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsByStatusId(Long statusId) {
        return projectRepository.findByStatusId(statusId).stream()
                .map(project -> {
                    String myRole = getMyRole(project);
                    if (myRole == null) {
                        return null;
                    }

                    Status status = project.getStatus();
                    if (status == null) {
                        return null;
                    }

                    return projectMapper.toDto(project, myRole);
                })
                .filter(project -> project != null)
                .collect(Collectors.toList());
    }

    private String getMyRole(Project project) {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            return null;
        }
        return project.getMembers().stream()
                .filter(member -> member.getUser().getId().equals(currentUser.getId()))
                .findFirst()
                .map(member -> member.getRole().getName())
                .orElse(null);
    }
} 