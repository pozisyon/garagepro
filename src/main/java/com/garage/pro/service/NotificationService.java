package com.garage.pro.service;

import com.garage.pro.model.*;
import com.garage.pro.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification send(
            Long recipientId,
            String title,
            String message,
            NotificationType type
    ) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Destinataire introuvable"));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type)
                .readStatus(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }
}
