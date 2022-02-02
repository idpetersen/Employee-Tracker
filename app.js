const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const questions = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Delete Department, Role, or Employee",
        "Quit",
      ],
      name: "init",
    })
    .then((answer) => {
      switch (answer.init) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployees();
          break;
        case "Update Employee Role":
          updateEmpRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRoles();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Delete Department, Role, or Employee":
          deleting();
          break;
        default:
          quit();
          break;
      }
    });
};

const quit = () => {
  console.log("Good-Bye");
  return db.end();
};

const viewEmployees = () => {
  db.query(
    "SELECT e.id, e.first_name, e.last_name, roles.title AS Job_Title, department.department_name AS Department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e JOIN roles ON e.role_id = roles.id JOIN department ON roles.department_id = department.id INNER JOIN employee m ON m.id = e.manager_id ORDER BY id ASC", 
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.table(data);
        questions();
      }
    }
  );
};

const viewDepartments = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      throw err;
    } else {
      console.table(data);
      questions();
    }
  });
};

const viewRoles = () => {
  db.query(
    "SELECT roles.id, roles.title AS role, roles.salary, department.department_name AS department FROM roles JOIN department ON roles.department_id = department.id",
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.table(data);
        questions();
      }
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the new department's name?",
        name: "newDepartment",
        validate: function (name){
          valid = /^[A-Za-z\s]*$/.test(name)
          if (valid){
              return true;
          } else {
              console.log("\n Department name should not include numbers (unless you're a cyborg)")
              return false;
          }
        }
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO department SET ?",
        { department_name: answer.newDepartment },
        (err, data) => {
          if (err) throw err;
          console.log("Added new Department! \n ===========");
          questions();
        }
      );
    });
};

const addRoles = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      throw err;
    }
    const departmentArr = data.map(function (department) {
      return { name: department.department_name, value: department.id };
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the new role?",
          name: "newRoleTitle",
          validate: function (name){
            valid = /^[A-Za-z\s]*$/.test(name)
            if (valid){
                return true;
            } else {
                console.log("\n Role name should not include numbers (unless you're a cyborg)")
                return false;
            }
          }
        },
        {
          type: "number",
          message: "What is the salary of the new role?",
          name: "newRoleSalary",
          validate: function (id){
            valid = /^[0-9]*$/.test(id)
            if (valid){
                return true;
            } else {
                console.log("\n Salary should not include special characters or letters")
                return false;
            }
          }
        },
        {
          type: "list",
          choices: departmentArr,
          message: "What Department is this role apart of?",
          name: "newRoleDepartment",
        },
      ])
      .then((answer) => {
        db.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.newRoleTitle,
            salary: answer.newRoleSalary,
            department_id: answer.newRoleDepartment,
          },
          (err, data) => {
            if (err) throw err;
            console.log("Added new Role! \n ===========");
            questions();
          }
        );
      });
  });
};

const addEmployees = () => {
  db.query("SELECT * FROM roles", (err, data) => {
    if (err) {
      throw err;
    }
    const roleArr = data.map(function (role) {
      return { name: role.title, value: role.id };
    });
    db.query("SELECT * FROM employee", (err, data) => {
      if (err) {
        throw err;
      }
      const employeeArr = data.map(function (employee) {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the first name of the new Employee?",
            name: "firstName",
            validate: function (name){
              valid = /^[A-Za-z\s]*$/.test(name)
              if (valid){
                  return true;
              } else {
                  console.log("\n First name should not include numbers (unless you're a cyborg)")
                  return false;
              }
            }
          },
          {
            type: "input",
            message: "What is the last name of the new Employee?",
            name: "lastName",
            validate: function (name){
              valid = /^[A-Za-z\s]*$/.test(name)
              if (valid){
                  return true;
              } else {
                  console.log("\n Last name should not include numbers (unless you're a cyborg)")
                  return false;
              }
            }
          },
          {
            type: "list",
            choices: roleArr,
            message: "What is the role that the new Employee belongs to?",
            name: "roleId",
          },
          {
            type: "list",
            choices: employeeArr,
            message: "Who is the new Employees manager?",
            name: "managerId",
          },
        ])

        .then((answer) => {
          console.log(answer);
          db.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.roleId,
              manager_id: answer.managerId,
            },
            (err, data) => {
              if (err) throw err;
              console.log("Added new Employee! \n ===========");
              questions();
            }
          );
        });
    });
  });
};

