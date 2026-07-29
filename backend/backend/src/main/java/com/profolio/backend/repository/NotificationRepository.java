package com.profolio.backend.repository;

import com.profolio.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByFechaDesc(Long userId);
    List<Notification> findByUserIdAndLeidoFalse(Long userId);
}
