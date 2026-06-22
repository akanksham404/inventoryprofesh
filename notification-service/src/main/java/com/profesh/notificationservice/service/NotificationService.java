package com.profesh.notificationservice.service;

import com.profesh.notificationservice.dto.OrderNotificationDTO;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendOrderAlert(OrderNotificationDTO dto) {
        // Simulating the dispatch of an enterprise transactional message
        System.out.println("=========================================================");
        System.out.println("📩 NEW NOTIFICATION EVENT TRIGGERED");
        System.out.println("Target Destination: " + dto.getCustomerEmail());
        System.out.println("Message: Order #" + dto.getOrderId() + " processed successfully!");
        System.out.println("Details: " + dto.getQuantity() + "x [" + dto.getSku() + "] | Total Billed: $" + dto.getTotalPrice());
        System.out.println("Status: Real-time Email Alert Dispatched Successfully.");
        System.out.println("=========================================================");
    }
}