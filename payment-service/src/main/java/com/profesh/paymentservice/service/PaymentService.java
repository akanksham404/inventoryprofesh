package com.profesh.paymentservice.service;

import com.profesh.paymentservice.entity.Payment;
import com.profesh.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(Payment payment) {
        // 1. Simulate payment processing gateway response
        // If the amount is less than or equal to 0, fail the transaction immediately
        if (payment.getAmount() <= 0) {
            payment.setPaymentStatus("FAILED");
            payment.setTransactionId("TXN-FAILED-000");
        } else {
            payment.setPaymentStatus("SUCCESS");
            // Generate a random unique tracking hash to represent the banking confirmation code
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // 2. Save the final payment receipt to the database
        return paymentRepository.save(payment);
    }
}