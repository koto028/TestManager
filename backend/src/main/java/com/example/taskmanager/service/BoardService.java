package com.example.taskmanager.service;

import com.example.taskmanager.dto.BoardResponse;
import com.example.taskmanager.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;

    public List<BoardResponse> findAll() {
        return boardRepository.findAll().stream()
                .map(BoardResponse::summary)
                .toList();
    }

    public BoardResponse findById(Long id) {
        return boardRepository.findByIdWithListsAndCards(id)
                .map(BoardResponse::from)
                .orElseThrow(() -> new NoSuchElementException("Board not found: " + id));
    }
}
