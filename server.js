const mysql = require('mysql2');
//const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const express = require('express');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());


// Connect to database
const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '12345678',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_db database.`)
);


init();

function init() {
  console.log("**********EMPLOYEE TRACKER**********");
  promptEmployee();

  // Creates an array of questions for user input
  function promptEmployee() {
    return inquirer.prompt([{
        type: 'list',
        name: 'questionsMain',
        message: 'What would you like to do?',
        choices: ['View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee',
          'Exit'
        ]
      }])

      .then(answers => {
        if (answers.questionsMain === 'View all departments') {
          viewDepartments();
        } else if (answers.questionsMain === 'View all roles') {
          viewRoles();
        } else if (answers.questionsMain === 'View all employees') {
          viewEmployees();
        } else if (answers.questionsMain === 'Add a department') {
          addDepartment();
        } else if (answers.questionsMain === 'Add a role') {
          addRole();
        } else if (answers.questionsMain === 'Add an employee') {
          addEmployee();
        } else if (answers.questionsMain === 'Update an employee') {
          updateEmployee();
        } else if (answers.questionsMain === 'Exit') {
          db.end()
        }
      });
  }

  function viewDepartments() {
    console.log("Displaying Results...\n\n");
    db.query(`SELECT department.id AS id, department.name AS department FROM department;`,
      function(err, results) {
        console.table(results);
        promptEmployee();
        console.table(`\n`);
      });
  }

  function viewRoles() {
    console.log("Displaying Results...\n\n");
    db.query(`SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id;`,
      function(err, results) {
        console.table(results);
        promptEmployee();
        console.table(`\n`);
      });
  }

  function viewEmployees() {
    console.log("Displaying Results...\n\n");
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS DEPARTMENT, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS MANAGER FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`,
      function(err, results) {
        console.table(results);
        promptEmployee();
        console.table(`\n`);
      });
  };

  // function viewAllEmployees2() {
  //     console.log("Displaying Results...\n\n");
  //     db.query(
  //         `SELECT employee.id AS ID, employee.first_name AS "FIRST NAME", employee.last_name AS "LAST NAME", role.title AS ROLE, department.name AS DEPARTMENT, role.salary AS SALARY, CONCAT(manager.first_name, ' ', manager.last_name) AS MANAGER FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
  //         , function (err, results) {
  //             console.table(results);
  //             mainMenu();
  //             console.table(`\n`);
  //         });
  // };

  function addDepartment() {
    return inquirer.prompt([{
        type: 'input',
        name: 'addDep',
        message: "Which department do you want to add?",
      }])
      .then(answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, answer.addDep, (err, results) => {
          if (err) throw err;
          console.log('Added ' + answer.addDep + " to departments!");
          viewDepartments();
        });
      });
  }


}



// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.table(`\n`);
  console.log(`Server running on port ${PORT}`);
});
