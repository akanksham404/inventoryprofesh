package com.profesh.authservice.repository;

import com.profesh.authservice.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserCredentialRepository extends JpaRepository<UserCredential, Integer> {

    // Spring reads the word "Username" and automatically generates:
    // SELECT * FROM user_credentials WHERE username = ?
    Optional<UserCredential> findByUsername(String username);

    // Spring reads the word "Email" and automatically generates:
    // SELECT * FROM user_credentials WHERE email = ?
    Optional<UserCredential> findByEmail(String email);
}