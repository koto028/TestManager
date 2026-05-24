package com.example.taskmanager.controller;

import com.example.taskmanager.dto.CardUpdateRequest;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PatchMapping("/{id}")
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
