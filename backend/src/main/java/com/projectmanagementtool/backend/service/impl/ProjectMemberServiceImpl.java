package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.model.ProjectMember;
import com.projectmanagementtool.backend.repository.ProjectMemberRepository;
import com.projectmanagementtool.backend.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> findAll() {
        return projectMemberRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProjectMember> findById(Long id) {
        return projectMemberRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> findByProjectId(Long projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMember> findByUserId(Long userId) {
        return projectMemberRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public ProjectMember save(ProjectMember projectMember) {
        return projectMemberRepository.save(projectMember);
    }

    @Override
    public void deleteById(Long id) {
        projectMemberRepository.deleteById(id);
    }

    @Override
    public ProjectMember updateProjectMember(Long id, ProjectMember projectMember) {
        return projectMemberRepository.findById(id)
                .map(existingMember -> {
                    existingMember.setRole(projectMember.getRole());
                    return projectMemberRepository.save(existingMember);
                })
                .orElseThrow(() -> new RuntimeException("Project member not found with id: " + id));
    }
} 