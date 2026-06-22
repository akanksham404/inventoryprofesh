package com.profesh.notificationservice.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationKafkaConsumer {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 🎧 Listen to the exact topic fired by AuthController
    @KafkaListener(topics = "password-reset-topic", groupId = "notification-group")
    public void consumePasswordResetEvent(String message) {
        log.info("📥 [KAFKA CONSUMER] Intercepted incoming raw event block stream payload: {}", message);

        try {
            // Parse the JSON string payload package back into data points
            JsonNode jsonNode = objectMapper.readTree(message);
            String email = jsonNode.get("email").asText();
            String otp = jsonNode.get("otp").asText();

            log.info("🎯 [NOTIFICATION LAYER] Successfully extracted payload details:");
            log.info("   ➡️ Target Email Destination: {}", email);
            log.info("   ➡️ Generated OTP Secure Token: {}", otp);

            // =========================================================================
            // 📨 NEXT STEP LOGIC PLAN:
            // This is exactly where we will call your JavaMailSender service bean!
            // mailSender.sendOtpEmail(email, otp);
            // =========================================================================

            log.info("✅ [NOTIFICATION EXECUTION] Email dispatcher preparation thread alignment completed.");

        } catch (Exception e) {
            log.error("❌ [CONSUMER ERROR] Critical failure parsing Kafka stream JSON package data", e);
        }
    }
}