package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskEventDTO;
import com.projectmanagementtool.backend.model.TaskEvent;
import org.springframework.stereotype.Component;

@Component
public class TaskEventMapper {
    
    public TaskEventDTO toDTO(TaskEvent taskEvent) {
        if (taskEvent == null) {
            return null;
        }
        
        TaskEventDTO dto = new TaskEventDTO();
        dto.setId(taskEvent.getId());
        dto.setTaskId(taskEvent.getTask().getId());
        dto.setDescription(taskEvent.getDescription());
        dto.setDate(taskEvent.getDate());
        return dto;
    }
    
    public TaskEvent toEntity(TaskEventDTO dto) {
        if (dto == null) {
            return null;
        }
        
        TaskEvent taskEvent = new TaskEvent();
        taskEvent.setId(dto.getId());
        taskEvent.setDescription(dto.getDescription());
        taskEvent.setDate(dto.getDate());
        // Note: Task doit être défini par le service car il nécessite une recherche en base de données
        return taskEvent;
    }
} 