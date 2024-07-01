package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.User;
import com.example.HotelPracaDyplomowa.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/signin")
public class SignInController {

    private final UserRepository userRepository;

    public SignInController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<User> signIn(@RequestParam String email, @RequestParam String password) {
        User user = userRepository.findByEmailAndPassword(email, password);
        if(user != null && !"Zablokowane".equals(user.getStatusUser())) {
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
