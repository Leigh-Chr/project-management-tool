package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.TaskDTO;
import com.projectmanagementtool.backend.dto.TaskDetailsDTO;
import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.dto.TaskRequestDTO;
import com.projectmanagementtool.backend.service.TaskEventService;
import com.projectmanagementtool.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final TaskEventService taskEventService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<TaskDetailsDTO> getTaskDetails(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskDetails(id));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<TaskEventDTO>> getTaskEvents(@PathVariable Long id) {
        return ResponseEntity.ok(taskEventService.getTaskEvents(id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskRequestDTO taskRequestDTO) {
        return new ResponseEntity<>(taskService.createTask(taskRequestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO taskRequestDTO) {
        return ResponseEntity.ok(taskService.updateTask(id, taskRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
} 