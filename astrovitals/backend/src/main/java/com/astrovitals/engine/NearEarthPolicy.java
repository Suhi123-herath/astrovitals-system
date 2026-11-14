package com.astrovitals.engine;

import com.astrovitals.domain.Environment;
import com.astrovitals.domain.Level;
import org.springframework.stereotype.Component;

@Component
public class NearEarthPolicy implements EscalationPolicy {
    @Override public boolean supports(Environment env) { return !env.isDelayed(); }
    @Override public String message(Level level) {
        return switch (level) {
            case NORMAL -> "No configured assessment rules were triggered. This does not guarantee medical wellness; continue scheduled monitoring.";
            case WATCH -> "Repeat the measurement as directed by the onboard protocol. Record symptoms and review persistent changes with crew medical support.";
            case REPORT -> "Notify the flight surgeon according to the mission medical protocol; do not wait if symptoms worsen.";
            case URGENT -> "Urgent: alert the crew and initiate the onboard emergency medical protocol. Contact ground in parallel.";
        };
    }
}
