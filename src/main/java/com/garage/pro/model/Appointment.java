package com.garage.pro.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime appointmentDate;

    private String serviceType;

    private String description;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @ManyToOne
    private User client;

    @ManyToOne
    private Vehicle vehicle;

    @OneToOne
    private Appointment appointment;
}