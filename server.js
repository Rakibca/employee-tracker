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
    database: 'classlist_db'
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
    const sql = `SELECT id, movie_name AS title FROM movies`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({
          error: err.message
        });
        return;
      }
      res.json({
        message: 'success',
        data: rows
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
