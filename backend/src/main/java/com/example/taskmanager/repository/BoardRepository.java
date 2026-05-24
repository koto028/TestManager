package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT DISTINCT b FROM Board b LEFT JOIN FETCH b.lists WHERE b.id = :id")
    Optional<Board> findByIdWithListsAndCards(@Param("id") Long id);
}
