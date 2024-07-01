package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.ServiceOrder;
import com.example.HotelPracaDyplomowa.Repository.ServiceOrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/serviceOrder")

public class ServiceOrderController {
    private final ServiceOrderRepository serviceOrderRepository;

    public ServiceOrderController(ServiceOrderRepository serviceOrderRepository) {
        this.serviceOrderRepository = serviceOrderRepository;
    }

    @DeleteMapping("/deleteServiceOrder")
    public ResponseEntity<String> deleteServiceOrder(@RequestParam Long serviceOrderId) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(serviceOrderId).orElse(null);
        serviceOrderRepository.delete(serviceOrder);
        return ResponseEntity.ok("Usunięto daną pozycję z koszyka!");
    }
}
