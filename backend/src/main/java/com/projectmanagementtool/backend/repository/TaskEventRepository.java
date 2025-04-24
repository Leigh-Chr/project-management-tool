package com.projectmanagementtool.backend.repository;

import com.projectmanagementtool.backend.model.TaskEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskEventRepository extends JpaRepository<TaskEvent, Long> {
    List<TaskEvent> findByTaskId(Long taskId);
    List<TaskEvent> findByTaskIdOrderByDateDesc(Long taskId);
} 