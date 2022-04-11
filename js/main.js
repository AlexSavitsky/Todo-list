const addTaskButton = document.getElementById("addTaskButton");
const addTaskForm = document.querySelector("#addTaskForm");
const popup = document.querySelector(".popup");
const closeTaskButton = document.getElementById("closeTaskForm");

const submitTaskButton = document.getElementById("createTaskButton");
const newTaskInput = document.getElementById("newTaskInput");

const secondTbody = document.getElementById("secondTbody");

const priorities = {
  TODO: "Todo",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  CHANGE_PRIORITY: "Change priority",
};

let dropdownButtons;

//Creating an array of tasks and populating the created tasks from local storage
let tasks;
!localStorage.tasks
  ? (tasks = [])
  : (tasks = JSON.parse(localStorage.getItem("tasks")));

//Tasks constructor
class Task {
  constructor(description, id) {
    this.id = id;
    this.description = description;
    this.priority = "Change priority";
  }
}

//Constructor creating a new task in the task table
const createTemplate = (task, index) => {
  const newRow = secondTbody.insertRow(-1);
  const column = newRow.insertCell(0);
  const column1 = newRow.appendChild(document.createElement("td"));
  const column2 = newRow.appendChild(document.createElement("td"));
  const column3 = newRow.appendChild(document.createElement("td"));
  tasks[index].id = index + 1;
  column.innerHTML = task.id;
  column1.innerHTML = `<div name="description" type="button" onclick="editTaskDescription(${index})">${task.description}</div>`;
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
  if (newTaskInput.value === "") {
    wrongTaskInput(newTaskInput);
  } else {
    tasks.push(new Task(newTaskInput.value, tasks.length));
    newTaskInput.value = "";
    newTaskInput.classList.remove("wrongInput");
    popup.classList.remove("popup_open");
    updateLocal();
    fillTodoList();
  }
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
  if (tasks[index].priority === priorities.TODO) {
    doneRow[index + 1].classList.remove("done");
    return "btn btn-info dropdown-toggle";
  } else if (tasks[index].priority === priorities.IN_PROGRESS) {
    doneRow[index + 1].classList.remove("done");
    return "btn btn-warning dropdown-toggle";
  } else if (tasks[index].priority === priorities.DONE) {
    doneRow[index + 1].classList.add("done");
    return "btn btn-success dropdown-toggle";
  } else if (tasks[index].priority === priorities.CHANGE_PRIORITY) {
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
    tasks.length &&
    tasks.filter((item) => item.priority === priorities.CHANGE_PRIORITY);
  const inProgressTasks =
    tasks.length &&
    tasks.filter((item) => item.priority === priorities.IN_PROGRESS);
  const toDoTasks =
    tasks.length && tasks.filter((item) => item.priority === priorities.TODO);
  const doneTasks =
    tasks.length && tasks.filter((item) => item.priority === priorities.DONE);
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
  <form  onsubmit="return updateDescription(${index}, this)">
  <input class="form-control input" name="newDescription" value="${tasks[index].description}">
  </form>`;
};

//Update description in task array
const updateDescription = (index, form) => {
  if (form.newDescription.value === "") {
    wrongTaskInput(form.getElementsByTagName("input")[0]);
    form.newDescription.value = tasks[0].description;
    return false;
  } else {
    tasks[index].description = form.newDescription.value;
    updateLocal();
    fillTodoList();
    return true;
  }
};

//Add new style for empty inputs
const wrongTaskInput = (imput) => {
  imput.classList.add("wrongInput");
  imput.placeholder = "Enter task name";
  setTimeout(() => {
    imput.classList.remove("wrongInput");
  }, 1000);
};

//Refresh task list on reboot
fillTodoList();
