package com.garage.pro.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repair{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String diagnosis;

    @Column(length = 2000)
    private String workDescription;

    private String partsUsed;

    private Double laborCost;
    private Double partsCost;

    @Enumerated(EnumType.STRING)
    private RepairStatus status;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private User client;

    @ManyToOne
    private User mechanic;

    @OneToOne
    private Appointment appointment;
}
