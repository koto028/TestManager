package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ListUpdateRequest;
import com.example.taskmanager.dto.TaskListResponse;
import com.example.taskmanager.service.ListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
public class ListController {

    private final ListService listService;

    @PatchMapping("/api/lists/{id}")
    public ResponseEntity<TaskListResponse> updateList(
            @PathVariable Long id,
            @RequestBody @Valid ListUpdateRequest request) {
        try {
            return ResponseEntity.ok(listService.updateList(id, request));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
