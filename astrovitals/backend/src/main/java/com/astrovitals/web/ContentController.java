package com.astrovitals.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** Educational content (how to measure, why, hazards, when to escalate, what to do), loaded once from JSON. */
@RestController
@RequestMapping("/api/content")
public class ContentController {
    private final JsonNode content;
    public ContentController(ObjectMapper mapper) throws IOException {
        try (InputStream in = new ClassPathResource("content/content.json").getInputStream()) { this.content = mapper.readTree(in); }
    }
    @GetMapping public JsonNode all() { return content; }

    @GetMapping("/regions/{id}")
    public JsonNode region(@PathVariable String id) {
        for (JsonNode r : content.get("regions")) if (r.get("id").asText().equals(id)) return r;
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown body region: " + id);
    }
}
