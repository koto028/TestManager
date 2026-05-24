package com.example.taskmanager.service;

import com.example.taskmanager.dto.CardUpdateRequest;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.entity.Card;
import com.example.taskmanager.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    @Transactional
    public CardResponse updateCard(Long cardId, CardUpdateRequest request) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));

        card.setTitle(request.title());
        card.setPriority(request.priority());
        card.setDueDate(request.dueDate());
        card.setUpdatedAt(LocalDateTime.now());

        return CardResponse.from(cardRepository.save(card));
    }
}
