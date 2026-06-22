package com.profesh.authservice.config;

import com.profesh.authservice.entity.UserCredential;
import com.profesh.authservice.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserCredentialRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("👉 [AUTH GATEWAY] Intercepting lookup request for identifier: " + username);

        // Dynamic double-lookup strategy checking BOTH the 'name' and 'email' columns
        Optional<UserCredential> credential = repository.findByUsername(username);

        if (credential.isEmpty()) {
            System.out.println("ℹ️ User not found by name. Attempting secondary backup lookup by Email column...");
            credential = repository.findByEmail(username);
        }

        return credential.map(CustomUserDetails::new)
                .orElseThrow(() -> {
                    System.out.println("❌ [AUTH ERROR] Security clearance denied. '" + username + "' does not exist in the database.");
                    return new UsernameNotFoundException("User identity not found in database records: " + username);
                });
    }
}