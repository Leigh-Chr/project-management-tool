package com.projectmanagementtool.backend.controller;

import com.projectmanagementtool.backend.dto.AuthRequest;
import com.projectmanagementtool.backend.dto.AuthResponse;
import com.projectmanagementtool.backend.model.User;
import com.projectmanagementtool.backend.security.JwtService;
import com.projectmanagementtool.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest request) {
        log.info("Received login request for email: {}", request.getEmail());
        
        try {
            // Find user by email first
            User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));
            
            // Authenticate using the username and password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtService.generateToken(userDetails);

            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setExp(jwtService.getExpirationTime(jwt));

            log.info("User with email {} logged in successfully", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during login: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error during login: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthRequest request) {
        log.info("Received registration request for username: {}", request.getUsername());
        
        if (userService.existsByUsername(request.getUsername())) {
            log.warn("Username {} is already taken", request.getUsername());
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        if (userService.existsByEmail(request.getEmail())) {
            log.warn("Email {} is already in use", request.getEmail());
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            userService.save(user);
            log.info("User {} registered successfully", request.getUsername());
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        log.info("User logged out successfully");
        return ResponseEntity.ok("Logged out successfully!");
    }
} 