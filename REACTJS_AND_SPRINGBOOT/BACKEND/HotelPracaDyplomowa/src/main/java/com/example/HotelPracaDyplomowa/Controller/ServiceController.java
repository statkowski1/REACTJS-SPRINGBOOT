package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.Service;
import com.example.HotelPracaDyplomowa.Repository.ServiceRepository;
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
@RequestMapping("/service")

public class ServiceController {
    private final ServiceRepository serviceRepository;

    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping("/showAllService")
    public ResponseEntity<List<Service>> getAllService() {
        List<Service> services = serviceRepository.findAll();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/showServices")
    public ResponseEntity<List<Service>> getServices() {
        List<Service> services = serviceRepository.findByStatus("Dostępne");
        return ResponseEntity.ok(services);
    }

    @GetMapping("/showService")
    public ResponseEntity<Service> getService(@RequestParam Long serviceId) {
        Service service = serviceRepository.findById(serviceId).orElse(null);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/showServiceName")
    public ResponseEntity<String> getServiceName(@RequestParam Long serviceId) {
        Service service = serviceRepository.findById(serviceId).orElse(null);
        return ResponseEntity.ok(service.getName());
    }

    @GetMapping("/showAllAccesibleService")
    public ResponseEntity<List<Service>> getAllAccesibleService() {
        List<Service> services = serviceRepository.findByStatus("Dostępne");
        return ResponseEntity.ok(services);
    }

    @PostMapping("/addService")
    public ResponseEntity<String> addService(@RequestParam String newName, @RequestParam String newTypeService, @RequestParam Float newPrice, @RequestParam String newStatus, @RequestParam String newDescription, @RequestParam(required = false) MultipartFile serviceImage) {
        Service newService = new Service();
        newService.setName(newName);
        newService.setTypeService(newTypeService);
        newService.setPrice(newPrice);
        newService.setStatus(newStatus);
        newService.setDescription(newDescription);
        try {
            if(serviceImage != null) {
                BufferedImage checkImage = ImageIO.read(serviceImage.getInputStream());
                int imageWidth = checkImage.getWidth();
                int imageHeight = checkImage.getHeight();
                if(imageWidth != 1000 || imageHeight != 600) {
                    return ResponseEntity.badRequest().body("Zdjęcie nie ma wymaganych wymiarów! Umieść zdjęcie o wymiarach 1000x600 px!");
                }
                newService.setImage(serviceImage.getBytes());
            }
            else {
                newService.setImage(null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nie udało się przekazać/zapisać zdjęcia!");
        }
        serviceRepository.save(newService);
        return ResponseEntity.ok("Dodano usługę!");
    }

    @PutMapping("/editServiceStatus")
    public ResponseEntity<String> editServiceStatus(@RequestParam("serviceId") Long serviceId) {
        Service service = serviceRepository.findById(serviceId).orElse(null);
        if("Dostępne".equals(service.getStatus())) {
            service.setStatus("Niedostępne");
            serviceRepository.save(service);
            return ResponseEntity.ok("Status został zmieniony na niedostępny!");
        }
        else if("Niedostępne".equals(service.getStatus())) {
            service.setStatus("Dostępne");
            serviceRepository.save(service);
            return ResponseEntity.ok("Status został zmieniony na dostępny!");
        }
        return ResponseEntity.ok("Błąd!");
    }

    @PutMapping("/editService/{serviceId}")
    public ResponseEntity<String> editService(@PathVariable("serviceId") Long serviceId, @RequestParam Integer option, @RequestParam String newName, @RequestParam String newDescription, @RequestParam String newTypeService, @RequestParam Float newPrice, @RequestParam(required = false) MultipartFile newImage) {
        Service service = serviceRepository.findById(serviceId).orElse(null);
        service.setName(newName);
        service.setDescription(newDescription);
        service.setTypeService(newTypeService);
        service.setPrice(newPrice);
        if(option == 1) {
            try {
                if (newImage != null) {
                    BufferedImage checkImage = ImageIO.read(newImage.getInputStream());
                    int imageWidth = checkImage.getWidth();
                    int imageHeight = checkImage.getHeight();
                    if (imageWidth != 1000 || imageHeight != 600) {
                        return ResponseEntity.badRequest().body("Zdjęcie nie ma wymaganych wymiarów! Umieść zdjęcie o wymiarach 1000x600 px!");
                    }
                    service.setImage(newImage.getBytes());
                } else {
                    service.setImage(null);
                }
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nie udało się przekazać/zapisać zdjęcia!");
            }
        } else if(option == 2) {
            service.setImage(null);
        }
        serviceRepository.save(service);
        return ResponseEntity.ok("Edytowano usługę!");
    }

    @DeleteMapping("/deleteService")
    public ResponseEntity<String> deleteService(@RequestParam Long serviceId) {
        Service service = serviceRepository.findById(serviceId).orElseThrow(() -> new IllegalArgumentException("Nie ma takiej usługi!"));
        serviceRepository.delete(service);
        return ResponseEntity.ok("Usługa została usunięta!");
    }
}