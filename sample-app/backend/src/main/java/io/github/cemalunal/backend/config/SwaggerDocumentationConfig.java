package io.github.cemalunal.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerDocumentationConfig {

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Simple Backend Service")
                .description("Simple Backend Service with CRUD operations")
                .termsOfServiceUrl("")
                .contact(new Contact("Cemal","cemalunal.github.io", "cemalunal@yahoo.com"))
                .build();
    }

    @Bean
    public Docket simpleBackendApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("io.github.cemalunal.backend.controller"))
                .build()
                .apiInfo(apiInfo());
    }
}
