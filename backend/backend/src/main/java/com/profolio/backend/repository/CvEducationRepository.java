package com.profolio.backend.repository;

import com.profolio.backend.entity.CvEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CvEducationRepository extends JpaRepository<CvEducation, Long> {
    List<CvEducation> findByCvIdOrderByOrdenAsc(Long cvId);
}
