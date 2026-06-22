package com.profesh.inventoryservice.controller;

import com.profesh.inventoryservice.entity.Product;
import com.profesh.inventoryservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class ProductController {

    @Autowired
    private ProductService service;

    // Both Admin and Normal Users can view stuff
    @GetMapping("/products")
    public List<Product> fetchAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/products/{sku}")
    public Product fetchBySku(@PathVariable String sku) {
        return service.getProductBySku(sku);
    }

    // Admin-only monitoring feature
    @GetMapping("/alerts")
    public List<Product> fetchLowStockAlerts() {
        return service.getLowStockAlerts();
    }

    // Admin controls inventory information
    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return service.saveProduct(product);
    }

    @DeleteMapping("/delete/{id}")
    public String removeProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product with ID " + id + " deleted successfully.";
    }
}