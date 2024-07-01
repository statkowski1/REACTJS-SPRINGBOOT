package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.Reservation;
import com.example.HotelPracaDyplomowa.Model.Room;
import com.example.HotelPracaDyplomowa.Repository.ReservationRepository;
import com.example.HotelPracaDyplomowa.Repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/room")
public class RoomController {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public RoomController(RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getRoomFree() {
        List<Room> room = roomRepository.findByStatus("Wolny");
        return ResponseEntity.ok(room);
    }

    @GetMapping("/showAllRooms")
    public ResponseEntity<List<Room>> getAllRoom() {
        List<Room> room = roomRepository.findAll();
        return ResponseEntity.ok(room);
    }

    @GetMapping("/showRoom")
    public ResponseEntity<Room> getRoom(@RequestParam Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(null);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/addRoom")
    public ResponseEntity<String> addRoom(@RequestParam String newNumberOfRoom, @RequestParam String newTypeRoom, @RequestParam Float newPrice, @RequestParam(required = false) MultipartFile roomImage) {
        Room newRoom = new Room();
        newRoom.setNumberOfRoom(newNumberOfRoom);
        newRoom.setTypeRoom(newTypeRoom);
        newRoom.setPrice(newPrice);
        newRoom.setStatus("Wolny");
        try {
            if (roomImage != null) {
                BufferedImage checkImage = ImageIO.read(roomImage.getInputStream());
                int imageWidth = checkImage.getWidth();
                int imageHeight = checkImage.getHeight();
                if(imageWidth != 1000 || imageHeight != 600) {
                    return ResponseEntity.badRequest().body("Zdjęcie nie ma wymaganych wymiarów! Umieść zdjęcie o wymiarach 1000x600 px!");
                }
                newRoom.setImage(roomImage.getBytes());
            }
            else {
                newRoom.setImage(null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nie udało się przekazać/zapisać zdjęcia!");
        }
        roomRepository.save(newRoom);
        return ResponseEntity.ok("Dodano pokój!");
    }

    @PostMapping("/reservation")
    public ResponseEntity<String> createReservation(@RequestParam Long userId, @RequestParam Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        List<Reservation> controlReservation1 = reservationRepository.findByIdUserAndStatusReservation(userId, "Zarezerwowany");
        List<Reservation> controlReservation2 = reservationRepository.findByIdUserAndStatusReservation(userId, "Zameldowany");
        Reservation reservation = new Reservation();
        if(room.getStatus().equals("Wolny") && controlReservation1.isEmpty() && controlReservation2.isEmpty()) {
            room.setStatus("Zajęty");
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            String formattedDate = now.format(formatter);
            reservation.setFirstDate(formattedDate);
            reservation.setLastDate(null);
            reservation.setStatusReservation("Zarezerwowany");
            reservation.setIdUser(userId);
            reservation.setIdRoom(roomId);
            reservation.setPrice(room.getPrice());
            roomRepository.save(room);
            reservationRepository.save(reservation);
            return ResponseEntity.ok("Zarezerwowano pokój!");
        }
        else if(!controlReservation1.isEmpty() || !controlReservation2.isEmpty()) {
            return ResponseEntity.ok("Klient może zarezerwować tylko 1 pokój w tym samym momencie!");
        }
        return ResponseEntity.ok("Pokój jest zajęty!");
    }

    @PutMapping("/editRoom/{roomId}")
    public ResponseEntity<String> editRoom(@PathVariable("roomId") Long roomId, @RequestParam Integer option, @RequestParam String newNumberOfRoom, @RequestParam String newTypeRoom, @RequestParam Float newPrice, @RequestParam (required = false) MultipartFile newImage) {
        Room room = roomRepository.findById(roomId).orElse(null);
        room.setNumberOfRoom(newNumberOfRoom);
        room.setTypeRoom(newTypeRoom);
        room.setPrice(newPrice);
        if(option == 1) {
            try {
                if (newImage != null) {
                    BufferedImage checkImage = ImageIO.read(newImage.getInputStream());
                    int imageWidth = checkImage.getWidth();
                    int imageHeight = checkImage.getHeight();
                    if (imageWidth != 1000 || imageHeight != 600) {
                        return ResponseEntity.badRequest().body("Zdjęcie nie ma wymaganych wymiarów! Umieść zdjęcie o wymiarach 1000x600 px!");
                    }
                    room.setImage(newImage.getBytes());
                } else {
                    room.setImage(null);
                }
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nie udało się przekazać/zapisać zdjęcia!");
            }
        } else if(option == 2) {
            room.setImage(null);
        }
        roomRepository.save(room);
        return ResponseEntity.ok("Edytowano usługę!");
    }

    @DeleteMapping("/deleteRoom")
    public ResponseEntity<String> deleteRoom(@RequestParam Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Nie ma takiego pokoju!"));
        roomRepository.delete(room);
        return ResponseEntity.ok("Pokój został usunięty!");
    }
}