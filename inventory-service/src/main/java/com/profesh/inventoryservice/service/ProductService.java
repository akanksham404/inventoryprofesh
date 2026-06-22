package com.profesh.inventoryservice.service;

import com.profesh.inventoryservice.entity.Product;
import com.profesh.inventoryservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    // Open to both Admin and Users
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // Open to both Admin and Users
    public Product getProductBySku(String sku) {
        return repository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }

    // Only for Admins (Low stock warnings)
    public List<Product> getLowStockAlerts() {
        return repository.findLowStockProducts();
    }

    // Only for Admins (Adding inventory)
    public Product saveProduct(Product product) {
        if(repository.findBySku(product.getSku()).isPresent()) {
            throw new RuntimeException("Product with SKU " + product.getSku() + " already exists!");
        }
        return repository.save(product);
    }

    // Only for Admins (Deleting inventory)
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}