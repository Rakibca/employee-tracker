const mysql = require('mysql2')
const inquirer = require('inquirer');
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
    password: 'Qdb4@kpt2',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_db database.`)
);


init();

function init() {
  console.log("**********EMPLOYEE MANAGER**********");
  promptEmployee();

  // Creates an array of questions for user input
  function promptEmployee() {
    return inquirer.prompt([{
        type: 'checkbox',
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
    const sql = `SELECT department.id AS id, department.name AS department
                 FROM department`;
    db.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptEmployee();
    })
  }

  function viewRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department
                 ON role.department_id = department.id`;
    db.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptEmployee();
    })
  }

  function viewRoles() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id`;
    db.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptEmployee();
    })
  }

  function addDepartment() {
    return inquirer.prompt([{
        type: 'input',
        name: 'addDept',
        message: "Which department do you want to add?",
      }])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                     VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!");
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
  console.log(`Server running on port ${PORT}`);
});
