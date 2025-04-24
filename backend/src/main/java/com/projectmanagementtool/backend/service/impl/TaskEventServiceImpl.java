package com.projectmanagementtool.backend.service.impl;

import com.projectmanagementtool.backend.model.TaskEvent;
import com.projectmanagementtool.backend.repository.TaskEventRepository;
import com.projectmanagementtool.backend.service.TaskEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskEventServiceImpl implements TaskEventService {
    private final TaskEventRepository taskEventRepository;

    @Autowired
    public TaskEventServiceImpl(TaskEventRepository taskEventRepository) {
        this.taskEventRepository = taskEventRepository;
    }

    @Override
    public List<TaskEvent> findByTaskId(Long taskId) {
        return taskEventRepository.findByTaskId(taskId);
    }

    @Override
    public List<TaskEvent> findByTaskIdOrderByDateDesc(Long taskId) {
        return taskEventRepository.findByTaskIdOrderByDateDesc(taskId);
    }

    @Override
    public TaskEvent save(TaskEvent taskEvent) {
        return taskEventRepository.save(taskEvent);
    }

    @Override
    public void deleteById(Long id) {
        taskEventRepository.deleteById(id);
    }
} 