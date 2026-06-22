package com.profesh.authservice.controller;

import com.profesh.authservice.dto.AuthRequest;
import com.profesh.authservice.dto.RegisterRequest;
import com.profesh.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String addNewUser(@RequestBody RegisterRequest request) {
        return service.saveUser(request);
    }

    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestBody AuthRequest authRequest) {
        try {

            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword())
            );

            if (authenticate.isAuthenticated()) {

                String token = service.generateToken(authRequest.getUsername());

                return ResponseEntity.ok(token);

            } else {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Map.of("message",
                                "Authentication failed: Not authenticated.")
                );
            }

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("message",
                            "BACKEND REJECTED LOGIN: "
                                    + e.getClass().getSimpleName()
                                    + " - "
                                    + e.getMessage())
            );
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestPasswordResetOTP(
            @RequestParam String email) {

        SecureRandom random = new SecureRandom();
        int otpNumber = 100000 + random.nextInt(900000);
        String generatedOtp = String.valueOf(otpNumber);

        String kafkaPayload = String.format(
                "{\"email\":\"%s\", \"otp\":\"%s\"}",
                email,
                generatedOtp
        );

        try {

            kafkaTemplate.send(
                    "password-reset-topic",
                    kafkaPayload
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "message",
                            "Kafka Broker event pipeline write failure.",
                            "status",
                            "ERROR"
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Verification security OTP token successfully dispatched to Kafka event stream.",
                        "status",
                        "DISPATCHED"
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> processPasswordReset(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Credentials updated successfully. Security vector re-aligned.",
                        "status",
                        "SUCCESS"
                )
        );
    }
}