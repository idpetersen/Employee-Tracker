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
    password: 'password',
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
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) {
      throw err;
    } else {
      console.table(data);
      questions();
    }
  });
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
  db.query("SELECT * FROM roles", (err, data) => {
    if (err) {
      throw err;
    } else {
      console.table(data);
      questions();
    }
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the new department's name?",
        name: "newDepartment",
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
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the new role?",
        name: "newRoleTitle",
      },
      {
        type: "number",
        message: "What is the salary of the new role?",
        name: "newRoleSalary",
      },
      {
        type: "number",
        message: "What Department is this role apart of? (department #)",
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
};


const addEmployees = () => {
  db.query("SELECT * FROM roles", (err, data) => {
      if (err){
          throw err
      } 
      const roleArr = data.map(function (role){
          return {name:role.title, value:role.id}
      });
  db.query("SELECT * FROM employee", (err, data) => {
      if (err){
          throw err
      }
      const employeeArr = data.map(function (employee){
          return {name:employee.first_name+' '+employee.last_name, value:employee.id}
      })
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the first name of the new Employee?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the last name of the new Employee?",
          name: "lastName",
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
          message: "What is the new Employees manager?",
          name: "managerId",
        },
      ])

      .then((answer) => {
        console.log(answer)
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
  questions();
};

questions();
