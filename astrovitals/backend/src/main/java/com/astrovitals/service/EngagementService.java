package com.astrovitals.service;

import com.astrovitals.domain.CheckIn;
import com.astrovitals.dto.TasksResponse;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Task prompts, streaks and badges. Rewards logging and exercise, never "good readings". */
@Service
@Transactional(readOnly = true)
public class EngagementService {
    private final CheckInService checkIns;
    public EngagementService(CheckInService checkIns) { this.checkIns = checkIns; }

    public TasksResponse tasks(Long id) {
        List<CheckIn> rows = checkIns.history(id);
        LocalDate today = LocalDate.now();
        Optional<CheckIn> t = rows.stream().filter(r -> r.getDate().equals(today)).findFirst();
        List<String> due = new ArrayList<>();
        if (t.isEmpty()) due.add("Log today’s check-in");
        else {
            if (t.get().getExercise() != null && t.get().getExercise() < 30) due.add("Complete a 30-minute exercise session");
            if (t.get().getMeals() != null && t.get().getMeals() < 3) due.add("Eat your remaining scheduled meals");
        }
        Set<LocalDate> dates = rows.stream().map(CheckIn::getDate).collect(Collectors.toSet());
        LocalDate d = dates.contains(today) ? today : today.minusDays(1);
        int streak = 0;
        while (dates.contains(d)) { streak++; d = d.minusDays(1); }
        List<String> badges = new ArrayList<>();
        if (streak >= 3) badges.add("3-day streak");
        if (streak >= 7) badges.add("7-day streak");
        if (rows.stream().filter(r -> r.getExercise() != null && r.getExercise() >= 30).count() >= 5) badges.add("Exercise champion");
        if (rows.size() >= 30) badges.add("Full mission logged");
        return new TasksResponse(due, streak, badges);
    }
}
