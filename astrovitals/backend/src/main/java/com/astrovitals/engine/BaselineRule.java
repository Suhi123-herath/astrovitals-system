package com.astrovitals.engine;

import com.astrovitals.domain.*;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

/** Compares today with the astronaut's own first-week baseline. Needs more than 7 check-ins. */
@Component
public class BaselineRule implements EvaluationRule {
    @Override public Optional<Finding> evaluate(Indicator ind, List<CheckIn> history) {
        Double v = ind.valueOf(history.get(history.size() - 1));
        if (v == null || history.size() <= 7) return Optional.empty();
        return Baseline.learn(ind, history).flatMap(b -> {
            double z = Math.abs(b.z(v));
            if (z < 2) return Optional.<Finding>empty();
            return Optional.of(new Finding(Finding.RuleType.BASELINE, z >= 3 ? Level.REPORT : Level.WATCH,
                "Baseline: " + Fmt.one(z) + " standard deviations from your first-week average (" + Fmt.one(b.mean()) + ")."));
        });
    }
}
