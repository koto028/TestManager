package com.example.taskmanager.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CardUpdateRequest(
        @NotBlank(message = "タイトルは必須です")
        @Size(max = 255, message = "タイトルは255文字以内で入力してください")
        String title,

        @Min(value = 0, message = "優先度は0〜3の範囲で指定してください")
        @Max(value = 3, message = "優先度は0〜3の範囲で指定してください")
        int priority,

        LocalDate dueDate
) {}
