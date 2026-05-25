package com.example.taskmanager.dto;

import java.util.List;

public record CardReorderRequest(List<Long> cardIds) {}
