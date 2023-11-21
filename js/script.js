const btnAdd = document.querySelector('.btn__add'),
        inputAdd = document.querySelector('.input__add'),
        inputDate = document.querySelector('#data__input'),
        btnClear = document.querySelector('.btn__refresh'),
        taskRefreshSelector = document.querySelector('.task__refresh'),
        tasksContainer = document.querySelector('.tasks__container'),
        filterSelect = document.querySelector('.filter'),
        todaySelector = document.querySelector('.today');

let tasks = [];

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    renderTasks();
}

btnClear.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

btnAdd.addEventListener("click", () => {
    const taskText = inputAdd.value.trim();
    
    if (taskText !== "" && inputDate.value !== "") {
        const task = { 
            text: taskText, 
            completed: false, 
            date: inputDate.value 
        };
       
        console.log(inputDate.value);

        tasks.push(task);

        saveTasks();
        renderTasks();
        
        inputAdd.value = "";
        inputDate.value = "";
        inputDate.classList.remove('error');
    } else {
        alert('Вы не выбрали дату!');
        inputDate.classList.add('error');
    }
});

function setToday() {
    const today = new Date(),
          day = today.getDate();

    const dayOfWeek = today.getDay() - 1,
          daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          dayName = daysOfWeek[dayOfWeek];

    const monthName = today.toLocaleString('en', { month: 'short' });

    const todayElement = document.createElement('div');

    todayElement.innerHTML = `
        <p>${dayName}, ${monthName} ${day}</p>
    `;

    todaySelector.appendChild(todayElement);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    tasksContainer.innerHTML = "";

tasks.forEach(function (task, i) {
    if (
        filterSelect.value === "complated" && task.completed ||
        filterSelect.value === "uncomplated" && !task.completed ||
        filterSelect.value === "all"
    ) {

    const taskElement = document.createElement("div");

    taskElement.classList.add("task");

    taskElement.innerHTML = `
        <span class="text ${task.completed ? 'text__line' : ''}">${task.text}</span>
        <span class="data">${task.date}</span>
        <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
        <button class="btn__delete" data-index="${i}"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>
        <button class="btn__edit" data-index="${i}" class="editBtn"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="#000000"></path></g></svg>
        </button>
    `;
    tasksContainer.appendChild(taskElement);

    const deleteBtn = taskElement.querySelector(".btn__delete");
    deleteBtn.addEventListener("click", () => {
        tasks.splice(i, 1);
        saveTasks();
        renderTasks();
    });

    const checkbox = taskElement.querySelector(".checkbox");
    checkbox.addEventListener("change", () => {
        tasks[i].completed = !tasks[i].completed;

        saveTasks();
        renderTasks();
    });

    const editBtn = taskElement.querySelector(".btn__edit");
    
    editBtn.addEventListener("click", () =>  {
        const newText = prompt("Edit task:", task.text);
        
        tasks[i].text = newText;
        saveTasks();
        renderTasks();  
    });
    }
});
}

filterSelect.addEventListener("change", renderTasks);

setToday();

    





