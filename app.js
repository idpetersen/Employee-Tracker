const express = require('express');
const inquirer = require('inquirer')
// Import and require mysql2
const mysql = require('mysql2');
require('.dotenv').config();
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect((err)=>{
    if (err){
        throw err;
    } else questions ();
})


const questions = () => {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"],
            name: "init"
        })
        .then((answer)=> {
            switch (answer.init) {
                case "View All Employees":
                    
                    break;
            
                default:
                    break;
                case "Add Employee":
                    
                    break;
            
                default:
                    break;
                case "Update Employee Role":
                    
                    break;
            
                default:
                    break;
                case "View All Roles":
                    
                    break;
            
                default:
                    break;
                case "Add Role":
                    
                    break;
            
                default:
                    break;
                case "View All Departments":
                    
                    break;
            
                default:
                    break;
                case "Add Department":
                    
                    break;
            
                default:
                    break;
            }
        })
}



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
