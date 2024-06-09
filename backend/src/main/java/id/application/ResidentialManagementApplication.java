package id.application;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.theme.Theme;
import id.application.feature.model.entity.AppUser;
import id.application.feature.model.repositories.AppUserRepository;
import id.application.util.enums.ERole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@Theme("default")
public class ResidentialManagementApplication implements AppShellConfigurator {

    public static void main(String[] args) {
        SpringApplication.run(ResidentialManagementApplication.class, args);
    }

    @Bean
    CommandLineRunner run(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            var existingUser = userRepository.findUserByUsername("admin@email.com");
            if(existingUser.isEmpty()) {
                var appUser = new AppUser();
                appUser.setName("Admin");
                appUser.setEmail("admin@email.com");
                appUser.setRole(ERole.ADMIN);
                appUser.setPassword(passwordEncoder.encode("admin"));
                appUser.setEnabled(true);
                appUser.setEmail(appUser.getEmail());
                appUser.setAccountNonExpired(true);
                appUser.setAccountNonLocked(true);
                appUser.setCredentialsNonExpired(true);
                userRepository.save(appUser);
            }
        };
    }

}
