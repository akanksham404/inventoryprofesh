package com.profesh.orderservice.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private Double price;
    private Integer quantity;
}