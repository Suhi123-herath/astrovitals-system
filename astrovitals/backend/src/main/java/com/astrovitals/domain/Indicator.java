package com.astrovitals.domain;

import java.util.function.Function;

/** Health indicators with demo reference ranges (green = normal, yellow = watch, otherwise red). Not medical advice. */
public enum Indicator {
    HR("hr", "Heart rate", "bpm", 60, 100, 50, 110, Hazard.GRAVITY, c -> d(c.getHr())),
    SYS("sys", "Systolic BP", "mmHg", 90, 120, 85, 139, Hazard.GRAVITY, c -> d(c.getSys())),
    DIA("dia", "Diastolic BP", "mmHg", 60, 80, 55, 89, Hazard.GRAVITY, c -> d(c.getDia())),
    GLUCOSE("glucose", "Blood glucose", "mg/dL", 70, 99, 60, 125, Hazard.CLOSED, c -> d(c.getGlucose())),
    TEMP("temp", "Temperature", "°C", 36, 37.5, 35.5, 38, Hazard.CLOSED, c -> c.getTemp()),
    SLEEP("sleep", "Sleep", "h", 7, 9.5, 5.5, 10.5, Hazard.ISOLATION, c -> c.getSleep()),
    MOOD("mood", "Mood", "/5", 3, 5, 2, 5, Hazard.ISOLATION, c -> d(c.getMood())),
    EXERCISE("exercise", "Exercise", "min", 30, 300, 15, 300, Hazard.GRAVITY, c -> d(c.getExercise())),
    MEALS("meals", "Meals", "", 3, 6, 2, 6, Hazard.CLOSED, c -> d(c.getMeals()));

    private final String key, label, unit; private final double gLo, gHi, yLo, yHi;
    private final Hazard hazard; private final Function<CheckIn, Double> getter;

    Indicator(String key, String label, String unit, double gLo, double gHi, double yLo, double yHi, Hazard hazard, Function<CheckIn, Double> getter) {
        this.key = key; this.label = label; this.unit = unit; this.gLo = gLo; this.gHi = gHi; this.yLo = yLo; this.yHi = yHi; this.hazard = hazard; this.getter = getter;
    }
    private static Double d(Number n) { return n == null ? null : n.doubleValue(); }

    public Double valueOf(CheckIn c) { return getter.apply(c); }
    /** 0 = normal range, 1 = watch range, 2 = outside both. */
    public int zoneOf(double v) { return v >= gLo && v <= gHi ? 0 : v >= yLo && v <= yHi ? 1 : 2; }
    public String getKey() { return key; } public String getLabel() { return label; } public String getUnit() { return unit; }
    public double getGreenLo() { return gLo; } public double getGreenHi() { return gHi; } public Hazard getHazard() { return hazard; }
}
