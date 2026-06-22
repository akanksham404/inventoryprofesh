package com.profesh.notificationservice.controller;

import com.profesh.notificationservice.dto.OrderNotificationDTO;
import com.profesh.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public String triggerNotification(@RequestBody OrderNotificationDTO dto) {
        notificationService.sendOrderAlert(dto);
        return "Notification alert processed for Order ID: " + dto.getOrderId();
    }
}