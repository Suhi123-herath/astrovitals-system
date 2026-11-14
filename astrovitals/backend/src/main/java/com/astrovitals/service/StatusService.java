package com.astrovitals.service;

import com.astrovitals.domain.Environment;
import com.astrovitals.domain.Level;
import com.astrovitals.domain.CheckIn;
import com.astrovitals.dto.StatusResponse;
import com.astrovitals.dto.StatusResponse.*;
import com.astrovitals.engine.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StatusService {
    private static final Set<String> EMERGENCY_SYMPTOMS = Set.of("chest pain", "fainting", "severe shortness of breath", "confusion", "thoughts of self-harm");
    private final CheckInService checkIns; private final StatusEngine engine; private final List<EscalationPolicy> policies;
    public StatusService(CheckInService checkIns, StatusEngine engine, List<EscalationPolicy> policies) { this.checkIns = checkIns; this.engine = engine; this.policies = policies; }

    public StatusResponse status(Long astronautId, String envId) {
        Environment env = Environment.fromId(envId);
        EscalationPolicy policy = policies.stream().filter(p -> p.supports(env)).findFirst().orElseThrow();
        List<CheckIn> history = checkIns.history(astronautId);
        StatusEngine.Evaluation ev = engine.evaluate(history);
        Map<String, IndicatorDto> indicators = new LinkedHashMap<>();
        ev.readings().forEach((k, r) -> indicators.put(k.getKey(), new IndicatorDto(r.value(), r.zone(), r.zScore(), r.level().ordinal())));
        List<AlertDto> alerts = new ArrayList<>(ev.alerts().stream().map(a -> new AlertDto(a.indicator().getKey(), a.indicator().getLabel(), a.level().ordinal(),
            a.reasons(), a.indicator().getHazard().getLabel(), policy.message(a.level()))).toList());
        if (history.isEmpty()) return new StatusResponse(false, 0, "No health data has been recorded yet. Complete a check-in to begin assessment.", indicators, alerts,
            new MissionContextDto(env.name().toLowerCase(), null, null, null, List.of(), null, null, null, false, null, List.of("No mission measurements recorded yet.")));

        CheckIn latest = history.get(history.size() - 1);
        List<String> symptoms = split(latest.getSymptoms());
        List<String> notes = new ArrayList<>();
        if (latest.getMissionEnvironment() != null) notes.add("Check-in recorded for " + latest.getMissionEnvironment() + " mission environment.");
        if (latest.getActivityContext() != null) notes.add("Measurement activity context: " + latest.getActivityContext() + ".");
        if (latest.getGlucoseContext() != null) notes.add("Glucose context: " + latest.getGlucoseContext() + ". Interpret glucose only with meal timing and mission medical guidance.");
        if (latest.getRadiationDoseUsv() != null) notes.add("Radiation exposure was recorded as " + latest.getRadiationDoseUsv() + " µSv. This is an exposure observation, not a health vital sign; compare only with the mission's approved dosimetry limits.");
        if (latest.getCabinCo2Ppm() != null) notes.add("Cabin CO₂ was recorded as " + latest.getCabinCo2Ppm() + " ppm. No universal alert threshold is applied by this prototype.");
        if (latest.getCabinTemperatureC() != null) notes.add("Cabin temperature was recorded as " + latest.getCabinTemperatureC() + " °C. Use spacecraft environmental-control limits for interpretation.");
        if (Boolean.TRUE.equals(latest.getEnvironmentAlarm())) {
            alerts.add(new AlertDto("environment", "Reported environmental alarm", Level.REPORT.ordinal(),
                List.of("A crew member or connected source reported an environmental alarm. The app does not independently validate the sensor."),
                "Hostile/closed environment", policy.message(Level.REPORT)));
        }
        List<String> urgent = symptoms.stream().filter(x -> EMERGENCY_SYMPTOMS.contains(x.toLowerCase(Locale.ROOT))).toList();
        if (!urgent.isEmpty()) alerts.add(new AlertDto("symptoms", "Reported emergency symptoms", Level.URGENT.ordinal(),
            List.of("Reported: " + String.join(", ", urgent), "This is a safety escalation prompt, not a diagnosis. Follow the onboard emergency medical protocol immediately."),
            "Crew health / medical support", policy.message(Level.URGENT)));
        alerts.sort(Comparator.comparingInt(AlertDto::level).reversed());
        int overall = alerts.stream().mapToInt(AlertDto::level).max().orElse(0);
        MissionContextDto context = new MissionContextDto(env.name().toLowerCase(), latest.getMissionPhase(), latest.getActivityContext(), latest.getGlucoseContext(),
            symptoms, latest.getRadiationDoseUsv(), latest.getCabinCo2Ppm(), latest.getCabinTemperatureC(), Boolean.TRUE.equals(latest.getEnvironmentAlarm()), latest.getExposureSource(), notes);
        return new StatusResponse(true, overall, policy.message(Level.values()[overall]), indicators, alerts, context);
    }
    private static List<String> split(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split("\\|" )).map(String::trim).filter(x -> !x.isBlank()).toList();
    }
}
