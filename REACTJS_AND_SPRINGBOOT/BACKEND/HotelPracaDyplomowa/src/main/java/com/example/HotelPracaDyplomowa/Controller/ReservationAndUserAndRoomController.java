package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.Reservation;
import com.example.HotelPracaDyplomowa.Model.ReservationAndUserAndRoom;
import com.example.HotelPracaDyplomowa.Model.Room;
import com.example.HotelPracaDyplomowa.Model.User;
import com.example.HotelPracaDyplomowa.Repository.ReservationRepository;
import com.example.HotelPracaDyplomowa.Repository.RoomRepository;
import com.example.HotelPracaDyplomowa.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/reservationAndUserAndRoom")

public class ReservationAndUserAndRoomController {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public ReservationAndUserAndRoomController(ReservationRepository reservationRepository, UserRepository userRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/showAllReservationAndUserAndRoom")
    public ResponseEntity<List<ReservationAndUserAndRoom>> getAllReservationAndUserAndRoomController() {
        List<ReservationAndUserAndRoom> reservationAndUserAndRooms = new ArrayList<>();
        List<Reservation> reservations = reservationRepository.findAll();
        Long number = 1L;

        for(Reservation reservation : reservations) {
            User user = userRepository.findById(reservation.getIdUser()).orElse(null);
            Room room = roomRepository.findById(reservation.getIdRoom()).orElse(null);
            user.setPassword(null);

            ReservationAndUserAndRoom reservationAndUserAndRoom = new ReservationAndUserAndRoom();

            reservationAndUserAndRoom.setId(number);
            reservationAndUserAndRoom.setReservation(reservation);
            reservationAndUserAndRoom.setUser(user);
            reservationAndUserAndRoom.setRoom(room);

            number = number + 1L;
            reservationAndUserAndRooms.add(reservationAndUserAndRoom);
        }
        return ResponseEntity.ok(reservationAndUserAndRooms);
    }
}
