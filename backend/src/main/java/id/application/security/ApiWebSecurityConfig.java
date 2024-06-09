package id.application.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.vaadin.flow.spring.security.VaadinWebSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;


@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class ApiWebSecurityConfig extends VaadinWebSecurity {
    private static final String SECRET_KEY = "vfPZ/OUkKnseBPo52/XqDQQ3qrldVVzN4Glm6VM+ezl=";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request -> request
                .requestMatchers(VaadinWebSecurity.getDefaultHttpSecurityPermitMatcher()).permitAll()
                .requestMatchers(VaadinWebSecurity.getDefaultWebSecurityIgnoreMatcher()).permitAll()
                .requestMatchers("/").permitAll() // TODO will be removed if MainLayout is DONE
                .requestMatchers("/auth/**").permitAll());
        super.configure(http);
        setLoginView(http, "/login");
        setStatelessAuthentication(http,
                new SecretKeySpec(
                        Base64.getDecoder().decode(SECRET_KEY),
                        JWSAlgorithm.HS256.getName()),
                "residential-management.id",
                3600);
    }

    @Bean
    public PasswordEncoder bcryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
