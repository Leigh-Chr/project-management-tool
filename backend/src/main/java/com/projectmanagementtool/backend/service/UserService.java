package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    User save(User user);
    void deleteById(Long id);
    User updateUser(Long id, User user);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
} 