const updateEmpRole = () => {
  db.query("SELECT * FROM roles", (err, data) => {
    if (err) {
      throw err;
    }
    const roleArr = data.map(function (role) {
      return { name: role.title, value: role.id };
    });
    db.query("SELECT * FROM employee", (err, data) => {
      if (err) {
        throw err;
      }
      const employeeArr = data.map(function (employee) {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            choices: employeeArr,
            name: "empUpdate",
          },
          {
            type: "list",
            message: "Which new role would you like to give them?",
            choices: roleArr,
            name: "roleUpdate",
          },
        ])
        .then((answer) => {
          const empUpdate = answer.empUpdate
          const roleUpdate = answer.roleUpdate
          db.query("UPDATE employee SET role_id = ? WHERE id = ?;",[roleUpdate, empUpdate],
          (err, data)=>{
            if (err) throw err;
            console.log('Employee updated! \n ==========');
            questions();
          }
          );
        });
    });
  });
};

const deleting = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to delete?',
        choices: ['Department', 'Role', 'Employee', 'Return to Main Menu'],
        name: 'deleteChoice'
      }
    ])
    .then((answer) =>{
      switch (answer.deleteChoice) {
        case 'Department':
          deleteDepartment();
          break;
        case 'Role':
          deleteRole();
          break;
        case 'Employee':
          deleteEmployee();
          break;
        default:
          questions();
          break;
      }
    })
}

const deleteDepartment = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      throw err;
    }
    const departmentArr = data.map(function (department) {
      return { name: department.department_name, value: department.id };
    });
    inquirer
      .prompt([
        {
          type: 'list',
          choices: departmentArr,
          message: 'Which Department would you like to delete?',
          name: 'depDelete',
        }
      ])
      .then((answer) => {
        const depDelete = answer.depDelete
        db.query("DELETE FROM department WHERE id = ?", [depDelete], (err, data)=>{
          if (err) throw err;
          console.log('Deleted Department :( \n ==========');
          questions();
        })
      })
  });
}

const deleteRole = () => {
  db.query("SELECT * FROM roles", (err, data) => {
    if (err) {
      throw err;
    }
    const rolesArr = data.map(function (roles) {
      return { name: roles.title, value: roles.id };
    });
    inquirer
      .prompt([
        {
          type: 'list',
          choices: rolesArr,
          message: 'Which Role would you like to delete?',
          name: 'roleDelete',
        }
      ])
      .then((answer) => {
        const roleDelete = answer.roleDelete
        db.query("DELETE FROM department WHERE id = ?", [roleDelete], (err, data)=>{
          if (err) throw err;
          console.log('Deleted Department :( \n ==========');
          questions();
        })
      })
  });
}

const deleteEmployee = () => {
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) {
      throw err;
    }
    const employeeArr = data.map(function (employee) {
      return { name: employee.first_name + ' ' + employee.last_name, value: employee.id };
    });
    inquirer
      .prompt([
        {
          type: 'list',
          choices: employeeArr,
          message: 'Which Employee would you like to delete?',
          name: 'empDelete',
        }
      ])
      .then((answer) => {
        const empDelete = answer.empDelete
        db.query("DELETE FROM department WHERE id = ?", [empDelete], (err, data)=>{
          if (err) throw err;
          console.log('Deleted Department :( \n ==========');
          questions();
        })
      })
  });
}

questions();