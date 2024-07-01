package com.example.HotelPracaDyplomowa.Repository;

import com.example.HotelPracaDyplomowa.Model.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
    List<ServiceOrder> findAllByShoppingCartId(Long shoppingCartId);
}
