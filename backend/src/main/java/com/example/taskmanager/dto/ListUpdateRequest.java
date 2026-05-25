package com.example.taskmanager.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record ListUpdateRequest(
        @Min(value = 0, message = "優先度は0〜3の範囲で指定してください")
        @Max(value = 3, message = "優先度は0〜3の範囲で指定してください")
        int priority
) {}
