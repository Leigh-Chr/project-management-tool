package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.model.TaskStatus;
import com.projectmanagementtool.backend.repository.TaskRepository;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import com.projectmanagementtool.backend.service.TaskEventService;
import com.projectmanagementtool.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final ProjectMemberService projectMemberService;
    private final TaskEventService taskEventService;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository, 
                         ProjectMemberService projectMemberService,
                         TaskEventService taskEventService) {
        this.taskRepository = taskRepository;
        this.projectMemberService = projectMemberService;
        this.taskEventService = taskEventService;
    }

    @Override
    public List<Task> findAll() {
        List<Task> tasks = taskRepository.findAll();
        tasks.forEach(task -> task.setTaskHistory(taskEventService.getTaskEvents(task.getId())));
        return tasks;
    }

    @Override
    public Optional<Task> findById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        task.ifPresent(t -> t.setTaskHistory(taskEventService.getTaskEvents(t.getId())));
        return task;
    }

    @Override
    public List<Task> findByProjectId(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        tasks.forEach(task -> task.setTaskHistory(taskEventService.getTaskEvents(task.getId())));
        return tasks;
    }

    @Override
    public List<Task> findByAssigneeId(Long assigneeId) {
        List<Task> tasks = taskRepository.findByAssigneeId(assigneeId);
        tasks.forEach(task -> task.setTaskHistory(taskEventService.getTaskEvents(task.getId())));
        return tasks;
    }

    @Override
    public Task createTask(Task task) {
        // Vérifier que l'utilisateur est admin du projet
        ProjectMember creator = projectMemberService.findByProjectIdAndUserId(task.getProjectId(), task.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("User is not a member of the project"));
        if (!Role.ADMIN.equals(creator.getRole())) {
            throw new IllegalStateException("Only project admins can create tasks");
        }

        // Vérifier que l'assigné est un membre du projet
        ProjectMember assignee = projectMemberService.findByProjectIdAndUserId(task.getProjectId(), task.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("Assignee is not a member of the project"));

        // Créer la tâche
        Task savedTask = taskRepository.save(task);

        // Créer l'événement de création
        TaskEvent creationEvent = new TaskEvent();
        creationEvent.setTaskId(savedTask.getId());
        creationEvent.setDescription("Task " + savedTask.getName() + " was created");
        taskEventService.createTaskEvent(creationEvent);

        // Créer l'événement d'assignation
        TaskEvent assignmentEvent = new TaskEvent();
        assignmentEvent.setTaskId(savedTask.getId());
        assignmentEvent.setDescription("Assigned to " + assignee.getUser().getUsername());
        taskEventService.createTaskEvent(assignmentEvent);

        // Ajouter l'historique à la tâche
        savedTask.setTaskHistory(taskEventService.getTaskEvents(savedTask.getId()));
        return savedTask;
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    // Vérifier que l'utilisateur est admin du projet
                    ProjectMember updater = projectMemberService.findByProjectIdAndUserId(existingTask.getProjectId(), taskDetails.getAssigneeId())
                            .orElseThrow(() -> new EntityNotFoundException("User is not a member of the project"));
                    if (!Role.ADMIN.equals(updater.getRole())) {
                        throw new IllegalStateException("Only project admins can update tasks");
                    }

                    // Vérifier que l'assigné est un membre du projet
                    if (taskDetails.getAssigneeId() != null) {
                        ProjectMember assignee = projectMemberService.findByProjectIdAndUserId(
                                existingTask.getProjectId(), taskDetails.getAssigneeId())
                                .orElseThrow(() -> new EntityNotFoundException("Assignee is not a member of the project"));
                        
                        // Créer l'événement d'assignation si l'assigné a changé
                        if (!existingTask.getAssigneeId().equals(taskDetails.getAssigneeId())) {
                            TaskEvent assignmentEvent = new TaskEvent();
                            assignmentEvent.setTaskId(existingTask.getId());
                            assignmentEvent.setDescription("Assigned to " + assignee.getUser().getUsername());
                            taskEventService.createTaskEvent(assignmentEvent);
                        }
                    }

                    // Créer l'événement de changement de priorité si la priorité a changé
                    if (existingTask.getPriority() != taskDetails.getPriority()) {
                        TaskEvent priorityEvent = new TaskEvent();
                        priorityEvent.setTaskId(existingTask.getId());
                        priorityEvent.setDescription("Priority changed from " + existingTask.getPriority() + " to " + taskDetails.getPriority());
                        taskEventService.createTaskEvent(priorityEvent);
                    }

                    // Créer l'événement de changement de date d'échéance si la date a changé
                    if (!existingTask.getDueDate().equals(taskDetails.getDueDate())) {
                        TaskEvent dueDateEvent = new TaskEvent();
                        dueDateEvent.setTaskId(existingTask.getId());
                        dueDateEvent.setDescription("Due date changed from " + existingTask.getDueDate() + " to " + taskDetails.getDueDate());
                        taskEventService.createTaskEvent(dueDateEvent);
                    }

                    // Mettre à jour les champs de la tâche
                    existingTask.setName(taskDetails.getName());
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setDueDate(taskDetails.getDueDate());
                    existingTask.setPriority(taskDetails.getPriority());
                    existingTask.setAssigneeId(taskDetails.getAssigneeId());
                    existingTask.setStatus(taskDetails.getStatus());

                    // Créer l'événement de changement de statut si le statut a changé
                    if (existingTask.getStatus() != taskDetails.getStatus()) {
                        TaskEvent statusEvent = new TaskEvent();
                        statusEvent.setTaskId(existingTask.getId());
                        statusEvent.setDescription("Status changed to " + taskDetails.getStatus());
                        taskEventService.createTaskEvent(statusEvent);
                    }

                    Task updatedTask = taskRepository.save(existingTask);
                    updatedTask.setTaskHistory(taskEventService.getTaskEvents(updatedTask.getId()));
                    return updatedTask;
                })
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));

        // Vérifier que l'utilisateur est admin ou member du projet
        ProjectMember deleter = projectMemberService.findByProjectIdAndUserId(task.getProjectId(), task.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("User is not a member of the project"));
        if (!Role.ADMIN.equals(deleter.getRole()) && !Role.MEMBER.equals(deleter.getRole())) {
            throw new IllegalStateException("Only project admins and members can delete tasks");
        }

        // Supprimer les événements associés à la tâche
        taskEventService.deleteTaskEvents(task.getId());

        // Supprimer la tâche
        taskRepository.deleteById(id);
    }

    @Override
    public Task updateTaskStatus(Long id, TaskStatus status) {
        return taskRepository.findById(id)
                .map(task -> {
                    // Vérifier que l'utilisateur est admin du projet
                    ProjectMember updater = projectMemberService.findByProjectIdAndUserId(task.getProjectId(), task.getAssigneeId())
                            .orElseThrow(() -> new EntityNotFoundException("User is not a member of the project"));
                    if (!Role.ADMIN.equals(updater.getRole())) {
                        throw new IllegalStateException("Only project admins can update task status");
                    }

                    task.setStatus(status);
                    
                    // Créer l'événement de changement de statut
                    TaskEvent statusEvent = new TaskEvent();
                    statusEvent.setTaskId(task.getId());
                    statusEvent.setDescription("Status changed to " + status);
                    taskEventService.createTaskEvent(statusEvent);

                    Task updatedTask = taskRepository.save(task);
                    updatedTask.setTaskHistory(taskEventService.getTaskEvents(updatedTask.getId()));
                    return updatedTask;
                })
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }
} 