package com.astrovitals.engine;

import com.astrovitals.domain.Environment;
import com.astrovitals.domain.Level;

/** Strategy chosen by environment: who to involve depends on communication delay with ground. */
public interface EscalationPolicy {
    boolean supports(Environment env);
    String message(Level level);
}
