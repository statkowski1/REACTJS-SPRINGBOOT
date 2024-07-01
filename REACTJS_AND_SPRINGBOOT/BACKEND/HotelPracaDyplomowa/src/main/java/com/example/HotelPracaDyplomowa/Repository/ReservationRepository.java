package com.example.HotelPracaDyplomowa.Repository;

import com.example.HotelPracaDyplomowa.Model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByIdUserAndStatusReservation(Long idUser, String statusReservation);
    Reservation findOneByIdUserAndStatusReservation(Long idUser, String statusReservation);
    @Query("SELECT r FROM Reservation r WHERE SUBSTRING(r.lastDate, 1, 4) = :year AND r.statusReservation = :statusReservation")
    List<Reservation> findAllReservationByYearAndStatusReservation(@Param("year") String year, String statusReservation);
    Reservation findByIdUser(Long idUser);
}
