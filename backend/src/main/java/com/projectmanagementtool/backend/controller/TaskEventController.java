package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.mapper.TaskEventMapper;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.service.TaskEventService;
import com.projectmanagementtool.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<TaskEventDTO>> getTaskEventsByTaskId(@PathVariable Long taskId) {
        // Vérifier que la tâche existe
        if (!taskService.existsById(taskId)) {
            return ResponseEntity.notFound().build();
        }

        List<TaskEventDTO> dtos = taskEventService.findByTaskId(taskId).stream()
                .map(taskEventMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskEventDTO> getTaskEventById(@PathVariable Long id) {
        try {
            TaskEvent taskEvent = taskEventService.findById(id);
            return ResponseEntity.ok(taskEventMapper.toDTO(taskEvent));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<TaskEventDTO> createTaskEvent(@RequestBody TaskEventDTO taskEventDTO) {
        // Vérifier que la tâche existe
        if (!taskService.existsById(taskEventDTO.getTaskId())) {
            return ResponseEntity.badRequest().build();
        }

        try {
            TaskEvent taskEvent = taskEventMapper.toEntity(taskEventDTO);
            taskEvent.setTask(taskService.findById(taskEventDTO.getTaskId()));
            TaskEvent savedEvent = taskEventService.save(taskEvent);
            return ResponseEntity.ok(taskEventMapper.toDTO(savedEvent));
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