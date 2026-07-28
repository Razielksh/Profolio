package com.profolio.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedCvKey implements Serializable {

    @Column(name = "recruiter_id")
    private Long recruiterId;

    @Column(name = "cv_id")
    private Long cvId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SavedCvKey that = (SavedCvKey) o;
        return Objects.equals(recruiterId, that.recruiterId) && Objects.equals(cvId, that.cvId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(recruiterId, cvId);
    }
}
