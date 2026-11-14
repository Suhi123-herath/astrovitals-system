package com.astrovitals.config;

import com.astrovitals.domain.Astronaut;
import com.astrovitals.repository.AstronautRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@OpenAPIDefinition(info = @Info(title = "AstroVitals API", version = "1.0", description = "Crew health monitoring for NASA Space Apps 2026. Demo thresholds, not medical advice."))
public class WebConfig implements WebMvcConfigurer {
    private final String[] origins;
    public WebConfig(@Value("${app.cors.allowed-origins}") String[] origins) { this.origins = origins; }

    @Override public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/api/**").allowedOrigins(origins).allowedMethods("GET", "POST", "DELETE", "OPTIONS");
    }

    /** Guarantees the demo astronaut (id 1) exists on a fresh database. */
    @Bean CommandLineRunner initData(AstronautRepository repo) {
        return args -> { if (repo.count() == 0) repo.save(new Astronaut("Crew member 1")); };
    }
}
