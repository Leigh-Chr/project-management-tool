-- Insert initial data
-- Statuses
INSERT INTO statuses (id, name) VALUES
(1, 'To Do'),
(2, 'In Progress'),
(3, 'Done');

-- Roles
INSERT INTO roles (id, name) VALUES
(1, 'Admin'),
(2, 'Member'),
(3, 'Observer');

-- Users
-- Note: These are plain text passwords for demo purposes only
INSERT INTO users (id, username, email, password) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$6x6LaEwgOLQQMTVWHyzOoOp7nNg9tAkvlY8bWIeMqRrfn1PaGdSKq'), -- admin123
(2, 'alice', 'alice@example.com', '$2a$10$oqFowf3q4xfEEpeU6m2NFeBJeCUha7qbTZODlTIPhsR6FFA1POqAW'), -- alice123
(3, 'bob', 'bob@example.com', '$2a$10$gGb5uGySwkA2G8vu/GEAOuBElyvojSNN4jCwyzceInofMPJn909OG'), -- bob123
(4, 'charlie', 'charlie@example.com', '$2a$10$ZIzTDsr0oAIoGt.ird.MdeUjBnFGmD/LE3ziZL1vnmCFt/iX5N2Gi'), -- charlie123
(5, 'diana', 'diana@example.com', '$2a$10$/CENigrDJDKkv1e0ANsXWepn3TheMVrC3YRH6D4mc6ZR6VHlzg8uK'); -- diana123

-- Projects
INSERT INTO projects (id, name, description, start_date, end_date, status_id) VALUES
(1, 'E-commerce Website', 'Development of a modern e-commerce platform with payment integration', '2024-01-01', '2024-06-30', 2),
(2, 'Mobile App', 'Cross-platform mobile application for iOS and Android', '2024-03-01', '2024-08-31', 1),
(3, 'Backend API', 'RESTful API development with microservices architecture', '2024-02-15', '2024-07-15', 2);

-- Project Members
INSERT INTO project_members (id, project_id, user_id, role_id) VALUES
-- E-commerce Website
(1, 1, 1, 1), -- Admin
(2, 1, 2, 2), -- Alice - Member
(3, 1, 3, 2), -- Bob - Member
(4, 1, 5, 3), -- Diana - Observer

-- Mobile App
(5, 2, 1, 1), -- Admin
(6, 2, 3, 2), -- Bob - Member
(7, 2, 4, 2), -- Charlie - Member

-- Backend API
(8, 3, 1, 1), -- Admin
(9, 3, 2, 2), -- Alice - Member
(10, 3, 4, 2), -- Charlie - Member
(11, 3, 5, 3); -- Diana - Observer

-- Tasks
INSERT INTO tasks (id, project_id, name, description, due_date, priority, assignee_id, status_id) VALUES
-- E-commerce Website tasks
(1, 1, 'Design Homepage', 'Create wireframes and design for the homepage', '2024-01-15', 1, 2, 3),
(2, 1, 'Implement Payment Gateway', 'Integrate Stripe payment system', '2024-02-28', 1, 3, 2),
(3, 1, 'Product Catalog', 'Develop product listing and filtering system', '2024-03-15', 2, 2, 1),

-- Mobile App tasks
(4, 2, 'Setup React Native', 'Configure development environment', '2024-03-10', 1, 6, 1),
(5, 2, 'Design App UI', 'Create app screens and navigation flow', '2024-03-20', 1, 7, 1),

-- Backend API tasks
(6, 3, 'Design API Schema', 'Define endpoints and data structures', '2024-02-28', 1, 9, 3),
(7, 3, 'Implement Authentication', 'Create JWT authentication system', '2024-03-15', 1, 10, 2),
(8, 3, 'Database Setup', 'Configure PostgreSQL and migrations', '2024-03-01', 2, 9, 1);

-- Task Events
INSERT INTO task_events (id, task_id, description, date) VALUES
-- Homepage Design events
(1, 1, 'Task created', '2024-01-01'),
(2, 1, 'Assigned to Alice', '2024-01-01'),
(3, 1, 'Status changed to In Progress', '2024-01-05'),
(4, 1, 'Status changed to Done', '2024-01-14'),

-- Payment Gateway events
(5, 2, 'Task created', '2024-02-01'),
(6, 2, 'Assigned to Bob', '2024-02-01'),
(7, 2, 'Status changed to In Progress', '2024-02-05'),

-- API Schema events
(8, 6, 'Task created', '2024-02-15'),
(9, 6, 'Assigned to Alice', '2024-02-15'),
(10, 6, 'Status changed to In Progress', '2024-02-16'),
(11, 6, 'Status changed to Done', '2024-02-27'); 