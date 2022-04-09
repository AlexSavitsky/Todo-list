const addTaskButton = document.getElementById("addTaskButton");
const addTaskForm = document.querySelector("#addTaskForm");
const popup = document.querySelector(".popup");

const submitTaskButton = document.getElementById("createTaskButton");
const newTaskInput = document.getElementById("newTaskInput");
const dropdownItem = document.getElementById("dropdown-item1");

const secondTbody = document.getElementById("secondTbody");
let dropdownButtons = [];

//Creating an array of tasks and populating the created tasks from local storage
let tasks;
!localStorage.tasks
  ? (tasks = [])
  : (tasks = JSON.parse(localStorage.getItem("tasks")));

//Tasks constructor
function Task(description) {
  this.id = tasks.length + 1;
  this.description = description;
  this.priority = "Change priority";
}

//Constructor creating a new task in the task table
const createTemplate = (task, index) => {
  let newRow = secondTbody.insertRow(-1);
  let column = newRow.insertCell(0);
  let column1 = newRow.appendChild(document.createElement("td"));
  let column2 = newRow.appendChild(document.createElement("td"));
  let column3 = newRow.appendChild(document.createElement("td"));
  column.innerHTML = task.id;
  column1.innerHTML = task.description;
  column2.innerHTML = `<div class="priorityButton">
      <button
        class="${updatePriority(index)}"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        ${tasks[index].priority}
      </button>
      <ul
        class="dropdown-menu"
        aria-labelledby="dropdownMenuButton1"
      >
        <li><a class="dropdown-item" onclick="changePriority(${index}, 'Todo')" href="#">Todo</a></li>
        <li><a class="dropdown-item" onclick="changePriority(${index}, 'In progress')" href="#">In progress</a></li>
        <li><a class="dropdown-item" onclick="changePriority(${index}, 'Done')" href="#">Done</a></li>
      </ul>`;
  column3.innerHTML = `<div class="buttons">
      <button
        name="editTaskButton"
        type="button"
        class="btn btn-outline-warning"
      >
        Edit
      </button>
      <button
        name="deleteTaskButton"
        type="button"
        class="btn btn-outline-danger"
      >
        Delete
      </button>
  </div>`;
};

//Fill to do list
const fillTodoList = () => {
  secondTbody.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((item, index) => {
      createTemplate(item, index);
    });
    dropdownButtons = document.querySelectorAll("#dropdownMenuButton");
  }
};

//Show hiden form for add new task
addTaskButton.addEventListener("click", () => {
  addTaskForm.classList.add("open");
  popup.classList.add("popup_open");
});

//Update local storage with new tasks
const updateLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//Closed hiden form and add new tusk
submitTaskButton.addEventListener("click", () => {
  tasks.push(new Task(newTaskInput.value));
  newTaskInput.value = "";
  popup.classList.remove("popup_open");
  
  updateLocal();
  fillTodoList();
});

//Change priority with dropdown button
function changePriority(index, priority) {
  tasks[index].priority = priority;
  dropdownButtons[index].innerHTML = tasks[index].priority;

  dropdownButtons[index].classList = updatePriority(index) + " show";
  updateLocal();
}

//Update classes(styles) dropdown buttons
const updatePriority = (index) => {
  if (tasks[index].priority == "Todo") {
    return "btn btn-info dropdown-toggle";
  } else if (tasks[index].priority == "In progress") {
    return "btn btn-warning dropdown-toggle";
  } else if (tasks[index].priority == "Done") {
    return "btn btn-success dropdown-toggle";
  } else if (tasks[index].priority == "Change priority") {
    return "btn btn-secondary dropdown-toggle";
  }

  updateLocal();
};

//Refresh task list on reboot
fillTodoList();
