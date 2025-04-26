package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.TaskEventDto;
import com.projectmanagementtool.backend.mapper.TaskEventMapper;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.service.TaskEventService;
import com.projectmanagementtool.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/task-events")
@RequiredArgsConstructor
public class TaskEventController {

    private final TaskEventService taskEventService;
    private final TaskService taskService;
    private final TaskEventMapper taskEventMapper;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskEventDto>> getTaskEventsByTaskId(@PathVariable Long taskId) {
        // Vérifier que la tâche existe
        if (!taskService.existsById(taskId)) {
            return ResponseEntity.notFound().build();
        }

        List<TaskEventDto> dtos = taskEventService.findByTaskId(taskId).stream()
                .map(taskEventMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskEventDto> getTaskEventById(@PathVariable Long id) {
        try {
            TaskEvent taskEvent = taskEventService.findById(id);
            return ResponseEntity.ok(taskEventMapper.toDto(taskEvent));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<TaskEventDto> createTaskEvent(
            @PathVariable Long taskId,
            @RequestBody TaskEventDto taskEventDto) {
        // Vérifier que la tâche existe
        if (!taskService.existsById(taskId)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            TaskEvent taskEvent = new TaskEvent();
            taskEvent.setDescription(taskEventDto.getDescription());
            taskEvent.setTask(taskService.getTaskEntityById(taskId));
            taskEvent.setDate(taskEventDto.getDate() != null ? taskEventDto.getDate() : LocalDateTime.now());
            TaskEvent savedEvent = taskEventService.save(taskEvent);
            return ResponseEntity.ok(taskEventMapper.toDto(savedEvent));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskEvent(@PathVariable Long id) {
        if (!taskEventService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskEventService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 