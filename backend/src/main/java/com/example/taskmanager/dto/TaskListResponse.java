package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskList;

import java.time.LocalDateTime;
import java.util.List;

public record TaskListResponse(
        Long id,
        String title,
        Integer sortOrder,
        List<CardResponse> cards,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskListResponse from(TaskList list) {
        return new TaskListResponse(
                list.getId(),
                list.getTitle(),
                list.getSortOrder(),
                list.getCards().stream().map(CardResponse::from).toList(),
                list.getCreatedAt(),
                list.getUpdatedAt()
        );
    }
}
