package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.Reservation;
import com.example.HotelPracaDyplomowa.Model.ServiceOrder;
import com.example.HotelPracaDyplomowa.Model.ShoppingCart;
import com.example.HotelPracaDyplomowa.Repository.ReservationRepository;
import com.example.HotelPracaDyplomowa.Repository.ServiceOrderRepository;
import com.example.HotelPracaDyplomowa.Repository.ShoppingCartRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/charts")
public class ChartsController {

    private final ShoppingCartRepository shoppingCartRepository;
    private final ServiceOrderRepository serviceOrderRepository;
    private final ReservationRepository reservationRepository;

    public ChartsController(ShoppingCartRepository shoppingCartRepository, ServiceOrderRepository serviceOrderRepository, ReservationRepository reservationRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.serviceOrderRepository = serviceOrderRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/chart1")
    public ResponseEntity<List<Float>> getAllMonthEarningsInYear(@RequestParam String year) {
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findAllByYear(year);
        List<Float> earnings = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            earnings.add(0.0f);
        }
        for(ShoppingCart shoppingCart : shoppingCarts) {
            List<ServiceOrder> serviceOrders = serviceOrderRepository.findAllByShoppingCartId(shoppingCart.getId());
            String extractedDigits = shoppingCart.getDateOfOrder().substring(5, 7);
            int monthNumber = Integer.parseInt(extractedDigits);
            for(ServiceOrder serviceOrder : serviceOrders) {
                float currentValue = earnings.get(monthNumber-1);
                earnings.set(monthNumber-1, currentValue + serviceOrder.getQuantity() * serviceOrder.getPrice());
            }
        }
        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/chart2")
    public ResponseEntity<List<Integer>> getAllMonthSoldServicesInYear(@RequestParam String year) {
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findAllByYear(year);
        List<Integer> quantity = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            quantity.add(0);
        }
        for(ShoppingCart shoppingCart : shoppingCarts) {
            List<ServiceOrder> serviceOrders = serviceOrderRepository.findAllByShoppingCartId(shoppingCart.getId());
            String extractedDigits = shoppingCart.getDateOfOrder().substring(5, 7);
            int monthNumber = Integer.parseInt(extractedDigits);
            for(ServiceOrder serviceOrder : serviceOrders) {
                int currentValue = quantity.get(monthNumber-1);
                quantity.set(monthNumber-1, currentValue + serviceOrder.getQuantity());
            }
        }
        return ResponseEntity.ok(quantity);
    }

    @GetMapping("/chart3")
    public ResponseEntity<List<Float>> getAllMonthEarningInYearReservation(@RequestParam String year) {
        List<Reservation> reservations = reservationRepository.findAllReservationByYearAndStatusReservation(year, "Wymeldowany");
        List<Float> earnings = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            earnings.add(0.0f);
        }
        for(Reservation reservation : reservations) {
            String extractedDigits = reservation.getLastDate().substring(5, 7);
            int monthNumber = Integer.parseInt(extractedDigits);
            float currentValue = earnings.get(monthNumber-1);
            earnings.set(monthNumber-1, currentValue + reservation.getPrice());
        }
        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/chart4")
    public ResponseEntity<List<Integer>> getAllMonthSoldReservationsInYear(@RequestParam String year) {
        List<Reservation> reservations = reservationRepository.findAllReservationByYearAndStatusReservation(year, "Wymeldowany");
        List<Integer> quantity = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            quantity.add(0);
        }
        for(Reservation reservation : reservations) {
            String extractedDigits = reservation.getLastDate().substring(5, 7);
            int monthNumber = Integer.parseInt(extractedDigits);
            int currentValue = quantity.get(monthNumber-1);
            quantity.set(monthNumber-1, currentValue + 1);
        }
        return ResponseEntity.ok(quantity);
    }
}
