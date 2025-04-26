package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.dto.TaskEventDto;
import com.projectmanagementtool.backend.mapper.TaskEventMapper;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.repository.TaskEventRepository;
import com.projectmanagementtool.backend.repository.TaskRepository;
import com.projectmanagementtool.backend.service.TaskEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskEventServiceImpl implements TaskEventService {
    private final TaskEventRepository taskEventRepository;
    private final TaskRepository taskRepository;
    private final TaskEventMapper taskEventMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TaskEventDto> getTaskEvents(Long taskId) {
        return taskEventRepository.findByTaskId(taskId).stream()
                .map(taskEventMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskEventDto createTaskEvent(Long taskId, String description) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        TaskEvent event = new TaskEvent();
        event.setTask(task);
        event.setDescription(description);
        event.setDate(LocalDateTime.now());

        TaskEvent savedEvent = taskEventRepository.save(event);
        return taskEventMapper.toDto(savedEvent);
    }

    @Override
    @Transactional
    public void deleteTaskEvents(Long taskId) {
        List<TaskEvent> events = taskEventRepository.findByTaskId(taskId);
        taskEventRepository.deleteAll(events);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskEvent> findByTaskId(Long taskId) {
        return taskEventRepository.findByTaskId(taskId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskEvent> findByTaskIdOrderByDateDesc(Long taskId) {
        return taskEventRepository.findByTaskIdOrderByDateDesc(taskId);
    }

    @Override
    @Transactional
    public TaskEvent save(TaskEvent taskEvent) {
        return taskEventRepository.save(taskEvent);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        taskEventRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return taskEventRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskEvent findById(Long id) {
        return taskEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TaskEvent not found with id: " + id));
    }
} 