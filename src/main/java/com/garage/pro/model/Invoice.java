package com.garage.pro.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;

    private LocalDateTime issuedAt;

    private Double subtotal;
    private Double taxAmount;
    private Double total;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @ManyToOne
    private User client;

    @OneToOne
    private Repair repair;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItem> items = new ArrayList<>();
}