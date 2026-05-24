package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Card;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CardResponse(
        Long id,
        String title,
        Integer sortOrder,
        Integer priority,
        LocalDate dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getTitle(),
                card.getSortOrder(),
                card.getPriority(),
                card.getDueDate(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}
