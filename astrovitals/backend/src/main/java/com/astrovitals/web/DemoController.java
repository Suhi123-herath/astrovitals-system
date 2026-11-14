package com.astrovitals.web;

import com.astrovitals.service.DemoSeedService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo")
public class DemoController {
    private final DemoSeedService seeder;
    public DemoController(DemoSeedService seeder) { this.seeder = seeder; }

    @PostMapping("/seed")
    public Map<String, Object> seed(@RequestParam(defaultValue = "radiation-event") String scenario, @RequestParam(defaultValue = "1") Long astronautId) {
        return Map.of("scenario", scenario, "checkIns", seeder.seed(astronautId, scenario));
    }
}
