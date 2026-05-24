package com.example.taskmanager.repository;

import com.example.taskmanager.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {}
