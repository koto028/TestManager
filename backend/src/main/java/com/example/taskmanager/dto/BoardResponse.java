package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Board;

import java.time.LocalDateTime;
import java.util.List;

public record BoardResponse(
        Long id,
        String title,
        List<TaskListResponse> lists,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BoardResponse from(Board board) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getLists().stream().map(TaskListResponse::from).toList(),
                board.getCreatedAt(),
                board.getUpdatedAt()
        );
    }

    public static BoardResponse summary(Board board) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                List.of(),
                board.getCreatedAt(),
                board.getUpdatedAt()
        );
    }
}
