package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.StatusDto;
import com.projectmanagementtool.backend.mapper.StatusMapper;
import com.projectmanagementtool.backend.service.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statuses")
@RequiredArgsConstructor
public class StatusController {
    private final StatusService statusService;
    private final StatusMapper statusMapper;

    @GetMapping
    public ResponseEntity<List<StatusDto>> getAllStatuses() {
        List<StatusDto> dtos = statusService.findAll().stream()
                .map(statusMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatusDto> getStatus(@PathVariable Long id) {
        return statusService.findById(id)
                .map(statusMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 