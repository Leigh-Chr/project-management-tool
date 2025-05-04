package com.projectmanagementtool.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskEventDto {
    private Long id;
    private Long taskId;
    private String description;
    private LocalDateTime date;
    
    private TaskEventDto(TaskEventDtoBuilder builder) {
        this.id = builder.id;
        this.taskId = builder.taskId;
        this.description = builder.description;
        this.date = builder.date;
    }
    
    public TaskEventDto() {
        // Default constructor required
    }
    
    public static TaskEventDtoBuilder builder() {
        return new TaskEventDtoBuilder();
    }
    
    public static class TaskEventDtoBuilder {
        private Long id;
        private Long taskId;
        private String description;
        private LocalDateTime date;
        
        public TaskEventDtoBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public TaskEventDtoBuilder taskId(Long taskId) {
            this.taskId = taskId;
            return this;
        }
        
        public TaskEventDtoBuilder description(String description) {
            this.description = description;
            return this;
        }
        
        public TaskEventDtoBuilder date(LocalDateTime date) {
            this.date = date;
            return this;
        }
        
        public TaskEventDto build() {
            return new TaskEventDto(this);
        }
    }
} 