package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.TaskDTO.ProjectDTO;
import com.projectmanagementtool.backend.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    @Mapping(source = "status.name", target = "status")
    @Mapping(target = "myRole", ignore = true)
    ProjectDTO toDTO(Project project);
} 