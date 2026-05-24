package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {

    @Query("SELECT MAX(c.sortOrder) FROM Card c WHERE c.taskList.id = :listId")
    Optional<Integer> findMaxSortOrderByListId(@Param("listId") Long listId);
}
