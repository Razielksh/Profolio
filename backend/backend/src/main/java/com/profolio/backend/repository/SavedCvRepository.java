package com.profolio.backend.repository;

import com.profolio.backend.entity.SavedCv;
import com.profolio.backend.entity.SavedCvKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedCvRepository extends JpaRepository<SavedCv, SavedCvKey> {
    List<SavedCv> findByRecruiterId(Long recruiterId);
    boolean existsByIdRecruiterIdAndIdCvId(Long recruiterId, Long cvId);
    void deleteByIdRecruiterIdAndIdCvId(Long recruiterId, Long cvId);
}
