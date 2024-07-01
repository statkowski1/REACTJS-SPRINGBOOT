package com.example.HotelPracaDyplomowa.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String typeUser;
    private String statusUser;
    private String firstName;
    private String lastName;
    private String address;
    private String phone;
    private String email;
    private String password;
    @Lob
    private byte[] image;
}

