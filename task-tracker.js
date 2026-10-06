// ========================================
// TASK TRACKER
// ========================================

// ----------------------------------------
// 1. Import File System module
// ----------------------------------------

const fs = require("fs");


// ----------------------------------------
// 2. Command line arguments
// ----------------------------------------

const args = process.argv.slice(2);


// ----------------------------------------
// 3. JSON file location
// ----------------------------------------

const FILE_PATH = "./tasks.json";


// ----------------------------------------
// 4. Terminal colors
// ----------------------------------------

const RESET = "\x1b[0m";

const GREEN = "\x1b[32m";   // Done
const YELLOW = "\x1b[33m";  // Todo
const BLUE = "\x1b[34m";    // In Progress
const RED = "\x1b[31m";     // Reminder overdue


// ========================================
// 5. Create JSON file if it doesn't exist
// ========================================

function initializeFile() {

    if (!fs.existsSync(FILE_PATH)) {

        fs.writeFileSync(FILE_PATH, "[]");

    }

}


// Run file initialization
initializeFile();


// ========================================
// 6. Load tasks from JSON file
// ========================================

function loadTasks() {

    initializeFile();

    try {

        const data = fs.readFileSync(
            FILE_PATH,
            "utf8"
        );

        return JSON.parse(data);

    } catch (error) {

        console.log("Error reading tasks.json.");

        return [];

    }

}


// ========================================
// 7. Save tasks to JSON file
// ========================================

function saveTasks(tasks) {

    try {

        fs.writeFileSync(
            FILE_PATH,
            JSON.stringify(tasks, null, 2)
        );

    } catch (error) {

        console.log("Error saving tasks.");

    }

}


// ========================================
// 8. Get next task ID
// ========================================

function getNextId(tasks) {

    if (tasks.length === 0) {

        return 1;

    }

    return Math.max(
        ...tasks.map(task => task.id)
    ) + 1;

}


// ========================================
// 9. Add Task
// ========================================

function addTask(description, reminder = null) {

    const tasks = loadTasks();


    // Maximum 50 tasks
    if (tasks.length >= 50) {

        console.log(
            "Maximum 50 tasks allowed."
        );

        return;

    }


    // Validate description
    if (!description || description.trim() === "") {

        console.log(
            "Please provide a task description."
        );

        return;

    }


    const newId = getNextId(tasks);


    const task = {

        id: newId,

        description: description,

        status: "todo",

        reminder: reminder

    };


    tasks.push(task);


    saveTasks(tasks);


    console.log(
        `Task added successfully. ID: ${newId}`
    );

}


// ========================================
// 10. Get task color
// ========================================

function getTaskColor(task) {

    // Done = Green
    if (task.status === "done") {

        return GREEN;

    }


    // In Progress = Blue
    if (task.status === "in-progress") {

        return BLUE;

    }


    // Overdue reminder = Red
    if (
        task.reminder &&
        !isNaN(new Date(task.reminder).getTime()) &&
        new Date(task.reminder) < new Date()
    ) {

        return RED;

    }


    // Todo = Yellow
    return YELLOW;

}


// ========================================
// 11. Display one task
// ========================================

function displayTask(task) {

    const color = getTaskColor(task);


    let reminderText = "";


    if (task.reminder) {

        reminderText =
            ` | Reminder: ${task.reminder}`;

    }


    console.log(
        `${color}${task.id}. ${task.description} ` +
        `[${task.status}]${reminderText}${RESET}`
    );

}


// ========================================
// 12. List all tasks
// ========================================

function listTasks() {

    const tasks = loadTasks();


    if (tasks.length === 0) {

        console.log("No tasks found.");

        return;

    }


    tasks.forEach(task => {

        displayTask(task);

    });

}


// ========================================
// 13. Update Task
// ========================================

function updateTask(id, description) {

    const tasks = loadTasks();


    const task = tasks.find(
        task => task.id === Number(id)
    );


    if (!task) {

        console.log("Task not found.");

        return;

    }


    if (!description || description.trim() === "") {

        console.log(
            "Please provide a new description."
        );

        return;

    }


    task.description = description;


    saveTasks(tasks);


    console.log(
        "Task updated successfully."
    );

}


// ========================================
// 14. Delete Task
// ========================================

