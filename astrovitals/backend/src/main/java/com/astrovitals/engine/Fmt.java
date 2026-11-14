package com.astrovitals.engine;

import java.util.Locale;

final class Fmt {
    private Fmt() {}
    static String num(double v) { return v == Math.rint(v) ? String.valueOf((long) v) : String.valueOf(v); }
    static String one(double v) { return String.format(Locale.ROOT, "%.1f", v); }
}
