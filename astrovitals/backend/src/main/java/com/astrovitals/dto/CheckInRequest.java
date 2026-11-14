package com.astrovitals.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CheckInRequest(
    @NotNull @PastOrPresent LocalDate date,
    @NotNull @Min(40) @Max(200) Integer hr,
    @NotNull @Min(60) @Max(220) Integer sys,
    @NotNull @Min(40) @Max(140) Integer dia,
    @NotNull @Min(30) @Max(500) Integer glucose,
    @NotNull @DecimalMin("33.0") @DecimalMax("42.0") Double temp,
    @NotNull @DecimalMin("0.0") @DecimalMax("16.0") Double sleep,
    @NotNull @Min(1) @Max(5) Integer mood,
    @Min(1) @Max(5) Integer stress,
    @NotNull @Min(0) @Max(300) Integer exercise,
    @NotNull @Min(0) @Max(8) Integer meals,
    @Min(50) @Max(100) Integer spo2,
    @Min(0) @Max(10000) Integer hydrationMl,
    @Pattern(regexp="station|transit|moon|mars") String missionEnvironment,
    @Pattern(regexp="preflight|launch|in_mission|landing|postflight") String missionPhase,
    @Pattern(regexp="resting|exercise|recovery|unknown") String activityContext,
    @Pattern(regexp="fasting|post_meal|unknown") String glucoseContext,
    @Size(max=1000) String symptoms,
    @DecimalMin("0.0") @DecimalMax("100000.0") Double radiationDoseUsv,
    @Min(0) @Max(100000) Integer cabinCo2Ppm,
    @DecimalMin("-50.0") @DecimalMax("100.0") Double cabinTemperatureC,
    Boolean environmentAlarm,
    @Pattern(regexp="MANUAL|SENSOR|SIMULATED") String exposureSource
) {
    @AssertTrue(message = "Systolic blood pressure must be greater than diastolic blood pressure")
    public boolean isBloodPressurePairValid() { return sys == null || dia == null || sys > dia; }
}
