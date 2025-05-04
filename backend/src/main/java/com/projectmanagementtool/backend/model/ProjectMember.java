package com.projectmanagementtool.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "project_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"project_id", "user_id"})
})
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public Project getProject() {
        return project;
    }
    
    public User getUser() {
        return user;
    }
    
    public Role getRole() {
        return role;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
} 