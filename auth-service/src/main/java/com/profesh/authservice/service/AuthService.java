package com.profesh.authservice.service;

import com.profesh.authservice.dto.RegisterRequest;
import com.profesh.authservice.entity.UserCredential;
import com.profesh.authservice.repository.UserCredentialRepository;
import com.profesh.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String saveUser(RegisterRequest request) {
        UserCredential user = new UserCredential();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // BCrypt Encryption happens right here before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 🔒 THE FIX: Check for null/empty role and assign a safe default
        String rawRole = request.getRole();
        String formattedRole;

        if (rawRole == null || rawRole.trim().isEmpty()) {
            formattedRole = "ROLE_USER"; // Default fallback for UI registrations
        } else {
            formattedRole = rawRole.toUpperCase();
            // Enforce standard naming convention for roles (ROLE_PREFIX)
            if (!formattedRole.startsWith("ROLE_")) {
                formattedRole = "ROLE_" + formattedRole;
            }
        }

        user.setRole(formattedRole);

        repository.save(user);
        return "User registered successfully with role: " + formattedRole;
    }

    public String generateToken(String username) {
        return jwtUtil.generateToken(username);
    }
}