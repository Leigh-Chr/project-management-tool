package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskEventDto;
import com.projectmanagementtool.backend.model.TaskEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskEventMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "taskId", source = "task.id")
    TaskEventDto toDto(TaskEvent taskEvent);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    TaskEvent toEntity(TaskEventDto taskEventDto);
} 