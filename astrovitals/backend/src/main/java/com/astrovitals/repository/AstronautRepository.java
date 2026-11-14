package com.astrovitals.repository;

import com.astrovitals.domain.Astronaut;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AstronautRepository extends JpaRepository<Astronaut, Long> {}
