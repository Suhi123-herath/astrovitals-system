package com.astrovitals.domain;

/** The five NASA Human Research Program hazards of human spaceflight. */
public enum Hazard {
    RADIATION("Space radiation"), ISOLATION("Isolation and confinement"), DISTANCE("Distance from Earth"),
    GRAVITY("Altered gravity"), CLOSED("Hostile, closed environment");
    private final String label;
    Hazard(String label) { this.label = label; }
    public String getLabel() { return label; }
}
