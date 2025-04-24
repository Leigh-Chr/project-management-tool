package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.mapper.TaskMapper;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.repository.TaskEventRepository;
import com.projectmanagementtool.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskEventService {
    private final TaskEventRepository taskEventRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public List<TaskEventDTO> getTaskEvents(Long taskId) {
        return taskEventRepository.findByTaskId(taskId).stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskEventDTO createTaskEvent(Long taskId, String description) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        TaskEvent event = new TaskEvent();
        event.setTask(task);
        event.setDescription(description);
        event.setDate(LocalDateTime.now());

        TaskEvent savedEvent = taskEventRepository.save(event);
        return taskMapper.toDTO(savedEvent);
    }

    @Transactional
    public void deleteTaskEvents(Long taskId) {
        List<TaskEvent> events = taskEventRepository.findByTaskId(taskId);
        taskEventRepository.deleteAll(events);
    }
} 