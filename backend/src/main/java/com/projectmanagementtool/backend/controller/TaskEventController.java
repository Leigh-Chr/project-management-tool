package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.mapper.TaskEventMapper;
import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.service.TaskEventService;
import com.projectmanagementtool.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/task-events")
public class TaskEventController {

    private final TaskEventService taskEventService;
    private final TaskService taskService;
    private final TaskEventMapper taskEventMapper;

    @Autowired
    public TaskEventController(TaskEventService taskEventService, TaskService taskService, TaskEventMapper taskEventMapper) {
        this.taskEventService = taskEventService;
        this.taskService = taskService;
        this.taskEventMapper = taskEventMapper;
    }

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
        return taskEventService.findById(id)
                .map(taskEventMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskEventDTO> createTaskEvent(@RequestBody TaskEventDTO taskEventDTO) {
        // Vérifier que la tâche existe
        if (!taskService.existsById(taskEventDTO.getTaskId())) {
            return ResponseEntity.badRequest().build();
        }

        TaskEvent taskEvent = taskEventMapper.toEntity(taskEventDTO);
        taskEvent.setTask(taskService.findById(taskEventDTO.getTaskId()).orElseThrow());
        TaskEvent savedEvent = taskEventService.save(taskEvent);
        return ResponseEntity.ok(taskEventMapper.toDTO(savedEvent));
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