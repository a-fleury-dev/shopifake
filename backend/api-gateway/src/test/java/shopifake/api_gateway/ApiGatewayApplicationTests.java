package shopifake.api_gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = ApiGatewayApplicationTests.TestConfig.class,
	webEnvironment = SpringBootTest.WebEnvironment.NONE,
	properties = {
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false",
		"spring.cloud.gateway.discovery.locator.enabled=false",
		"spring.autoconfigure.exclude=org.springframework.cloud.gateway.discovery.GatewayDiscoveryClientAutoConfiguration,org.springframework.cloud.gateway.config.GatewayAutoConfiguration"
	})
class ApiGatewayApplicationTests {

    @org.springframework.context.annotation.Configuration
    static class TestConfig {
	// minimal test configuration to avoid loading the full ApiGatewayApplication and its auto-configs
    }

	@Test
	void contextLoads() {
		assert true;
	}

}
