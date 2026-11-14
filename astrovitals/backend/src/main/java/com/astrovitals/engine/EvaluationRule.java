package com.astrovitals.engine;

import com.astrovitals.domain.CheckIn;
import com.astrovitals.domain.Indicator;
import java.util.List;
import java.util.Optional;

/** Strategy: one way of judging an indicator. Add a new rule by adding a @Component; the engine picks it up. */
public interface EvaluationRule {
    /** @param history check-ins in ascending date order, never empty. */
    Optional<Finding> evaluate(Indicator indicator, List<CheckIn> history);
}
