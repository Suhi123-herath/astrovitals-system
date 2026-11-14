package com.astrovitals.dto;

import java.util.List;
import java.util.Map;

/** Levels are ints: 0 Normal, 1 Watch, 2 Report, 3 Urgent. */
public record StatusResponse(boolean hasData, int overall, String guidance, Map<String, IndicatorDto> indicators,
    List<AlertDto> alerts, MissionContextDto missionContext) {
    public record IndicatorDto(double value, int zone, Double zScore, int level) {}
    public record AlertDto(String indicator, String label, int level, List<String> reasons, String hazard, String escalation) {}
    public record MissionContextDto(String environment, String phase, String activityContext, String glucoseContext,
        List<String> symptoms, Double radiationDoseUsv, Integer cabinCo2Ppm, Double cabinTemperatureC,
        boolean environmentAlarm, String exposureSource, List<String> notes) {}
}
