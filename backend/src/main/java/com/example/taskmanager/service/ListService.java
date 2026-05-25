package com.example.taskmanager.service;

import com.example.taskmanager.dto.ListUpdateRequest;
import com.example.taskmanager.dto.TaskListResponse;
import com.example.taskmanager.entity.TaskList;
import com.example.taskmanager.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ListService {

    private final TaskListRepository taskListRepository;

    @Transactional
    public TaskListResponse updateList(Long listId, ListUpdateRequest request) {
        TaskList list = taskListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("List not found: " + listId));

        list.setPriority(request.priority());
        list.setUpdatedAt(LocalDateTime.now());

        return TaskListResponse.from(taskListRepository.save(list));
    }
}
