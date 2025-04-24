-- Index pour la recherche de tâches par projet
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- Index pour la recherche de tâches par assigné
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);

-- Index pour la recherche de tâches par statut
CREATE INDEX idx_tasks_status_id ON tasks(status_id);

-- Index pour la recherche d'événements par tâche
CREATE INDEX idx_task_events_task_id ON task_events(task_id);

-- Index pour la recherche de membres par projet
CREATE INDEX idx_project_members_project_id ON project_members(project_id);

-- Index pour la recherche de membres par utilisateur
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Index pour la recherche de projets par statut
CREATE INDEX idx_projects_status_id ON projects(status_id);

-- Index pour la recherche de projets par date
CREATE INDEX idx_projects_dates ON projects(start_date, end_date); 