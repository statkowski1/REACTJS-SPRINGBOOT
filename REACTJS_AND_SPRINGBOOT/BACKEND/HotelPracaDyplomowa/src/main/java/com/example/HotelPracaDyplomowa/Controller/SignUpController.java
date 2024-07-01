package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.User;
import com.example.HotelPracaDyplomowa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/signup")
public class SignUpController {
    @Autowired
    private final UserRepository userRepository;

    public SignUpController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<User> signUp(@RequestBody User user) {
        user.setTypeUser("Klient");
        user.setStatusUser("Aktywny");
        User newUser = userRepository.save(user);
        return ResponseEntity.ok(newUser);
    }
}
