-- Suppression des colonnes de timestamp
ALTER TABLE roles DROP COLUMN created_at;
ALTER TABLE roles DROP COLUMN updated_at;

ALTER TABLE users DROP COLUMN created_at;
ALTER TABLE users DROP COLUMN updated_at;

ALTER TABLE projects DROP COLUMN created_at;
ALTER TABLE projects DROP COLUMN updated_at;

ALTER TABLE project_members DROP COLUMN created_at;
ALTER TABLE project_members DROP COLUMN updated_at;

ALTER TABLE tasks DROP COLUMN created_at;
ALTER TABLE tasks DROP COLUMN updated_at;

ALTER TABLE task_events DROP COLUMN created_at; 