function deleteTask(id) {

    const tasks = loadTasks();


    const taskId = Number(id);


    const taskExists = tasks.some(
        task => task.id === taskId
    );


    if (!taskExists) {

        console.log("Task not found.");

        return;

    }


    const updatedTasks = tasks.filter(
        task => task.id !== taskId
    );


    saveTasks(updatedTasks);


    console.log(
        "Task deleted successfully."
    );

}


// ========================================
// 15. Mark Task In Progress
// ========================================

function markInProgress(id) {

    const tasks = loadTasks();


    const task = tasks.find(
        task => task.id === Number(id)
    );


    if (!task) {

        console.log("Task not found.");

        return;

    }


    task.status = "in-progress";


    saveTasks(tasks);


    console.log(
        "Task marked as in-progress."
    );

}


// ========================================
// 16. Mark Task Done
// ========================================

function markDone(id) {

    const tasks = loadTasks();


    const task = tasks.find(
        task => task.id === Number(id)
    );


    if (!task) {

        console.log("Task not found.");

        return;

    }


    task.status = "done";


    saveTasks(tasks);


    console.log(
        "Task marked as done."
    );

}


// ========================================
// 17. List tasks by status
// ========================================

function listByStatus(status) {

    const tasks = loadTasks();


    const filteredTasks = tasks.filter(
        task => task.status === status
    );


    if (filteredTasks.length === 0) {

        console.log("No tasks found.");

        return;

    }


    filteredTasks.forEach(task => {

        displayTask(task);

    });

}
function listNotDone() {
    const tasks = loadTasks();

    const filteredTasks = tasks.filter(
        task => task.status !== "done"
    );

    if (filteredTasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    filteredTasks.forEach(task => {
        displayTask(task);
    });
}


// ========================================
// 18. Command Router
// ========================================

const command = args[0];


// ----------------------------------------
// ADD
// ----------------------------------------

if (command === "add") {

    const description = args[1];

    const reminder = args[2] || null;


    addTask(
        description,
        reminder
    );

}
else if (command === "list-not-done") {

    listNotDone();

}


// ----------------------------------------
// LIST
// ----------------------------------------

else if (command === "list") {

    listTasks();

}


// ----------------------------------------
// UPDATE
// ----------------------------------------

else if (command === "update") {

    const id = args[1];

    const description = args[2];


    updateTask(
        id,
        description
    );

}


// ----------------------------------------
// DELETE
// ----------------------------------------

else if (command === "delete") {

    const id = args[1];


    deleteTask(id);

}


// ----------------------------------------
// MARK IN PROGRESS
// ----------------------------------------

else if (command === "mark-in-progress") {

    const id = args[1];


    markInProgress(id);

}


// ----------------------------------------
// MARK DONE
// ----------------------------------------

else if (command === "mark-done") {

    const id = args[1];


    markDone(id);

}


// ----------------------------------------
// LIST DONE
// ----------------------------------------

else if (command === "list-done") {

    listByStatus("done");

}


// ----------------------------------------
// LIST TODO
// ----------------------------------------

else if (command === "list-todo") {

    listByStatus("todo");

}


// ----------------------------------------
// LIST IN PROGRESS
// ----------------------------------------

else if (command === "list-in-progress") {

    listByStatus("in-progress");

}


// ----------------------------------------
// HELP
// ----------------------------------------

else if (command === "help") {

    console.log(`
========================================
          TASK TRACKER
========================================

Commands:

Add:
node task-tracker.js add "Task description"

Add with reminder:
node task-tracker.js add "Task description" "2026-10-07T18:00"

List all:
node task-tracker.js list

Update:
node task-tracker.js update 1 "New description"

Delete:
node task-tracker.js delete 1

Mark in progress:
node task-tracker.js mark-in-progress 1

Mark done:
node task-tracker.js mark-done 1

List completed:
node task-tracker.js list-done

List pending:
node task-tracker.js list-todo

List in progress:
node task-tracker.js list-in-progress

Help:
node task-tracker.js help

========================================
`);

}


// ----------------------------------------
// UNKNOWN COMMAND
// ----------------------------------------

else {

    console.log(
        "Unknown command. Use 'help' to see available commands."
    );

}