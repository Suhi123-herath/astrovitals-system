package com.astrovitals;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {
    @Autowired MockMvc mvc;

    private String body(int hr) {
        return """
            {"date":"%s","hr":%d,"sys":114,"dia":74,"glucose":88,"temp":36.6,"sleep":7.5,"mood":4,"exercise":45,"meals":3}
            """.formatted(LocalDate.now(), hr);
    }

    @Test void savesAndListsACheckIn() throws Exception {
        mvc.perform(post("/api/astronauts/1/checkins").contentType(MediaType.APPLICATION_JSON).content(body(66))).andExpect(status().isCreated());
        mvc.perform(get("/api/astronauts/1/checkins")).andExpect(status().isOk()).andExpect(jsonPath("$", not(empty())));
    }

    @Test void rejectsOutOfRangeValuesWithFieldErrors() throws Exception {
        mvc.perform(post("/api/astronauts/1/checkins").contentType(MediaType.APPLICATION_JSON).content(body(500)))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.hr").exists());
    }

    @Test void unknownAstronautIsA404() throws Exception {
        mvc.perform(get("/api/astronauts/999/status")).andExpect(status().isNotFound());
    }

    @Test void demoMissionTriggersAlerts() throws Exception {
        mvc.perform(post("/api/demo/seed")).andExpect(status().isOk()).andExpect(jsonPath("$.checkIns").value(30));
        mvc.perform(get("/api/astronauts/1/status?env=mars")).andExpect(status().isOk())
            .andExpect(jsonPath("$.overall", greaterThanOrEqualTo(1))).andExpect(jsonPath("$.alerts", not(empty())));
    }


    @Test void recordsMissionContextSymptomsAndEnvironmentalObservations() throws Exception {
        mvc.perform(delete("/api/astronauts/1/checkins"));
        String json = """
            {"date":"%s","hr":70,"sys":115,"dia":75,"glucose":90,"temp":36.7,"sleep":7.5,"mood":4,"exercise":35,"meals":3,
             "spo2":98,"hydrationMl":2200,"missionEnvironment":"mars","missionPhase":"in_mission","activityContext":"resting",
             "glucoseContext":"fasting","symptoms":"Chest pain|Dizziness","radiationDoseUsv":1.2,"cabinCo2Ppm":650,
             "cabinTemperatureC":22.1,"environmentAlarm":true,"exposureSource":"SENSOR"}
            """.formatted(LocalDate.now());
        mvc.perform(post("/api/astronauts/1/checkins").contentType(MediaType.APPLICATION_JSON).content(json))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.radiationDoseUsv").value(1.2))
            .andExpect(jsonPath("$.missionEnvironment").value("mars"));
        mvc.perform(get("/api/astronauts/1/status?env=mars")).andExpect(status().isOk())
            .andExpect(jsonPath("$.hasData").value(true)).andExpect(jsonPath("$.overall").value(3))
            .andExpect(jsonPath("$.alerts[*].indicator", hasItem("symptoms")))
            .andExpect(jsonPath("$.alerts[*].indicator", hasItem("environment")))
            .andExpect(jsonPath("$.missionContext.exposureSource").value("SENSOR"));
    }

    @Test void emptyStatusIsExplicitlyNoData() throws Exception {
        mvc.perform(delete("/api/astronauts/1/checkins"));
        mvc.perform(get("/api/astronauts/1/status?env=station")).andExpect(status().isOk())
            .andExpect(jsonPath("$.hasData").value(false)).andExpect(jsonPath("$.guidance", containsString("No health data")));
    }

    @Test void contentEndpointServesBodyRegions() throws Exception {
        mvc.perform(get("/api/content/regions/heart")).andExpect(status().isOk()).andExpect(jsonPath("$.tabs.measure").exists());
    }
}
