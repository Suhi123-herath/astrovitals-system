package com.astrovitals.engine;

import com.astrovitals.domain.CheckIn;
import com.astrovitals.domain.Indicator;
import java.util.List;
import java.util.Optional;

/** A person's own "normal": mean and standard deviation of their first 7 days (needs at least 5 values). */
public record Baseline(double mean, double sd) {
    public static Optional<Baseline> learn(Indicator ind, List<CheckIn> history) {
        List<Double> v = history.stream().limit(7).map(ind::valueOf).filter(x -> x != null).toList();
        if (v.size() < 5) return Optional.empty();
        double m = v.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double var = v.stream().mapToDouble(x -> (x - m) * (x - m)).average().orElse(0);
        return Optional.of(new Baseline(m, Math.max(Math.sqrt(var), Math.max(Math.abs(m) * 0.02, 0.1)))); // floor avoids divide-by-zero
    }
    public double z(double value) { return (value - mean) / sd; }
}
