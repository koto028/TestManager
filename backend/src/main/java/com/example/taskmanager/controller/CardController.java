package com.example.taskmanager.controller;

import com.example.taskmanager.dto.CardRequest;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/{listId}/cards")
    public ResponseEntity<CardResponse> createCard(
            @PathVariable Long listId,
            @RequestBody @Valid CardRequest request) {
        try {
            CardResponse response = cardService.createCard(listId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
