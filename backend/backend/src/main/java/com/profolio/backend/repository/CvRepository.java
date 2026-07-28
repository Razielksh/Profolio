package com.profolio.backend.repository;

import com.profolio.backend.entity.Cv;
import com.profolio.backend.entity.EPrivacidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CvRepository extends JpaRepository<Cv, Long> {
    List<Cv> findByUserId(Long userId);
    Optional<Cv> findByIdAndUserId(Long id, Long userId);
    List<Cv> findByPrivacidad(EPrivacidad privacidad);
}
