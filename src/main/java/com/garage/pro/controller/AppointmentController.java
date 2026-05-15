package com.garage.pro.controller;

import com.garage.pro.model.Appointment;
import com.garage.pro.model.AppointmentStatus;
import com.garage.pro.repository.AppointmentRepository;
import com.garage.pro.repository.UserRepository;
import com.garage.pro.repository.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));
    }

    @GetMapping("/client/{clientId}")
    public List<Appointment> getByClient(@PathVariable Long clientId) {
        return appointmentRepository.findByClientId(clientId);
    }

    @PostMapping("/client/{clientId}/vehicle/{vehicleId}")
    public Appointment create(
            @PathVariable Long clientId,
            @PathVariable Long vehicleId,
            @RequestBody Appointment appointment
    ) {
        var client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        var vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));

        appointment.setClient(client);
        appointment.setVehicle(vehicle);
        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    @PutMapping("/{id}")
    public Appointment update(
            @PathVariable Long id,
            @RequestBody Appointment data
    ) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));

        appointment.setAppointmentDate(data.getAppointmentDate());
        appointment.setServiceType(data.getServiceType());
        appointment.setDescription(data.getDescription());
        appointment.setStatus(data.getStatus());

        return appointmentRepository.save(appointment);
    }

    @PatchMapping("/{id}/status")
    public Appointment updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status
    ) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable"));

        appointment.setStatus(status);

        return appointmentRepository.save(appointment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
    }
}
