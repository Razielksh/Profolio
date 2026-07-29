package com.profolio.backend.repository;

import com.profolio.backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByRecruiterId(Long recruiterId);
    List<ContactMessage> findByCvId(Long cvId);
}
