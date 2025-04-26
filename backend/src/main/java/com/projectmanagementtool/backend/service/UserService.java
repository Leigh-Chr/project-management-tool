package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getAllUsers();
    User getUserByUsername(String username);
    User createUser(User user);
    User updateUser(String username, User user);
    void deleteUser(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    User findByUsername(String username);
    User save(User user);
} 