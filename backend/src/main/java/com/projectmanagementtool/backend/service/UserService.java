package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> findAll();
    User findById(Long id);
    User findByUsername(String username);
    User findByEmail(String email);
    User save(User user);
    User updateUser(Long id, User user);
    void deleteById(Long id);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
} 