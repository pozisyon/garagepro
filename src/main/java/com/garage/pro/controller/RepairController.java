package com.garage.pro.controller;


import com.garage.pro.model.Repair;
import com.garage.pro.model.RepairStatus;
import com.garage.pro.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/repairs")
@CrossOrigin(origins = "http://localhost:4200")
public class RepairController {

    private final RepairRepository repairRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final AppointmentRepository appointmentRepository;

    public RepairController(
            RepairRepository repairRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.repairRepository = repairRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public List<Repair> getAll() {
        return repairRepository.findAll();
    }

    @GetMapping("/{id}")
    public Repair getById(@PathVariable Long id) {
        return repairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réparation introuvable"));
    }

    @GetMapping("/client/{clientId}")
    public List<Repair> getByClient(@PathVariable Long clientId) {
        return repairRepository.findByClientId(clientId);
    }

    @GetMapping("/mechanic/{mechanicId}")
    public List<Repair> getByMechanic(@PathVariable Long mechanicId) {
        return repairRepository.findByMechanicId(mechanicId);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<Repair> getByVehicle(@PathVariable Long vehicleId) {
        return repairRepository.findByVehicleId(vehicleId);
    }

    @PostMapping("/appointment/{appointmentId}/mechanic/{mechanicId}")
    public Repair createFromAppointment(
            @PathVariable Long appointmentId,
            @PathVariable Long mechanicId,
            @RequestBody Repair repair
    ) {
        var appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));

        var mechanic = userRepository.findById(mechanicId)
                .orElseThrow(() -> new RuntimeException("Mécanicien introuvable"));

        repair.setAppointment(appointment);
        repair.setClient(appointment.getClient());
        repair.setVehicle(appointment.getVehicle());
        repair.setMechanic(mechanic);
        repair.setStatus(RepairStatus.RECEIVED);
        repair.setStartedAt(LocalDateTime.now());

        return repairRepository.save(repair);
    }

    @PutMapping("/{id}")
    public Repair update(
            @PathVariable Long id,
            @RequestBody Repair data
    ) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réparation introuvable"));

        repair.setDiagnosis(data.getDiagnosis());
        repair.setWorkDescription(data.getWorkDescription());
        repair.setPartsUsed(data.getPartsUsed());
        repair.setLaborCost(data.getLaborCost());
        repair.setPartsCost(data.getPartsCost());
        repair.setStatus(data.getStatus());

        if (data.getStatus() == RepairStatus.READY || data.getStatus() == RepairStatus.DELIVERED) {
            repair.setCompletedAt(LocalDateTime.now());
        }

        return repairRepository.save(repair);
    }

    @PatchMapping("/{id}/status")
    public Repair updateStatus(
            @PathVariable Long id,
            @RequestParam RepairStatus status
    ) {
        Repair repair = repairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réparation introuvable"));

        repair.setStatus(status);

        if (status == RepairStatus.READY || status == RepairStatus.DELIVERED) {
            repair.setCompletedAt(LocalDateTime.now());
        }

        return repairRepository.save(repair);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repairRepository.deleteById(id);
    }
}