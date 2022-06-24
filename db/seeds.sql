INSERT INTO department (name)
VALUES
('General Management'),
('Marketing'),
('Operations'),
('Human Resource');

INSERT INTO role (title, salary, department_id)
VALUES
('Administrative Assistant', 50000, 4),
('Executive Assistant', 150000, 3),
('Marketing Manager', 100000, 1),
('Software Engineer', 120000, 2),
('Piping Designer', 160000, 2),
('Web Developer', 85000, 3),
('Network Analyst', 110000, 1),
('Sales Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Kirk', 'Lucia', 2, null),
('Dollie', 'Grahame', 4, 1),
('Autumn', 'Flower', 1, null),
('Colton', 'Russ', 6, 3),
('Rakesh', 'Sharma', 3, null),
('Ricki', 'Noel', 8, 5),
('Bart', 'Simpson', 7, null),
('Carolina', 'Rikki', 5, 7);
