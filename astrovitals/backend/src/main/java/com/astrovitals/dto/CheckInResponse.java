package com.astrovitals.dto;

import com.astrovitals.domain.CheckIn;
import java.time.LocalDate;

public record CheckInResponse(LocalDate date, Integer hr, Integer sys, Integer dia, Integer glucose, Double temp,
    Double sleep, Integer mood, Integer stress, Integer exercise, Integer meals, Integer spo2, Integer hydrationMl,
    String missionEnvironment, String missionPhase, String activityContext, String glucoseContext, String symptoms,
    Double radiationDoseUsv, Integer cabinCo2Ppm, Double cabinTemperatureC, Boolean environmentAlarm, String exposureSource) {
    public static CheckInResponse from(CheckIn c) {
        return new CheckInResponse(c.getDate(), c.getHr(), c.getSys(), c.getDia(), c.getGlucose(), c.getTemp(),
            c.getSleep(), c.getMood(), c.getStress(), c.getExercise(), c.getMeals(), c.getSpo2(), c.getHydrationMl(),
            c.getMissionEnvironment(), c.getMissionPhase(), c.getActivityContext(), c.getGlucoseContext(), c.getSymptoms(),
            c.getRadiationDoseUsv(), c.getCabinCo2Ppm(), c.getCabinTemperatureC(), c.getEnvironmentAlarm(), c.getExposureSource());
    }
}
