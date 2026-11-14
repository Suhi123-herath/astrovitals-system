package com.astrovitals.service;

import com.astrovitals.domain.*;
import com.astrovitals.dto.*;
import com.astrovitals.repository.*;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CheckInService {
    private final AstronautRepository astronauts; private final CheckInRepository checkIns;
    public CheckInService(AstronautRepository astronauts, CheckInRepository checkIns) { this.astronauts = astronauts; this.checkIns = checkIns; }

    private Astronaut astronaut(Long id) { return astronauts.findById(id).orElseThrow(() -> new NotFoundException("Astronaut " + id + " not found")); }

    /** Creates today's check-in or replaces the one already saved for that date. */
    public CheckInResponse save(Long id, CheckInRequest r) {
        Astronaut a = astronaut(id);
        CheckIn c = checkIns.findByAstronautIdAndDate(id, r.date()).orElseGet(CheckIn::new);
        c.setAstronaut(a); c.setDate(r.date()); c.setHr(r.hr()); c.setSys(r.sys()); c.setDia(r.dia()); c.setGlucose(r.glucose());
        c.setTemp(r.temp()); c.setSleep(r.sleep()); c.setMood(r.mood()); c.setStress(r.stress()); c.setExercise(r.exercise()); c.setMeals(r.meals());
        c.setSpo2(r.spo2()); c.setHydrationMl(r.hydrationMl()); c.setMissionEnvironment(r.missionEnvironment());
        c.setMissionPhase(r.missionPhase()); c.setActivityContext(r.activityContext()); c.setGlucoseContext(r.glucoseContext());
        c.setSymptoms(r.symptoms()); c.setRadiationDoseUsv(r.radiationDoseUsv()); c.setCabinCo2Ppm(r.cabinCo2Ppm());
        c.setCabinTemperatureC(r.cabinTemperatureC()); c.setEnvironmentAlarm(r.environmentAlarm()); c.setExposureSource(r.exposureSource());
        return CheckInResponse.from(checkIns.save(c));
    }

    @Transactional(readOnly = true)
    public List<CheckIn> history(Long id) { astronaut(id); return checkIns.findByAstronautIdOrderByDateAsc(id); }

    @Transactional(readOnly = true)
    public List<CheckInResponse> list(Long id, LocalDate from, LocalDate to) {
        astronaut(id);
        List<CheckIn> rows = (from == null && to == null) ? checkIns.findByAstronautIdOrderByDateAsc(id)
            : checkIns.findByAstronautIdAndDateBetweenOrderByDateAsc(id, from == null ? LocalDate.of(1970, 1, 1) : from, to == null ? LocalDate.of(2999, 12, 31) : to);
        return rows.stream().map(CheckInResponse::from).toList();
    }

    public void clear(Long id) { astronaut(id); checkIns.deleteByAstronautId(id); }
}
