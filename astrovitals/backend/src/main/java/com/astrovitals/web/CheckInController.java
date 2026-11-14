package com.astrovitals.web;

import com.astrovitals.dto.*;
import com.astrovitals.service.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/astronauts/{id}")
public class CheckInController {
    private final CheckInService checkIns; private final StatusService status; private final EngagementService engagement;
    public CheckInController(CheckInService c, StatusService s, EngagementService e) { this.checkIns = c; this.status = s; this.engagement = e; }

    @GetMapping("/checkins")
    public List<CheckInResponse> list(@PathVariable Long id,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) { return checkIns.list(id, from, to); }

    @PostMapping("/checkins") @ResponseStatus(HttpStatus.CREATED)
    public CheckInResponse save(@PathVariable Long id, @Valid @RequestBody CheckInRequest body) { return checkIns.save(id, body); }

    @DeleteMapping("/checkins") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clear(@PathVariable Long id) { checkIns.clear(id); }

    @GetMapping("/status")
    public StatusResponse status(@PathVariable Long id, @RequestParam(defaultValue = "station") String env) { return status.status(id, env); }

    @GetMapping("/alerts")
    public List<StatusResponse.AlertDto> alerts(@PathVariable Long id, @RequestParam(defaultValue = "station") String env) { return status.status(id, env).alerts(); }

    @GetMapping("/tasks")
    public TasksResponse tasks(@PathVariable Long id) { return engagement.tasks(id); }
}
