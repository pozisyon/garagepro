package com.garage.pro.controller;

import com.garage.pro.model.*;
import com.garage.pro.repository.NotificationRepository;
import com.garage.pro.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "https://garagepro-n4fr.onrender.com")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public NotificationController(
            NotificationRepository notificationRepository,
            NotificationService notificationService
    ) {
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getByUser(@PathVariable Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnread(@PathVariable Long userId) {
        return notificationRepository.findByRecipientIdAndReadStatusFalse(userId);
    }

    @PostMapping("/user/{userId}")
    public Notification create(
            @PathVariable Long userId,
            @RequestBody Notification notification
    ) {
        return notificationService.send(
                userId,
                notification.getTitle(),
                notification.getMessage(),
                notification.getType()
        );
    }

    @PatchMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        notification.setReadStatus(true);

        return notificationRepository.save(notification);
    }

    @PatchMapping("/user/{userId}/read-all")
    public void markAllAsRead(@PathVariable Long userId) {
        List<Notification> notifications =
                notificationRepository.findByRecipientIdAndReadStatusFalse(userId);

        notifications.forEach(n -> n.setReadStatus(true));

        notificationRepository.saveAll(notifications);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        notificationRepository.deleteById(id);
    }
}