package com.astrovitals.domain;

import java.util.Arrays;

/** Where the crew is. 'delayed' means communication with ground has a significant delay. */
public enum Environment {
    STATION("station", false), TRANSIT("transit", true), MOON("moon", false), MARS("mars", true);
    private final String id; private final boolean delayed;
    Environment(String id, boolean delayed) { this.id = id; this.delayed = delayed; }
    public boolean isDelayed() { return delayed; }
    public static Environment fromId(String id) {
        return Arrays.stream(values()).filter(e -> e.id.equalsIgnoreCase(id)).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown environment: " + id));
    }
}
