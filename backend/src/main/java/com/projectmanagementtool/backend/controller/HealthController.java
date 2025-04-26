package com.projectmanagementtool.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> checkHealth() {
        return ResponseEntity.ok("Application is running");
    }
} 