package com.resume.analyzer;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // ==============================
    // SIGN UP
    // ==============================

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestBody User user) {

        if (user.getEmail() == null ||
            user.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }


        if (user.getPassword() == null ||
            user.getPassword().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }


        Optional<User> existingUser =
                userRepository.findByEmail(
                        user.getEmail().trim()
                );


        if (existingUser.isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email already registered");
        }


        // Encrypt password before saving

        String encryptedPassword =
                passwordEncoder.encode(
                        user.getPassword()
                );


        User newUser = new User(
                user.getEmail().trim(),
                encryptedPassword
        );


        userRepository.save(newUser);


        return ResponseEntity.ok(
                "Registration successful"
        );
    }


    // ==============================
    // LOGIN
    // ==============================

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody User user) {


        Optional<User> existingUser =
                userRepository.findByEmail(
                        user.getEmail().trim()
                );


        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }


        User databaseUser =
                existingUser.get();


        // Compare entered password
        // with encrypted password

        boolean passwordMatches =
                passwordEncoder.matches(
                        user.getPassword(),
                        databaseUser.getPassword()
                );


        if (!passwordMatches) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid password");
        }


        return ResponseEntity.ok(
                "Login successful"
        );
    }
}