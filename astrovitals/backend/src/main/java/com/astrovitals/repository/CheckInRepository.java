package com.astrovitals.repository;

import com.astrovitals.domain.CheckIn;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByAstronautIdOrderByDateAsc(Long astronautId);
    List<CheckIn> findByAstronautIdAndDateBetweenOrderByDateAsc(Long astronautId, LocalDate from, LocalDate to);
    Optional<CheckIn> findByAstronautIdAndDate(Long astronautId, LocalDate date);
    long deleteByAstronautId(Long astronautId);
}
