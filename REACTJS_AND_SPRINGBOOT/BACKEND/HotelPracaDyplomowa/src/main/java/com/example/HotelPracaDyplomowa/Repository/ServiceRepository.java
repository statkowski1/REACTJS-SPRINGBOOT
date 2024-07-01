package com.example.HotelPracaDyplomowa.Repository;

import com.example.HotelPracaDyplomowa.Model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByStatus(String status);
}

