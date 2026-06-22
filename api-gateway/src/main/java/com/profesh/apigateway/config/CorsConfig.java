package com.profesh.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOrigin("http://localhost:3000"); // Trust your React dev server
        corsConfig.addAllowedMethod("*");                    // Allow GET, POST, PUT, DELETE, OPTIONS
        corsConfig.addAllowedHeader("*");                    // Allow all incoming headers (Authorization, Content-Type, etc.)
        corsConfig.setAllowCredentials(true);                // Allow auth session cookies/credentials if needed

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); // Apply globally to all gateway routes

        return new CorsWebFilter(source);
    }
}