const mysql = require('mysql2');
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


// Connect to MYSQL database called 'employeeTracker_db'
const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '12345678',
    database: 'employeeTracker_db'
  },
  console.log("Connected to the employeeTracker_db MySQL database:"),
  console.table(`\n`))


init();

function init() {
  console.log("********** WELCOME TO THE EMPLOYEE TRACKER **********");
  console.table(`\n`);
  promptEmployee();

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
          db.end();
          console.table(`\n`);
          console.log("********** EXITED FROM THE MENU **********");
          console.table(`\n`);
          console.log("Press (ctrl-c) to exit to command line");
        }
      })
  }


  function viewDepartments() {
    console.log("Displaying All Departments:\n\n");
    db.query(`SELECT department.id, department.name AS DEPARTMENT FROM department;`,
      function(err, results) {
        console.table(results);
        promptEmployee();
        console.table(`\n`);
      })
  }


  function viewRoles() {
    console.log("Displaying All Roles:\n\n");
    db.query(`SELECT role.id, role.title AS TITLE, role.salary AS SALARY, department.name AS DEPARTMENT FROM role INNER JOIN department ON role.department_id = department.id;`,
      function(err, results) {
        console.table(results);
        promptEmployee();
        console.table(`\n`);
      })
  }


  function viewEmployees() {
    console.log("Displaying All Employees:\n\n");
    db.query(`SELECT employee.id, employee.first_name AS FIRST_NAME, employee.last_name AS LAST_NAME, role.title AS TITLE, role.salary AS SALARY, department.name AS DEPARTMENT, CONCAT(manager.first_name, ' ', manager.last_name, ' ', employee.manager_id) AS MANAGER_WITH_ID FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`,
      function(err, results) {
        console.table(results);
        promptEmployee();
        console.table(`\n`);
      })
  }


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
          console.table(`\n`);
          console.log("Added department: " + answer.addDep);
          console.table(`\n`);
          viewDepartments();
        })
      })
  }


  function addRole() {
    return inquirer.prompt([{
          type: 'input',
          name: 'addRole',
          message: "Which role do you want to add?",
        },
        {
          type: 'input',
          name: 'addSalary',
          message: "What is the salary for this role?",
        }
      ])
      .then(answers => {
        const newRole = [answers.addRole, answers.addSalary];
        const sql = `SELECT name, id FROM department`;
        db.query(sql, (err, data) => {
          if (err) throw err;
          const allDept = data.map(({
            name,
            id
          }) => ({
            name: name,
            value: id
          }))
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          return inquirer.prompt([{
              type: 'list',
              name: 'newDept',
              message: "Which department is this role in?",
              choices: allDept
            }])
            .then(deptAnswer => {
              const newDept = deptAnswer.newDept;
              newRole.push(newDept); //pushed new department to newRole array
              const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
              db.query(sql, newRole, (err, results) => {
                if (err) throw err;
                console.table(`\n`);
                console.log("Added role: " + answers.addRole);
                console.table(`\n`);
                viewRoles();
              })
            })
        })
      })
  }


  function addEmployee() {
    return inquirer.prompt([{
          type: 'input',
          name: 'firstName',
          message: "What is the FIRST name of the new employee?",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the LAST name of the new employee?",
        }
      ])
      .then(answers => {
        const newEmployee = [answers.firstName, answers.lastName];
        const sql = `SELECT role.id, role.title FROM role`;
        db.query(sql, (err, data) => {
          if (err) throw err;
          const allRoles = data.map(({
            id,
            title
          }) => ({
            name: title,
            value: id
          }));
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          return inquirer.prompt([{
              type: 'list',
              name: 'newRole',
              message: "What is the role of the new employee?",
              choices: allRoles
            }])
            .then(roleAnswer => {
              const newRole = roleAnswer.newRole;
              newEmployee.push(newRole); //pushed new role to newEmployee array
              const sql = `SELECT * FROM employee`;
              db.query(sql, (err, data) => {
                if (err) throw err;
                const allManagers = data.map(({
                  id,
                  first_name,
                  last_name
                }) => ({
                  name: first_name + " " + last_name,
                  value: id
                }))
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                return inquirer.prompt([{
                    type: 'list',
                    name: 'assignManager',
                    message: "Who is the manager of the new employee?",
                    choices: allManagers
                  }])
                  .then(managerAnswer => {
                    const assignManager = managerAnswer.assignManager;
                    newEmployee.push(assignManager); //pushed assigned manager to newEmployee array
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    db.query(sql, newEmployee, (err, results) => {
                      if (err) throw err;
                      console.table(`\n`);
                      console.log("Added employee: " + answers.firstName + " " + answers.lastName)
                      console.table(`\n`);
                      viewEmployees();
                    })
                  })
              })
            })
        })
      })
  }


  function updateEmployee() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, data) => {
      if (err) throw err;
      const allEmployees = data.map(({
        id,
        first_name,
        last_name
      }) => ({
        name: first_name + " " + last_name,
        value: id
      }));
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      return inquirer.prompt([{
          type: 'list',
          name: 'employeeName',
          message: "Which employee would you like to update?",
          choices: allEmployees
        }])
        .then(employeeAnswer => {
          const employeeArray = [];
          const employeeName = employeeAnswer.employeeName;
          employeeArray.push(employeeName);
          const sql = `SELECT * FROM role`;
          db.query(sql, (err, data) => {
            if (err) throw err;
            const allRoles = data.map(({
              id,
              title
            }) => ({
              name: title,
              value: id
            }));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            return inquirer.prompt([{
                type: 'list',
                name: 'newRole',
                message: "What is the employee's new role?",
                choices: allRoles
              }])
              .then(roleAnswer => {
                const newRole = roleAnswer.newRole;
                employeeArray.push(newRole);
                const temp = employeeArray[0];
                employeeArray[1] = temp;
                employeeArray[0] = newRole;
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(sql, employeeArray, (err, results) => {
                  if (err) throw err;
                  console.table(`\n`);
                  console.log("Employee role with ID: " + employeeName + " has been updated");
                  console.table(`\n`);
                  viewEmployees();
                })
              })
          })
        })
    })
  }
}


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.table(`\n`);
  console.log(`Server running on port ${PORT}`);
  console.table(`\n`);
});
