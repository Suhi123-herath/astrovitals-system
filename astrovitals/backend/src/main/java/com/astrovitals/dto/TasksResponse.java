package com.astrovitals.dto;

import java.util.List;

public record TasksResponse(List<String> due, int streak, List<String> badges) {}
