package com.shopifake.imageservice;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

	@Bean
	@ServiceConnection
	PostgreSQLContainer<?> postgresContainer() {
		return new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"));
	}

	@Bean
	GenericContainer<?> minioContainer() {
		GenericContainer<?> minio = new GenericContainer<>(DockerImageName.parse("minio/minio:latest"))
				.withExposedPorts(9000, 9001)
				.withEnv("MINIO_ROOT_USER", "minioadmin")
				.withEnv("MINIO_ROOT_PASSWORD", "minioadmin")
				.withCommand("server", "/data", "--console-address", ":9001");
		minio.start();

		// Configuration des propriétés MinIO pour les tests
		System.setProperty("minio.endpoint", "http://localhost:" + minio.getMappedPort(9000));
		System.setProperty("minio.access-key", "minioadmin");
		System.setProperty("minio.secret-key", "minioadmin");
		System.setProperty("minio.bucket-name", "test-bucket");
		System.setProperty("minio.region", "us-east-1");

		return minio;
	}

}
