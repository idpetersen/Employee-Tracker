USE employee_db

INSERT INTO department (department_name) VALUES ("Potions"), ("Charms"), ("Dark Arts"), ("Transformation");


INSERT INTO roles (title, salary, department_id) VALUES ("Keeper", 30000, 1), ("Professor", 4000, 2), ("Potion Master", 23434, 3), ("Tester", 120000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bill", "Bobaggins", 4, 1), ("LOCK", "Hyde", 1, 1), ("Sabrina", "Hanson", 3, 1), ("Sara", "Hanson", 2, 3), ("Mike", "Steele", 4, 2), ("Dude", "McDuderson", 4, 1);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;