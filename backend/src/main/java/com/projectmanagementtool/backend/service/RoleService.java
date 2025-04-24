package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.Role;
import java.util.List;
import java.util.Optional;

public interface RoleService {
    List<Role> findAll();
    Optional<Role> findById(Long id);
} 