package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {}
