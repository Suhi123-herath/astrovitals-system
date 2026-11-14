package com.astrovitals.engine;

import com.astrovitals.domain.Level;

public record Finding(RuleType type, Level level, String reason) {
    public enum RuleType { ZONE, BASELINE, TREND }
}
