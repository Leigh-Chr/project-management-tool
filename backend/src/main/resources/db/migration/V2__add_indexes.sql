DELIMITER //

DROP PROCEDURE IF EXISTS create_index_if_not_exists//

CREATE PROCEDURE create_index_if_not_exists(
    IN table_name VARCHAR(64),
    IN index_name VARCHAR(64),
    IN column_list VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.statistics 
        WHERE table_schema = DATABASE()
        AND table_name = table_name
        AND index_name = index_name
    ) THEN
        SET @sql = CONCAT('CREATE INDEX ', index_name, ' ON ', table_name, '(', column_list, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//

DELIMITER ;

-- Index pour la recherche de tâches par projet
CALL create_index_if_not_exists('tasks', 'idx_tasks_project_id', 'project_id');

-- Index pour la recherche de tâches par assigné
CALL create_index_if_not_exists('tasks', 'idx_tasks_assignee_id', 'assignee_id');

-- Index pour la recherche de tâches par statut
CALL create_index_if_not_exists('tasks', 'idx_tasks_status_id', 'status_id');

-- Index pour la recherche d'événements par tâche
CALL create_index_if_not_exists('task_events', 'idx_task_events_task_id', 'task_id');

-- Index pour la recherche de membres par projet
CALL create_index_if_not_exists('project_members', 'idx_project_members_project_id', 'project_id');

-- Index pour la recherche de membres par utilisateur
CALL create_index_if_not_exists('project_members', 'idx_project_members_user_id', 'user_id');

-- Index pour la recherche de projets par statut
CALL create_index_if_not_exists('projects', 'idx_projects_status_id', 'status_id');

-- Index pour la recherche de projets par date
CALL create_index_if_not_exists('projects', 'idx_projects_dates', 'start_date, end_date');

DROP PROCEDURE IF EXISTS create_index_if_not_exists; 