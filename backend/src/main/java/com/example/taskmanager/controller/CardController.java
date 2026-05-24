package com.example.taskmanager.controller;

import com.example.taskmanager.dto.CardRequest;
import com.example.taskmanager.dto.CardUpdateRequest;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/api/lists/{listId}/cards")
    public ResponseEntity<CardResponse> createCard(
            @PathVariable Long listId,
            @RequestBody @Valid CardRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(cardService.createCard(listId, request));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/api/cards/{id}")
    public ResponseEntity<CardResponse> updateCard(
            @PathVariable Long id,
            @RequestBody @Valid CardUpdateRequest request) {
        try {
            return ResponseEntity.ok(cardService.updateCard(id, request));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
