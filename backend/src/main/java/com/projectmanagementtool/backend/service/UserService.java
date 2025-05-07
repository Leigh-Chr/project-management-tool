package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    
    User getUserByUsername(String username);
    
    User createUser(User user);
    
    User updateUser(String username, User user);
    
    void deleteUser(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    User findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    User save(User user);
    
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
    
    default List<User> findAll() {
        return getAllUsers();
    }
    
    default Optional<User> findById(Long id) {
        throw new UnsupportedOperationException("Method not implemented");
    }
} 