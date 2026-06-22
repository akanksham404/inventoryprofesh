package com.profesh.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderNotificationDTO {
    private Long orderId;
    private String sku;
    private Integer quantity;
    private Double totalPrice;
    private String customerEmail;
}