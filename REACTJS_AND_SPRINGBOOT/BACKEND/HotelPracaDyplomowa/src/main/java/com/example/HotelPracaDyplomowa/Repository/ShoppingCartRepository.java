package com.example.HotelPracaDyplomowa.Repository;

import com.example.HotelPracaDyplomowa.Model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findAllByUserId(Long userId);
    @Query("SELECT t FROM ShoppingCart t WHERE SUBSTRING(t.dateOfOrder, 1, 4) = :year")
    List<ShoppingCart> findAllByYear(@Param("year") String year);
}
