package com.garage.pro.controller;

import com.garage.pro.model.User;
import com.garage.pro.model.Vehicle;
import com.garage.pro.repository.UserRepository;
import com.garage.pro.repository.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:4200")
public class VehicleController {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleController(
            VehicleRepository vehicleRepository,
            UserRepository userRepository
    ) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    @GetMapping("/{id}")
    public Vehicle getById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
    }

    @GetMapping("/owner/{ownerId}")
    public List<Vehicle> getByOwner(@PathVariable Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

   /* @PostMapping("/owner/{ownerId}")
    public Vehicle create(
            @PathVariable Long ownerId,
            @RequestBody Vehicle vehicle
    ) {
        var owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        vehicle.setOwner(owner);
        return vehicleRepository.save(vehicle);
    }*/
    @PostMapping("/owner/{ownerId}")
    public ResponseEntity<Vehicle> create(
            @PathVariable Long ownerId,
            @RequestBody Vehicle vehicle
    ) {
        vehicle.setId(null); // important

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        vehicle.setOwner(owner);

        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @PutMapping("/{id}")
    public Vehicle update(
            @PathVariable Long id,
            @RequestBody Vehicle data
    ) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));

        vehicle.setBrand(data.getBrand());
        vehicle.setModel(data.getModel());
        vehicle.setYear(data.getYear());
        vehicle.setPlateNumber(data.getPlateNumber());
        vehicle.setMileage(data.getMileage());

        return vehicleRepository.save(vehicle);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        vehicleRepository.deleteById(id);
    }
}
