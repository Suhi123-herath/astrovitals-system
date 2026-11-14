package com.astrovitals.engine;

import com.astrovitals.domain.*;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ZoneRule implements EvaluationRule {
    @Override public Optional<Finding> evaluate(Indicator ind, List<CheckIn> history) {
        Double v = ind.valueOf(history.get(history.size() - 1));
        if (v == null) return Optional.empty();
        int zone = ind.zoneOf(v);
        if (zone == 0) return Optional.empty();
        return Optional.of(new Finding(Finding.RuleType.ZONE, Level.values()[zone],
            "Zone: " + Fmt.num(v) + ind.getUnit() + " is outside the configured demonstration band " + Fmt.num(ind.getGreenLo()) + " to " + Fmt.num(ind.getGreenHi()) + "."));
    }
}
