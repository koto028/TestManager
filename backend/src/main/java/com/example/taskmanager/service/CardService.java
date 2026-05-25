package com.example.taskmanager.service;

import com.example.taskmanager.dto.CardReorderRequest;
import com.example.taskmanager.dto.CardRequest;
import com.example.taskmanager.dto.CardUpdateRequest;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.entity.Card;
import com.example.taskmanager.entity.TaskList;
import com.example.taskmanager.repository.CardRepository;
import com.example.taskmanager.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;

    @Transactional
    public CardResponse createCard(Long listId, CardRequest request) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found: " + listId));

        int nextOrder = cardRepository.findMaxSortOrderByListId(listId)
                .map(max -> max + 1)
                .orElse(1);

        LocalDateTime now = LocalDateTime.now();
        Card card = new Card();
        card.setTaskList(taskList);
        card.setTitle(request.title());
        card.setSortOrder(nextOrder);
        card.setCreatedAt(now);
        card.setUpdatedAt(now);

        return CardResponse.from(cardRepository.save(card));
    }

    @Transactional
    public void reorderCards(Long listId, CardReorderRequest request) {
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found: " + listId));

        List<Card> cards = (List<Card>) cardRepository.findAllById(request.cardIds());
        Map<Long, Card> cardMap = cards.stream().collect(Collectors.toMap(Card::getId, c -> c));

        List<Card> ordered = request.cardIds().stream()
                .map(id -> {
                    Card c = cardMap.get(id);
                    if (c == null) throw new NoSuchElementException("Card not found: " + id);
                    return c;
                })
                .toList();

        for (int i = 0; i < ordered.size(); i++) {
            Card card = ordered.get(i);
            card.setTaskList(taskList);
            card.setSortOrder(i + 1);
            card.setUpdatedAt(LocalDateTime.now());
        }

        cardRepository.saveAll(ordered);
    }

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
