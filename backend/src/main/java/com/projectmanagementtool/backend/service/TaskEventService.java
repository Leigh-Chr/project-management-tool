package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.model.TaskEvent;

import java.util.List;

public interface TaskEventService {
    List<TaskEventDTO> getTaskEvents(Long taskId);
    
    TaskEventDTO createTaskEvent(Long taskId, String description);
    
    void deleteTaskEvents(Long taskId);
    
    List<TaskEvent> findByTaskId(Long taskId);
    
    List<TaskEvent> findByTaskIdOrderByDateDesc(Long taskId);
    
    TaskEvent save(TaskEvent taskEvent);
    
    void deleteById(Long id);

    boolean existsById(Long id);

    TaskEvent findById(Long id);
} 