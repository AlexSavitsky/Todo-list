const addTaskButton = document.getElementById("addTaskButton");
const addTaskForm = document.querySelector("#addTaskForm");
const popup = document.querySelector(".popup");
const closeTaskButton = document.getElementById("closeTaskForm");

const submitTaskButton = document.getElementById("createTaskButton");
const newTaskInput = document.getElementById("newTaskInput");

const secondTbody = document.getElementById("secondTbody");
let dropdownButtons = [];

//Creating an array of tasks and populating the created tasks from local storage
let tasks;
!localStorage.tasks
  ? (tasks = [])
  : (tasks = JSON.parse(localStorage.getItem("tasks")));

//Tasks constructor
function Task(description, id) {
  this.id = id;
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
  tasks[index].id = index + 1;
  column.innerHTML = task.id;
  column1.innerHTML = `<div type="button" onclick="editTaskDescription(${index})">${task.description}</div>`;
  column2.innerHTML = `<button
        class="${updatePriority(index)}"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        ${task.priority}
      </button>
      <ul
        class="dropdown-menu"
      >
        <li><a class="dropdown-item" onclick="changePriority(${index}, 'Todo')">Todo</a></li>
        <li><a class="dropdown-item" onclick="changePriority(${index}, 'In progress')">In progress</a></li>
        <li><a class="dropdown-item" onclick="changePriority(${index}, 'Done')">Done</a></li>
      </ul>`;
  column3.innerHTML = `
      <button
        type="button"
        class="btn btn-outline-danger"
        onclick="deleteTask(${index})"
      >
        Delete
      </button>`;
};

//Fill to do list
const fillTodoList = () => {
  secondTbody.innerHTML = "";
  if (tasks.length > 0) {
    filterDoneTasks();
    tasks.forEach((item, index) => {
      createTemplate(item, index);
    });
    dropdownButtons = document.querySelectorAll("#dropdownMenuButton");
  }
};

//Show hiden form for add new task
addTaskButton.addEventListener("click", () => {
  newTaskInput.classList.add("open");
  popup.classList.add("popup_open");
});

//Update local storage with new tasks
const updateLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//Closed hiden form and add new tusk
submitTaskButton.addEventListener("click", () => {
  tasks.push(new Task(newTaskInput.value, tasks.length));
  newTaskInput.value = "";
  popup.classList.remove("popup_open");

  updateLocal();
  fillTodoList();
});

//Change priority with dropdown button
const changePriority = (index, priority) => {
  tasks[index].priority = priority;
  dropdownButtons[index].innerHTML = tasks[index].priority;

  dropdownButtons[index].classList = updatePriority(index) + " show";
  updateLocal();
  fillTodoList();
};

//Update classes(styles) dropdown buttons
const updatePriority = (index) => {
  const doneRow = document.getElementsByTagName("tr");
  if (tasks[index].priority == "Todo") {
    doneRow[index + 1].classList.remove("done");
    return "btn btn-info dropdown-toggle";
  } else if (tasks[index].priority == "In progress") {
    doneRow[index + 1].classList.remove("done");
    return "btn btn-warning dropdown-toggle";
  } else if (tasks[index].priority == "Done") {
    doneRow[index + 1].classList.add("done");
    return "btn btn-success dropdown-toggle";
  } else if (tasks[index].priority == "Change priority") {
    return "btn btn-secondary dropdown-toggle";
  }

  updateLocal();
};

//Close add task form
closeTaskButton.addEventListener("click", () => {
  popup.classList.remove("popup_open");
});

//Delete task from task list
const deleteTask = (index) => {
  const doneRow = document.getElementsByTagName("tr");
  doneRow[index + 1].classList.add("delitionItem");
  setTimeout(() => {
    tasks.splice(index, 1);
    updateLocal();
    fillTodoList();
  }, 500);
};

//FIlter tasks (change priority -> in progress -> todo -> done)
const filterDoneTasks = () => {
  const changePriorityTasks =
    tasks.length && tasks.filter((item) => item.priority == "Change priority");
  const inProgressTasks =
    tasks.length && tasks.filter((item) => item.priority == "In progress");
  const toDoTasks =
    tasks.length && tasks.filter((item) => item.priority == "Todo");
  const doneTasks =
    tasks.length && tasks.filter((item) => item.priority == "Done");
  tasks = [
    ...changePriorityTasks,
    ...inProgressTasks,
    ...toDoTasks,
    ...doneTasks,
  ];
};

//Edit task description
const editTaskDescription = (index) => {
  const doneRow = document.getElementsByTagName("tr");
  const descriptionColumn = doneRow[index + 1].getElementsByTagName("td");
  descriptionColumn[1].innerHTML = `
  <form  onchange="updateDescription(${index}, this)">
  <input  name="newDescription" value="${tasks[index].description}">
  </form>`;
  
  updateLocal();
};

//Update description in task array
const updateDescription = (index, form) => {
  tasks[index].description = form.newDescription.value;
  
  updateLocal();
  fillTodoList();
};


//Refresh task list on reboot
fillTodoList();
