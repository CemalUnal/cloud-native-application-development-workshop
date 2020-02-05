package io.github.cemalunal.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableZuulProxy
@ComponentScan(basePackages = {"io.github.cemalunal.gateway"})
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer () {
		return new WebMvcConfigurer() {
			public void addCorsMappings (CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}

}
