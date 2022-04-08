const addTaskButton = document.getElementById("addTaskButton");
const addTaskForm = document.querySelector("#addTaskForm");
const popup = document.querySelector(".popup");

const submitTaskButton = document.getElementById("createTaskButton");
const newTaskInput = document.getElementById("newTaskInput");
const todosWrapper = document.querySelector(".todos-wrapper");

let tasksTable = document.getElementById("tasksTable");
let secondTbody = document.getElementById("secondTbody");

let tasks;
!localStorage.tasks
  ? (tasks = [])
  : (tasks = JSON.parse(localStorage.getItem("tasks")));

function Task(description) {
  this.id = 0;
  this.description = description;
  this.priority = "Todo";
}

const createTemplate = (task, index) => {
  var specific_tbody = secondTbody;
  var newRow = specific_tbody.insertRow(-1);

  var column = newRow.insertCell(0);

  let column1 = newRow.appendChild(document.createElement("td"));
  let column2 = newRow.appendChild(document.createElement("td"));
  let column3 = newRow.appendChild(document.createElement("td"));
  column.innerHTML = index;
  column1.innerHTML = task.description;
  column2.innerHTML = `<div class="priority">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Change Priority
      </button>
      <ul
        class="dropdown-menu"
        aria-labelledby="dropdownMenuButton1"
      >
        <li><a class="dropdown-item" href="#">Todo</a></li>
        <li><a class="dropdown-item" href="#">In progress</a></li>
        <li><a class="dropdown-item" href="#">Done</a></li>
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

const fillTodoList = () => {
  todosWrapper.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((item, index) => {
      todosWrapper.innerHTML += createTemplate(item, index);
    });
  }
};

addTaskButton.addEventListener("click", () => {
  addTaskForm.classList.add("open");
  popup.classList.add("popup_open");
});

const updateLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

submitTaskButton.addEventListener("click", () => {
  tasks.push(new Task(newTaskInput.value));
  updateLocal();
  fillTodoList();
  popup.classList.remove("popup_open");
});