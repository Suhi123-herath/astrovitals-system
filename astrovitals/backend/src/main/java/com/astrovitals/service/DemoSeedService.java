package com.astrovitals.service;

import com.astrovitals.dto.CheckInRequest;
import java.time.LocalDate;
import java.util.Random;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Seeds a deterministic 30-day synthetic mission scenario for demonstrating trend detection; not measured astronaut data. */
@Service
public class DemoSeedService {
    private final CheckInService checkIns;
    public DemoSeedService(CheckInService checkIns) { this.checkIns = checkIns; }

    @Transactional
    public int seed(Long astronautId, String scenario) {
        if (!("radiation-event".equals(scenario) || "combined-mission-demo".equals(scenario))) throw new IllegalArgumentException("Unknown scenario: " + scenario);
        checkIns.clear(astronautId);
        Random r = new Random(42);
        int n = 30;
        for (int i = 0; i < n; i++) {
            double s = Math.max(0, i - 11) / 18.0;
            checkIns.save(astronautId, new CheckInRequest(LocalDate.now().minusDays(n - 1 - i),
                (int) Math.round(66 + j(r, 3) + s * 14), (int) Math.round(113 + j(r, 3) + s * 8), (int) Math.round(74 + j(r, 2) + s * 5),
                (int) Math.round(88 + j(r, 4) + s * 10), Math.round((36.6 + j(r, 0.2) + s * 0.5) * 10) / 10.0,
                Math.round((7.6 + j(r, 0.4) - s * 2.6) * 10) / 10.0, (int) Math.max(1, Math.min(5, Math.round(4 + j(r, 0.6) - s * 2))),
                2 + (int)Math.round(r.nextDouble() * 2), (int) Math.round(45 + j(r, 10) - s * 25), 3,
                98, 2200, "station", "in_mission", "resting", "unknown", "", 0.8 + r.nextDouble() * 0.3,
                600 + (int)Math.round(j(r, 35)), 22.0 + j(r, 0.5), false, "SIMULATED"));
        }
        return n;
    }
    private static double j(Random r, double a) { return (r.nextDouble() - 0.5) * 2 * a; }
}
