package com.astrovitals.engine;

import com.astrovitals.domain.*;
import java.util.*;
import org.springframework.stereotype.Component;

/** Runs every EvaluationRule on every indicator and combines the findings (Strategy + Composite). */
@Component
public class StatusEngine {
    public record Reading(double value, int zone, Double zScore, Level level) {}
    public record Alert(Indicator indicator, Level level, List<String> reasons) {}
    public record Evaluation(Level overall, Map<Indicator, Reading> readings, List<Alert> alerts) {}

    private final List<EvaluationRule> rules;
    public StatusEngine(List<EvaluationRule> rules) { this.rules = rules; }

    public Evaluation evaluate(List<CheckIn> history) {
        Map<Indicator, Reading> readings = new LinkedHashMap<>();
        List<Alert> alerts = new ArrayList<>();
        if (history.isEmpty()) return new Evaluation(Level.NORMAL, readings, alerts);
        CheckIn last = history.get(history.size() - 1);
        for (Indicator ind : Indicator.values()) {
            Double v = ind.valueOf(last);
            if (v == null) continue;
            List<Finding> found = rules.stream().map(r -> r.evaluate(ind, history)).flatMap(Optional::stream).toList();
            Level level = found.stream().map(Finding::level).reduce(Level.NORMAL, Level::max);
            boolean zoneRed = found.stream().anyMatch(f -> f.type() == Finding.RuleType.ZONE && f.level() == Level.REPORT);
            boolean farFromBaseline = found.stream().anyMatch(f -> f.type() == Finding.RuleType.BASELINE && f.level() == Level.REPORT);
            if (zoneRed && farFromBaseline) level = Level.URGENT; // out of range AND far from your own normal
            Double z = history.size() > 7 ? Baseline.learn(ind, history).map(b -> b.z(v)).orElse(null) : null;
            readings.put(ind, new Reading(v, ind.zoneOf(v), z, level));
            if (level != Level.NORMAL) alerts.add(new Alert(ind, level, found.stream().map(Finding::reason).toList()));
        }
        alerts.sort(Comparator.comparing(Alert::level).reversed());
        Level overall = alerts.stream().map(Alert::level).reduce(Level.NORMAL, Level::max);
        return new Evaluation(overall, readings, alerts);
    }
}
