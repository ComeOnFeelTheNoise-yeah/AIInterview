package com.react.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class ProjectApplication {
//implements CommandLineRunner
//	@Autowired
//	private CsvLoader csvLoader;

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

//	@Override
//	public void run(String... args) throws Exception {
//		csvLoader.loadCsvAndSave();
//	}

	@Bean
	public WebMvcConfigurer corsConfigurer(){
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry){
				registry.addMapping("/**").allowedOriginPatterns();
			}
		};
	}

}
