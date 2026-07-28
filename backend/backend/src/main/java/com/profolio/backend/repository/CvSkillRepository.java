package com.profolio.backend.repository;

import com.profolio.backend.entity.CvSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CvSkillRepository extends JpaRepository<CvSkill, Long> {
    List<CvSkill> findByCvIdOrderByOrdenAsc(Long cvId);
}
