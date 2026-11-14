package com.astrovitals.engine;

import static org.junit.jupiter.api.Assertions.*;

import com.astrovitals.domain.*;
import org.junit.jupiter.api.Test;

class EscalationPolicyTest {
    private final EscalationPolicy near = new NearEarthPolicy(), delayed = new DelayedCommsPolicy();

    @Test void policiesAreChosenByCommunicationDelay() {
        assertTrue(near.supports(Environment.STATION) && near.supports(Environment.MOON));
        assertTrue(delayed.supports(Environment.MARS) && delayed.supports(Environment.TRANSIT));
        assertFalse(near.supports(Environment.MARS));
    }
    @Test void urgentAdviceDiffersWhenGroundCannotAnswerQuickly() {
        assertNotEquals(near.message(Level.URGENT), delayed.message(Level.URGENT));
        assertTrue(delayed.message(Level.REPORT).contains("crewmate"));
    }
    @Test void environmentLookupRejectsUnknownIds() { assertThrows(IllegalArgumentException.class, () -> Environment.fromId("venus")); }
}
