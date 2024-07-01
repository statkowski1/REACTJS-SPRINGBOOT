package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.User;
import com.example.HotelPracaDyplomowa.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/user")

public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getUser() {
        List<User> users = userRepository.findAll();
        for(User user : users) {
            user.setPassword(null);
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/showAllCustomersFirstNameAndLastName")
    public ResponseEntity<List<User>> getAllUsersFirstNameAndLastName() {
        List<User> users = userRepository.findAllByTypeUser("Klient");
        for(User user : users) {
            user.setTypeUser(null);
            user.setStatusUser(null);
            user.setAddress(null);
            user.setPhone(null);
            user.setEmail(null);
            user.setPassword(null);
            user.setImage(null);
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/signedin")
    public ResponseEntity<User> getUserSignedIn(@RequestParam Long id) {
        User user = userRepository.findById(id).orElse(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/showUserById")
    public ResponseEntity<User> getUserById(@RequestParam Long id) {
        User user = userRepository.findById(id).orElse(null);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

//    @PostMapping()
//    public ResponseEntity<User> createUser(@RequestBody User user) {
//        User newUser = userRepository.save(user);
//        return ResponseEntity.ok(newUser);
//    }

    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@RequestBody User newUser) {
        User user = userRepository.findByEmail(newUser.getEmail());
        if(user != null)
        {
            return ResponseEntity.ok("Użytkownik o takim emailu już istnieje!");
        }
        else
        {
            newUser.setStatusUser("Aktywne");
            userRepository.save(newUser);
            return ResponseEntity.ok("Konto zostało utworzone!");
        }
    }

    @PostMapping("/imageUploadUser")
    public ResponseEntity<String> uploadImageUser(@RequestParam Long id, @RequestParam MultipartFile imageUser) {
        User user = userRepository.findById(id).orElse(null);
        try {
            user.setImage(imageUser.getBytes());
            userRepository.save(user);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nie udało się przekazać/zapisać zdjęcia!");
        }
        return ResponseEntity.ok("Pomyślnie dodano zdjęcie!");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        User updateUser = userRepository.findById(id).orElse(null);
        updateUser.setFirstName(user.getFirstName());
        updateUser.setLastName(user.getLastName());
        updateUser.setAddress(user.getAddress());
        updateUser.setPhone(user.getPhone());

        userRepository.save(updateUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/updateImage/{updateId}")
    public ResponseEntity<String> updateUserImage(@PathVariable("updateId") Long updateId, @RequestParam("newImage") MultipartFile newImage) {
        User updateUser = userRepository.findById(updateId).orElse(null);
        try {
            if (newImage != null) {
                BufferedImage checkImage = ImageIO.read(newImage.getInputStream());
                int imageWidth = checkImage.getWidth();
                int imageHeight = checkImage.getHeight();
                if (imageWidth != imageHeight) {
                    return ResponseEntity.ok("Zdjęcie nie ma wymaganych wymiarów! Umieść zdjęcie kwadratowe (o takiej samej wysokości i szerokości w pixelach)!");
                }
            }
            updateUser.setImage(newImage.getBytes());
            userRepository.save(updateUser);
        }catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nie udało się przekazać/zapisać zdjęcia!");
        }
        return ResponseEntity.ok("Zmieniono zdjęcie!");
    }

    @PutMapping("/updateDeleteImage/{updateDeleteId}")
    public ResponseEntity<String> updateDeleteUserImage(@PathVariable("updateDeleteId") Long updateDeleteId) {
        User updateUser = userRepository.findById(updateDeleteId).orElse(null);
        updateUser.setImage(null);
        userRepository.save(updateUser);
        return ResponseEntity.ok("Usunięto zdjęcie profilowe!");
    }

    @PutMapping("/updateUserType/{id}")
    public ResponseEntity<String> updateUserType(@PathVariable("id") Long id, @RequestBody User user) {
        User updateUser = userRepository.findById(id).orElse(null);
        updateUser.setTypeUser(user.getTypeUser());
        userRepository.save(updateUser);
        return ResponseEntity.ok("Zmieniono typ użytkownika na "+updateUser.getTypeUser());
    }

    @PutMapping("/changeUserStatus/{id}")
    public ResponseEntity<String> changeUserStatus(@PathVariable("id") Long id, @RequestBody User user) {
        User updateUser = userRepository.findById(id).orElse(null);
        updateUser.setStatusUser(user.getStatusUser());
        userRepository.save(updateUser);
        if(user.getStatusUser() == "Aktywne")
        {
            return ResponseEntity.ok("Konto jest z powrotem aktywne!");
        }
        else if(user.getStatusUser() == "Zablokowane")
        {
            return ResponseEntity.ok("Konto zostało zablokowane!");
        }
        else
        {
            return ResponseEntity.ok("Wystąpił błąd!");
        }
    }
}
