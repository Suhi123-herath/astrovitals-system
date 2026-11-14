package com.astrovitals.domain;

public enum Level {
    NORMAL, WATCH, REPORT, URGENT;
    public static Level max(Level a, Level b) { return a.compareTo(b) >= 0 ? a : b; }
}
