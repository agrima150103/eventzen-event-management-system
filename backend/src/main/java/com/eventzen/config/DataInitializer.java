package com.eventzen.config;

import com.eventzen.entity.User;
import com.eventzen.enums.Role;
import com.eventzen.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// ✅ This runs ONCE when the app starts
// It creates a default admin user if none exists
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not already in database
        if (!userRepository.existsByEmail("admin@eventzen.com")) {
            User admin = User.builder()
                    .fullName("EventZen Admin")
                    .email("admin@eventzen.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9000000000")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin@eventzen.com / admin123");
        }

        // Create default customer if not already in database
        if (!userRepository.existsByEmail("user@eventzen.com")) {
            User customer = User.builder()
                    .fullName("Test Customer")
                    .email("user@eventzen.com")
                    .password(passwordEncoder.encode("user123"))
                    .phone("9111111111")
                    .role(Role.CUSTOMER)
                    .enabled(true)
                    .build();
            userRepository.save(customer);
            System.out.println("✅ Default customer created: user@eventzen.com / user123");
        }
    }
}