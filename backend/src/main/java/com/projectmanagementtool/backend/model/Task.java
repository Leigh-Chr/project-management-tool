package com.projectmanagementtool.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @NotBlank(message = "Task name is required")
    @Size(min = 3, max = 100, message = "Task name must be between 3 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private LocalDate dueDate;

    private Integer priority;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @ToString.Exclude
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskEvent> events = new ArrayList<>();
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public Project getProject() {
        return project;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public Integer getPriority() {
        return priority;
    }
    
    public User getAssignee() {
        return assignee;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public List<TaskEvent> getEvents() {
        return events;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public void setPriority(Integer priority) {
        this.priority = priority;
    }
    
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public void setEvents(List<TaskEvent> events) {
        this.events = events;
    }
} 