package com.shopifake.mainapi;

import org.springframework.boot.SpringApplication;

public class TestMainApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(MainApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
