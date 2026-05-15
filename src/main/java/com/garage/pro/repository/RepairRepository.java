package com.garage.pro.repository;

import com.garage.pro.model.Repair;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepairRepository extends JpaRepository<Repair, Long> {
    List<Repair> findByClientId(Long clientId);
    List<Repair> findByMechanicId(Long mechanicId);
    List<Repair> findByVehicleId(Long vehicleId);
}
