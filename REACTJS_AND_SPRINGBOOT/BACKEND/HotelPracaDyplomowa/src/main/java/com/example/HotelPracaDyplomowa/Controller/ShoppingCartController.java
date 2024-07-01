package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.ServiceOrder;
import com.example.HotelPracaDyplomowa.Model.ShoppingCart;
import com.example.HotelPracaDyplomowa.Model.ShoppingCartAndServiceOrders;
import com.example.HotelPracaDyplomowa.Repository.ServiceOrderRepository;
import com.example.HotelPracaDyplomowa.Repository.ShoppingCartRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/shoppingCart")

public class ShoppingCartController {
    private final ShoppingCartRepository shoppingCartRepository;
    private final ServiceOrderRepository serviceOrderRepository;

    public ShoppingCartController(ShoppingCartRepository shoppingCartRepository, ServiceOrderRepository serviceOrderRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.serviceOrderRepository = serviceOrderRepository;
    }

    @GetMapping("/showAllShoppingCart")
    public ResponseEntity<List<ShoppingCartAndServiceOrders>> getAllShoppingCart() {
        List<ShoppingCartAndServiceOrders> shoppingCartAndServiceOrdersList = new ArrayList<>();
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findAll();
        Long number = 1L;

        for(ShoppingCart shoppingCart : shoppingCarts) {
            ShoppingCartAndServiceOrders shoppingCartAndServiceOrders = new ShoppingCartAndServiceOrders();
            shoppingCartAndServiceOrders.setId(number);
            shoppingCartAndServiceOrders.setShoppingCart(shoppingCart);
            List<ServiceOrder> serviceOrders = serviceOrderRepository.findAllByShoppingCartId(shoppingCart.getId());
            shoppingCartAndServiceOrders.setServiceOrders(serviceOrders);

            number = number + 1L;
            shoppingCartAndServiceOrdersList.add(shoppingCartAndServiceOrders);
        }
        return ResponseEntity.ok(shoppingCartAndServiceOrdersList);
    }

    @GetMapping("/showAllCustomerShoppingCart")
    public ResponseEntity<List<ShoppingCartAndServiceOrders>> getAllCustomerShoppingCart(@RequestParam Long userId) {
        List<ShoppingCartAndServiceOrders> shoppingCartAndServiceOrdersList = new ArrayList<>();
        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findAllByUserId(userId);
        Long number = 1L;

        for(ShoppingCart shoppingCart : shoppingCarts) {
            ShoppingCartAndServiceOrders shoppingCartAndServiceOrders = new ShoppingCartAndServiceOrders();
            shoppingCartAndServiceOrders.setId(number);
            shoppingCartAndServiceOrders.setShoppingCart(shoppingCart);
            List<ServiceOrder> serviceOrders = serviceOrderRepository.findAllByShoppingCartId(shoppingCart.getId());
            shoppingCartAndServiceOrders.setServiceOrders(serviceOrders);

            number = number + 1L;
            shoppingCartAndServiceOrdersList.add(shoppingCartAndServiceOrders);
        }
        return ResponseEntity.ok(shoppingCartAndServiceOrdersList);
    }

    @PostMapping("/createShoppingCart")
    public ResponseEntity<String> createShoppingCart(@RequestBody List<ServiceOrder> serviceOrders, @RequestParam Long userId) {
        try {
            ShoppingCart shoppingCart = new ShoppingCart();
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            String formattedDate = now.format(formatter);
            shoppingCart.setDateOfOrder(formattedDate);
            shoppingCart.setUserId(userId);
            shoppingCart.setPaymentStatus("Zamówiono");
            shoppingCart.setReceiveStatus("Oczekujący");
            shoppingCartRepository.save(shoppingCart);

            for(ServiceOrder serviceOrder : serviceOrders) {
                serviceOrder.setShoppingCartId(shoppingCart.getId());
            }

            serviceOrderRepository.saveAll(serviceOrders);

            return ResponseEntity.ok("Zapisano zamówienie!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Wystąpił błąd podczas tworzenia zamówienia: " + e.getMessage());
        }
    }

    @PutMapping("/changeShoppingCartPaymentStatus/{id}")
    public ResponseEntity<String> changeShoppingCartPaymentStatus(@PathVariable("id") Long id, @RequestBody ShoppingCart shoppingCart) {
        ShoppingCart updateShoppingCart = shoppingCartRepository.findById(id).orElse(null);
        updateShoppingCart.setPaymentStatus(shoppingCart.getPaymentStatus());
        shoppingCartRepository.save(updateShoppingCart);
        return ResponseEntity.ok("Zmieniono status płatności na: "+shoppingCart.getPaymentStatus()+"!");
    }

    @PutMapping("/changeShoppingCartReceiveStatus/{id}")
    public ResponseEntity<String> changeShoppingCartReceiveStatus(@PathVariable("id") Long id, @RequestBody ShoppingCart shoppingCart) {
        ShoppingCart updateShoppingCart = shoppingCartRepository.findById(id).orElse(null);
        updateShoppingCart.setReceiveStatus(shoppingCart.getPaymentStatus());
        shoppingCartRepository.save(updateShoppingCart);
        return ResponseEntity.ok("Zmieniono status zamówienia na: "+shoppingCart.getReceiveStatus()+"!");
    }

    @DeleteMapping("/deleteShoppingCart")
    public ResponseEntity<String> deleteShoppingCart(@RequestParam Long shoppingCartId) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(shoppingCartId).orElse(null);
        List<ServiceOrder> serviceOrders = serviceOrderRepository.findAllByShoppingCartId(shoppingCartId);
        shoppingCartRepository.delete(shoppingCart);
        serviceOrderRepository.deleteAll(serviceOrders);
        return ResponseEntity.ok("Usunięto dane zamówienie i wszystkie jej pozycję!");
    }
}

