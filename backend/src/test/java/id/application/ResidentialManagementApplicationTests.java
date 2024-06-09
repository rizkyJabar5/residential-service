package id.application;

import id.application.feature.service.AuthenticationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(locations= "classpath:application.yaml")
class ResidentialManagementApplicationTests {

    @Autowired
    AuthenticationService authenticationService;

    @Test
    void contextLoads() {
        assertThat(authenticationService).isNotNull();
    }

}
