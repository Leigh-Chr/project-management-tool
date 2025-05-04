package com.projectmanagementtool.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "task_events")
public class TaskEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    private String description;

    @Column(nullable = false)
    private LocalDateTime date;
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public Task getTask() {
        return task;
    }
    
    public String getDescription() {
        return description;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setTask(Task task) {
        this.task = task;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
} 