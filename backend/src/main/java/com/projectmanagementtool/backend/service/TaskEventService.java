package com.projectmanagementtool.backend.service;

import com.projectmanagementtool.backend.dto.TaskEventDto;
import com.projectmanagementtool.backend.model.Task;
import com.projectmanagementtool.backend.model.TaskEvent;

import java.util.List;

public interface TaskEventService {
    List<TaskEventDto> getTaskEvents(Long taskId);
    
    TaskEventDto createTaskEvent(Long taskId, String description);
    
    void deleteTaskEvents(Long taskId);
    
    List<TaskEvent> findByTaskId(Long taskId);
    
    List<TaskEvent> findByTaskIdOrderByDateDesc(Long taskId);
    
    TaskEvent save(TaskEvent taskEvent);
    
    void deleteById(Long id);
    
    boolean existsById(Long id);
    
    TaskEvent findById(Long id);
} 