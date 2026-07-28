package com.profolio.backend.repository;

import com.profolio.backend.entity.CvExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CvExperienceRepository extends JpaRepository<CvExperience, Long> {
    List<CvExperience> findByCvIdOrderByOrdenAsc(Long cvId);
}
