package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.StatusDto;
import com.projectmanagementtool.backend.model.Status;
import org.springframework.stereotype.Component;

@Component
public class StatusMapper {
    public StatusDto toDto(Status status) {
        if (status == null) {
            return null;
        }
        StatusDto dto = new StatusDto();
        dto.setId(status.getId());
        dto.setName(status.getName());
        return dto;
    }

    public Status toEntity(StatusDto dto) {
        if (dto == null) {
            return null;
        }
        Status status = new Status();
        status.setId(dto.getId());
        status.setName(dto.getName());
        return status;
    }
} 