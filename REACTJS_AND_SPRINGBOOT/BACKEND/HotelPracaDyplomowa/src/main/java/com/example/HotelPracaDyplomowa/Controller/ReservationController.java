package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.Reservation;
import com.example.HotelPracaDyplomowa.Model.Room;
import com.example.HotelPracaDyplomowa.Repository.ReservationRepository;
import com.example.HotelPracaDyplomowa.Repository.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/reservation")
public class ReservationController {
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationController(ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/showAllReservation")
    public ResponseEntity<List<Reservation>> getAllReservation() {
        List<Reservation> reservations = reservationRepository.findAll();
        reservations.sort(Comparator.comparing(Reservation::getFirstDate));
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/showReservation")
    public ResponseEntity<Reservation> getReservation(@RequestParam(name = "userId") Long userId) {
        Reservation reservation1 = reservationRepository.findOneByIdUserAndStatusReservation(userId, "Zarezerwowany");
        Reservation reservation2 = reservationRepository.findOneByIdUserAndStatusReservation(userId, "Zakwaterowany");
        if(reservation1 != null)
        {
            return ResponseEntity.ok(reservation1);
        }
        return ResponseEntity.ok(reservation2);
    }

    @PutMapping("/editStatusReservation/{id}")
    public ResponseEntity<String> editStatusReservation(@PathVariable("id") Long id, @RequestBody Reservation newReservation) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Ta rezerwacja nie istnieje!"));
        Room room = roomRepository.findById(reservation.getIdRoom()).orElseThrow(() -> new IllegalArgumentException("Taki pokój nie istnieje!"));
        System.out.println("id="+id);
        System.out.println("option="+newReservation.getStatusReservation());
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDate = now.format(formatter);
        if("Zarezerwowany".equals(newReservation.getStatusReservation())) {
            reservation.setStatusReservation(newReservation.getStatusReservation());
            reservation.setSecondDate(null);
            reservation.setLastDate(null);
            room.setStatus("Zajęty");
        }
        else if("Zakwaterowany".equals(newReservation.getStatusReservation())) {
            reservation.setStatusReservation(newReservation.getStatusReservation());
            reservation.setSecondDate(formattedDate);
            reservation.setLastDate(null);
            room.setStatus("Zajęty");
        }
        else if("Wymeldowany".equals(newReservation.getStatusReservation())) {
            reservation.setStatusReservation(newReservation.getStatusReservation());
            reservation.setLastDate(formattedDate);
            room.setStatus("Wolny");
        }
        reservationRepository.save(reservation);
        roomRepository.save(room);
        return ResponseEntity.ok("Zmieniono status rezerwacji na "+newReservation.getStatusReservation()+"!");
    }

    @DeleteMapping("/deleteReservation")
    public ResponseEntity<String> deleteReservation(@RequestParam Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Ta rezerwacja nie istnieje!"));
        Room room = roomRepository.findById(reservation.getIdRoom()).orElse(null);
        if(room != null)
        {
            room.setStatus("Wolny");
            roomRepository.save(room);
        }
        reservationRepository.delete(reservation);
        return ResponseEntity.ok("Rezerwacja została usunięta!");
    }
}
