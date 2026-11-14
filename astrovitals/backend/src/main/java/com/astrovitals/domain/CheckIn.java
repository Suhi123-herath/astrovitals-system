package com.astrovitals.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

/** One daily self-assessment. At most one per astronaut per day (re-saving replaces it). */
@Entity
@Table(name = "check_in", uniqueConstraints = @UniqueConstraint(columnNames = {"astronaut_id", "check_date"}))
public class CheckIn {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "astronaut_id") private Astronaut astronaut;
    @Column(name = "check_date", nullable = false) private LocalDate date;
    @Column(name = "heart_rate") private Integer hr;
    @Column(name = "systolic") private Integer sys;
    @Column(name = "diastolic") private Integer dia;
    @Column(name = "glucose") private Integer glucose;
    @Column(name = "temperature") private Double temp;
    @Column(name = "sleep_hours") private Double sleep;
    @Column(name = "mood") private Integer mood;
    @Column(name = "stress_level") private Integer stress;
    @Column(name = "exercise_min") private Integer exercise;
    @Column(name = "meals") private Integer meals;
    @Column(name = "spo2") private Integer spo2;
    @Column(name = "hydration_ml") private Integer hydrationMl;
    @Column(name = "mission_environment", length = 24) private String missionEnvironment;
    @Column(name = "mission_phase", length = 24) private String missionPhase;
    @Column(name = "activity_context", length = 24) private String activityContext;
    @Column(name = "glucose_context", length = 24) private String glucoseContext;
    @Column(name = "symptoms", length = 1000) private String symptoms;
    @Column(name = "radiation_dose_usv") private Double radiationDoseUsv;
    @Column(name = "cabin_co2_ppm") private Integer cabinCo2Ppm;
    @Column(name = "cabin_temperature_c") private Double cabinTemperatureC;
    @Column(name = "environment_alarm") private Boolean environmentAlarm;
    @Column(name = "exposure_source", length = 24) private String exposureSource;

    public Long getId() { return id; }
    public Astronaut getAstronaut() { return astronaut; } public void setAstronaut(Astronaut a) { this.astronaut = a; }
    public LocalDate getDate() { return date; } public void setDate(LocalDate d) { this.date = d; }
    public Integer getHr() { return hr; } public void setHr(Integer v) { this.hr = v; }
    public Integer getSys() { return sys; } public void setSys(Integer v) { this.sys = v; }
    public Integer getDia() { return dia; } public void setDia(Integer v) { this.dia = v; }
    public Integer getGlucose() { return glucose; } public void setGlucose(Integer v) { this.glucose = v; }
    public Double getTemp() { return temp; } public void setTemp(Double v) { this.temp = v; }
    public Double getSleep() { return sleep; } public void setSleep(Double v) { this.sleep = v; }
    public Integer getMood() { return mood; } public void setMood(Integer v) { this.mood = v; }
    public Integer getStress() { return stress; } public void setStress(Integer v) { this.stress = v; }
    public Integer getExercise() { return exercise; } public void setExercise(Integer v) { this.exercise = v; }
    public Integer getMeals() { return meals; } public void setMeals(Integer v) { this.meals = v; }
    public Integer getSpo2() { return spo2; } public void setSpo2(Integer v) { this.spo2 = v; }
    public Integer getHydrationMl() { return hydrationMl; } public void setHydrationMl(Integer v) { this.hydrationMl = v; }
    public String getMissionEnvironment() { return missionEnvironment; } public void setMissionEnvironment(String v) { this.missionEnvironment = v; }
    public String getMissionPhase() { return missionPhase; } public void setMissionPhase(String v) { this.missionPhase = v; }
    public String getActivityContext() { return activityContext; } public void setActivityContext(String v) { this.activityContext = v; }
    public String getGlucoseContext() { return glucoseContext; } public void setGlucoseContext(String v) { this.glucoseContext = v; }
    public String getSymptoms() { return symptoms; } public void setSymptoms(String v) { this.symptoms = v; }
    public Double getRadiationDoseUsv() { return radiationDoseUsv; } public void setRadiationDoseUsv(Double v) { this.radiationDoseUsv = v; }
    public Integer getCabinCo2Ppm() { return cabinCo2Ppm; } public void setCabinCo2Ppm(Integer v) { this.cabinCo2Ppm = v; }
    public Double getCabinTemperatureC() { return cabinTemperatureC; } public void setCabinTemperatureC(Double v) { this.cabinTemperatureC = v; }
    public Boolean getEnvironmentAlarm() { return environmentAlarm; } public void setEnvironmentAlarm(Boolean v) { this.environmentAlarm = v; }
    public String getExposureSource() { return exposureSource; } public void setExposureSource(String v) { this.exposureSource = v; }
}
