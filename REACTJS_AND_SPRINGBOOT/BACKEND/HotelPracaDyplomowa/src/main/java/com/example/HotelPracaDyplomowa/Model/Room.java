package com.example.HotelPracaDyplomowa.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numberOfRoom;
    private String typeRoom;
    private Float price;
    private String status;
    @Lob
    private byte[] image;
}