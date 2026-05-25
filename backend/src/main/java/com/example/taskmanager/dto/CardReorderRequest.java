package com.example.taskmanager.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CardReorderRequest(
        @NotNull(message = "cardIds は必須です")
        @NotEmpty(message = "cardIds は1件以上必要です")
        List<Long> cardIds
) {}
