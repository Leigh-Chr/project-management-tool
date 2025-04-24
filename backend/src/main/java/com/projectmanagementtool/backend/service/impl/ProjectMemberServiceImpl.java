package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.model.Role;
import com.projectmanagementtool.backend.repository.ProjectMemberRepository;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectMemberServiceImpl implements ProjectMemberService {
    private final ProjectMemberRepository projectMemberRepository;

    @Autowired
    public ProjectMemberServiceImpl(ProjectMemberRepository projectMemberRepository) {
        this.projectMemberRepository = projectMemberRepository;
    }

    @Override
    public List<ProjectMember> findAll() {
        return projectMemberRepository.findAll();
    }

    @Override
    public Optional<ProjectMember> findById(Long id) {
        return projectMemberRepository.findById(id);
    }

    @Override
    public List<ProjectMember> findByProjectId(Long projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    @Override
    public List<ProjectMember> findByUserId(Long userId) {
        return projectMemberRepository.findByUserId(userId);
    }

    @Override
    public Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public ProjectMember save(ProjectMember projectMember) {
        return projectMemberRepository.save(projectMember);
    }

    @Override
    public void deleteById(Long id) {
        if (!projectMemberRepository.existsById(id)) {
            throw new EntityNotFoundException("ProjectMember not found with id: " + id);
        }
        projectMemberRepository.deleteById(id);
    }

    @Override
    public ProjectMember updateRole(Long id, Role role) {
        return projectMemberRepository.findById(id)
                .map(existingMember -> {
                    existingMember.setRole(role);
                    return projectMemberRepository.save(existingMember);
                })
                .orElseThrow(() -> new EntityNotFoundException("ProjectMember not found with id: " + id));
    }

    @Override
    public boolean existsByProjectIdAndUserId(Long projectId, Long userId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }
} 