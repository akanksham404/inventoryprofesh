package com.profesh.authservice.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class SecurityAopLogger {

    // 💻 Clean invocation without the double factory chain block
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    // Intercepts execution on forgot-password and reset-password mappings dynamically
    @Pointcut("execution(* com.profesh.authservice.controller.AuthController.requestPasswordResetOTP(..)) || " +
            "execution(* com.profesh.authservice.controller.AuthController.processPasswordReset(..))")
    public void passwordRecoveryMethods() {}

    // Advice fired right BEFORE the methods execute
    @Before("passwordRecoveryMethods()")
    public void logBeforeRecoveryAttempt(JoinPoint joinPoint) {
        log.info("🔒 [AOP SECURITY PRE-FLIGHT] Intercepted Request: {}", joinPoint.getSignature().getName());
        log.info("📍 Payload Metadata Trace Parameters: {}", Arrays.toString(joinPoint.getArgs()));
    }

    // Advice fired AFTER successful completion
    @AfterReturning(pointcut = "passwordRecoveryMethods()", returning = "result")
    public void logAfterSuccessfulRecovery(JoinPoint joinPoint, Object result) {
        log.info("✅ [AOP SECURITY AUDIT] Process completed cleanly for: {}", joinPoint.getSignature().getName());
        log.info("📊 Return Transaction Result State: {}", result);
    }
}