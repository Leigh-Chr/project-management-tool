package com.projectmanagementtool.backend.mapper;

import com.projectmanagementtool.backend.dto.UserDto;
import com.projectmanagementtool.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    User toEntity(UserDto userDto);
} 