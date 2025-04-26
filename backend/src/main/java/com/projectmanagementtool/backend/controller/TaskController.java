package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.TaskDetailsDto;
import com.projectmanagementtool.backend.dto.TaskDto;
import com.projectmanagementtool.backend.dto.TaskRequestDto;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasksForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<TaskDetailsDto> getTaskDetails(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskDetails(id));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskRequestDto taskRequestDto) {
        return ResponseEntity.ok(taskService.createTask(taskRequestDto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody TaskRequestDto taskRequestDto) {
        return ResponseEntity.ok(taskService.updateTask(id, taskRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TaskDto> deleteTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.deleteTask(id));
    }
} 