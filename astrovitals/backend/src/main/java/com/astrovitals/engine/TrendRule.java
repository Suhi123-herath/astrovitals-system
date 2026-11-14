package com.astrovitals.engine;

import com.astrovitals.domain.*;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.stereotype.Component;

/** Sleep or mood falling three days in a row is a watch signal, even if each value is still in range. */
@Component
public class TrendRule implements EvaluationRule {
    @Override public Optional<Finding> evaluate(Indicator ind, List<CheckIn> history) {
        if ((ind != Indicator.SLEEP && ind != Indicator.MOOD) || history.size() < 3) return Optional.empty();
        List<CheckIn> t = history.subList(history.size() - 3, history.size());
        Double a = ind.valueOf(t.get(0)), b = ind.valueOf(t.get(1)), c = ind.valueOf(t.get(2));
        if (a == null || b == null || c == null || !(a > b && b > c)) return Optional.empty();
        LocalDate d1 = t.get(0).getDate(), d2 = t.get(1).getDate(), d3 = t.get(2).getDate();
        if (!d1.plusDays(1).equals(d2) || !d2.plusDays(1).equals(d3)) return Optional.empty();
        return Optional.of(new Finding(Finding.RuleType.TREND, Level.WATCH, "Trend: " + ind.getLabel().toLowerCase() + " fell 3 days in a row."));
    }
}
