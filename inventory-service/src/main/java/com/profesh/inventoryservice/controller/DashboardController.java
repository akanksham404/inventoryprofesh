package com.profesh.inventoryservice.controller;

import com.profesh.inventoryservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    // This hooks directly into your database handler
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getLiveMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        try {
            // 1. Ask MySQL for the total number of rows in your product table
            long totalProducts = productRepository.count();

            // 2. Ask MySQL how many items have a stock level lower than 5
            long lowStockCount = productRepository.countByQuantityLessThan(5);

            // 3. Pack them into a clean data map to send to React
            metrics.put("totalProducts", totalProducts);
            metrics.put("lowStockItems", lowStockCount);
            metrics.put("systemStatus", "CONNECTED");

        } catch (Exception e) {
            // If the database fails or columns don't match yet, fallback safely
            metrics.put("totalProducts", 0);
            metrics.put("lowStockItems", 0);
            metrics.put("systemStatus", "DATABASE_ERROR");
        }

        return ResponseEntity.ok(metrics);
    }
}