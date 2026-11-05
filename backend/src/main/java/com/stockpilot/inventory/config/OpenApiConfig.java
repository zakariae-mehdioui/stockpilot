package com.stockpilot.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI documentation configuration with JWT bearer scheme.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI customOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("StockPilot Inventory API")
                        .version("1.0.0")
                        .description("Cloud-native inventory management REST API with JWT authentication.")
                        .contact(new Contact().name("StockPilot").email("support@stockpilot.io"))
                        .license(new License().name("MIT")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes(SECURITY_SCHEME, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Provide the JWT token returned by /auth/login")));
    }
}
