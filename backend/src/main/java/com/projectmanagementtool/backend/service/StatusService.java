package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.Status;
import java.util.List;
import java.util.Optional;

public interface StatusService {
    List<Status> findAll();
    Optional<Status> findById(Long id);
} 