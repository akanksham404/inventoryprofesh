package com.profesh.orderservice.service;

import com.profesh.orderservice.client.InventoryClient;
import com.profesh.orderservice.dto.ProductDTO;
import com.profesh.orderservice.entity.Order;
import com.profesh.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryClient inventoryClient;

    public Order placeOrder(Order order) {
        // 1. Call the inventory-service via Feign Client to get live data
        ProductDTO product = inventoryClient.getProductBySku(order.getSku());

        // 2. Business Logic: Check if enough stock exists
        if (product.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock available for SKU: " + order.getSku());
        }

        // 3. Automated Calculation: Set total price and initial status
        order.setTotalPrice(product.getPrice() * order.getQuantity());
        order.setStatus("PENDING"); // Will be processed by payment-service next!

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}