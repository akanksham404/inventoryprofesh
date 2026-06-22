package com.profesh.orderservice.client;

import com.profesh.orderservice.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    // Calls the exact endpoint inside ProductController in inventory-service
    @GetMapping("/inventory/products/{sku}")
    ProductDTO getProductBySku(@PathVariable("sku") String sku);
}