package com.profesh.paymentservice.controller;

import com.profesh.paymentservice.entity.Payment;
import com.profesh.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public Payment executePayment(@RequestBody Payment payment) {
        return paymentService.processPayment(payment);
    }
}