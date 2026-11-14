package com.astrovitals.engine;

import static org.junit.jupiter.api.Assertions.*;

import com.astrovitals.domain.*;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.Test;

class StatusEngineTest {
    private final StatusEngine engine = new StatusEngine(List.of(new ZoneRule(), new BaselineRule(), new TrendRule()));

    private static CheckIn day(int offset, int hr, double sleep, int mood) {
        CheckIn c = new CheckIn();
        c.setDate(LocalDate.of(2026, 1, 1).plusDays(offset));
        c.setHr(hr); c.setSys(114); c.setDia(74); c.setGlucose(88); c.setTemp(36.6); c.setSleep(sleep); c.setMood(mood); c.setExercise(45); c.setMeals(3);
        return c;
    }
    private static List<CheckIn> stableWeek() {
        List<CheckIn> h = new ArrayList<>();
        int[] hr = {64, 66, 65, 67, 66, 65, 66};
        for (int i = 0; i < 7; i++) h.add(day(i, hr[i], 7.5, 4));
        return h;
    }

    @Test void emptyHistoryIsNormal() { assertEquals(Level.NORMAL, engine.evaluate(List.of()).overall()); }

    @Test void healthyDayIsNormal() {
        List<CheckIn> h = stableWeek(); h.add(day(7, 66, 7.5, 4));
        assertEquals(Level.NORMAL, engine.evaluate(h).overall());
    }

    @Test void outOfRangeHeartRateRaisesReport() {
        List<CheckIn> h = new ArrayList<>(List.of(day(0, 135, 7.5, 4)));
        StatusEngine.Evaluation ev = engine.evaluate(h);
        assertEquals(Level.REPORT, ev.readings().get(Indicator.HR).level());
        assertTrue(ev.alerts().get(0).reasons().get(0).startsWith("Zone:"));
    }

    @Test void baselineRuleIsSkippedWithShortHistory() {
        List<CheckIn> h = stableWeek(); // exactly 7 entries: not enough to judge against a baseline
        assertTrue(new BaselineRule().evaluate(Indicator.HR, h).isEmpty());
    }

    @Test void deviationFromPersonalBaselineIsFlaggedEvenInsideNormalRange() {
        List<CheckIn> h = stableWeek(); h.add(day(7, 82, 7.5, 4)); // 82 bpm is in the normal zone but far above this person's ~66
        StatusEngine.Evaluation ev = engine.evaluate(h);
        assertTrue(ev.readings().get(Indicator.HR).level().compareTo(Level.WATCH) >= 0);
        assertTrue(ev.alerts().stream().flatMap(a -> a.reasons().stream()).anyMatch(r -> r.startsWith("Baseline:")));
    }

    @Test void redZoneAndFarFromBaselineIsUrgent() {
        List<CheckIn> h = stableWeek(); h.add(day(7, 130, 7.5, 4));
        assertEquals(Level.URGENT, engine.evaluate(h).readings().get(Indicator.HR).level());
    }

    @Test void flatHistoryDoesNotDivideByZero() {
        List<CheckIn> h = new ArrayList<>();
        for (int i = 0; i < 8; i++) h.add(day(i, 66, 7.5, 4));
        assertDoesNotThrow(() -> engine.evaluate(h));
    }

    @Test void fallingSleepAcrossMissingCalendarDayIsNotCalledAThreeDayTrend() {
        List<CheckIn> h = new ArrayList<>(List.of(day(0, 66, 8.5, 4), day(2, 66, 8.2, 4), day(3, 66, 7.9, 4)));
        assertFalse(engine.evaluate(h).alerts().stream().flatMap(a -> a.reasons().stream()).anyMatch(r -> r.startsWith("Trend:")));
    }

    @Test void fallingSleepThreeDaysInARowIsAWatchTrend() {
        List<CheckIn> h = new ArrayList<>(List.of(day(0, 66, 8.5, 4), day(1, 66, 8.2, 4), day(2, 66, 7.9, 4)));
        assertTrue(engine.evaluate(h).alerts().stream().flatMap(a -> a.reasons().stream()).anyMatch(r -> r.startsWith("Trend:")));
    }
}
