package com.garage.pro.repository;


import com.garage.pro.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientId(Long clientId);
    Optional<Invoice> findByRepairId(Long repairId);
}
