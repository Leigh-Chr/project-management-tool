package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.dto.TaskDTO;
import com.projectmanagementtool.backend.dto.TaskDetailsDTO;
import com.projectmanagementtool.backend.dto.TaskRequestDTO;
import com.projectmanagementtool.backend.mapper.TaskMapper;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.Status;
import com.projectmanagementtool.backend.repository.TaskRepository;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import com.projectmanagementtool.backend.service.TaskEventService;
import com.projectmanagementtool.backend.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final ProjectMemberService projectMemberService;
    private final TaskEventService taskEventService;
    private final TaskMapper taskMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDetailsDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        return taskMapper.toDetailsDTO(task);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDetailsDTO getTaskDetails(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        return taskMapper.toDetailsDTO(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByAssigneeId(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProjectIdAndStatusId(Long projectId, Long statusId) {
        return taskRepository.findByProjectIdAndStatusId(projectId, statusId).stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    @Override
    public TaskDTO createTask(TaskRequestDTO taskRequestDTO) {
        Task task = taskMapper.toEntity(taskRequestDTO);
        Task savedTask = taskRepository.save(task);
        taskEventService.createTaskEvent(savedTask.getId(), "Task " + savedTask.getName() + " was created");
        
        if (task.getAssignee() != null) {
            taskEventService.createTaskEvent(savedTask.getId(), 
                "Assigned to " + task.getAssignee().getUser().getUsername());
        }
        
        return taskMapper.toDTO(savedTask);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskRequestDTO taskRequestDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        
        String oldName = existingTask.getName();
        String oldDescription = existingTask.getDescription();
        Integer oldPriority = existingTask.getPriority();
        Status oldStatus = existingTask.getStatus();
        
        Task updatedTask = taskMapper.toEntity(taskRequestDTO);
        existingTask.setName(updatedTask.getName());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setAssignee(updatedTask.getAssignee());
        existingTask.setStatus(updatedTask.getStatus());
        
        Task savedTask = taskRepository.save(existingTask);
        
        if (!oldName.equals(savedTask.getName())) {
            taskEventService.createTaskEvent(id, "Name changed from '" + oldName + 
                "' to '" + savedTask.getName() + "'");
        }
        
        if ((oldDescription == null && savedTask.getDescription() != null) ||
            (oldDescription != null && !oldDescription.equals(savedTask.getDescription()))) {
            taskEventService.createTaskEvent(id, "Description updated");
        }
        
        if (!oldPriority.equals(savedTask.getPriority())) {
            taskEventService.createTaskEvent(id, "Priority changed from " + oldPriority + 
                " to " + savedTask.getPriority());
        }
        
        if (!oldStatus.getId().equals(savedTask.getStatus().getId())) {
            taskEventService.createTaskEvent(id, "Status changed to " + savedTask.getStatus().getName());
        }
        
        return taskMapper.toDTO(savedTask);
    }

    @Override
    public TaskDTO updateTaskStatus(Long id, Status status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        
        if (!task.getStatus().getId().equals(status.getId())) {
            taskEventService.createTaskEvent(id, "Status changed to " + status.getName());
        }
        
        task.setStatus(status);
        Task savedTask = taskRepository.save(task);
        return taskMapper.toDTO(savedTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task not found with id: " + id);
        }
        taskEventService.deleteTaskEvents(id);
        taskRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return taskRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Task findById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }
} 