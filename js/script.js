const btnAdd = document.querySelector('.btn__add'),
    inputAdd = document.querySelector('.input__add'),
    inputDate = document.querySelector('#data__input'),
    btnClear = document.querySelector('.btn__refresh'),
    taskRefreshSelector = document.querySelector('.task__refresh'),
    tasksContainer = document.querySelector('.tasks__container'),
    filterSelect = document.querySelector('.filter'),
    todaySelector = document.querySelector('.today'),
    dateInput = document.createElement('input');

let currentFilter = "all"; 
let taskIdCounter = generateRandomId();
let tasks = [];

function generateRandomId() {
    return Math.floor(Math.random() * Date.now()).toString();
}

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    renderTasks();
}

btnClear.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

inputAdd.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

btnAdd.addEventListener("click", () => {
    addTask();
});

function addTask() {
    const taskText = inputAdd.value.trim();

    if (taskText !== "") {
        taskIdCounter++;
        const task = {
            id: taskIdCounter,
            text: taskText,
            completed: false,
            date: dateInput.value
        };

        tasks.push(task);

        saveTasks();
        newRender();

        inputAdd.value = "";

        inputAdd.classList.remove('error');
    } else {
        inputAdd.classList.add('error');
        
    }
}

function setToday() {
    const today = new Date()
        day = today.getDate(),
        month = (today.getMonth() + 1).toString().padStart(2, '0'),
        year = today.getFullYear();

    const todayElement = document.createElement('div');

    const selectedDate = new Date(dateInput.value);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const todayString = selectedDate.toLocaleDateString('en-US', options);
    
    todaySelector.innerHTML = `<div><p>${todayString}</p></div>`;

    dateInput.type = 'date';
    dateInput.value = `${year}-${month}-${day}`;
    dateInput.classList.add('input__bgc');
    todayElement.appendChild(dateInput);

    todaySelector.appendChild(todayElement); 
}
function newRender() {
    const selectedDate = new Date(dateInput.value);
    const selectedDateTasks = tasks.filter(task => isSameDate(task.date, selectedDate));

    renderTasks(selectedDateTasks);
}
dateInput.addEventListener("change", () => {
    newRender();
    updateToday();
});

function isSameDate(taskDate, selectedDate) {
    const taskDateTime = new Date(taskDate);
    return (
        taskDateTime.getFullYear() === selectedDate.getFullYear() &&
        taskDateTime.getMonth() === selectedDate.getMonth() &&
        taskDateTime.getDate() === selectedDate.getDate()
    );
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskById(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        
        renderTasks();
    }
}

function updateToday() {
    const selectedDate = new Date(dateInput.value);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const todayString = selectedDate.toLocaleDateString('en-US', options);
    
    todaySelector.querySelector('p').textContent = todayString;
}

function checkedTaskById(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
    }
}

function editTaskById(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    const newText = document.querySelectorAll('.text');
    
    

    if (taskIndex !== -1) {
        const newArr = Array.from(newText);
        
        newArr[taskIndex].setAttribute('contenteditable', true);
        
        newText[taskIndex].focus();
        
        newText[taskIndex].addEventListener('keypress', (e) => {
            if (e.key === "Enter") {
                tasks[taskIndex].text = newText[taskIndex].textContent;
                
                saveTasks();
                newRender();
                newText[taskIndex].setAttribute('contenteditable', false);  
            }
        });
        newText[taskIndex].addEventListener('blur', (e) => {
            tasks[taskIndex].text = newText[taskIndex].textContent;
            saveTasks();
            newRender();
            newText[taskIndex].setAttribute('contenteditable', false);  
        });
    }
}

function renderTasks(filteredTasks = tasks) {

    tasksContainer.innerHTML = "";

    filteredTasks.forEach(function (task, i) {
        if (
            (currentFilter === "complated" && task.completed) ||
            (currentFilter === "uncomplated" && !task.completed) ||
            currentFilter === "all"
        ) {
            const taskElement = document.createElement("div");
           
            tasksContainer.appendChild(taskElement);
           
            taskElement.classList.add("task");
    
            taskElement.innerHTML = `
            <span class="text ${task.completed ? 'text__line' : ''}" data-index="${i}">${task.text}</span>
            <input type="checkbox" data-index="${i}" class="checkbox" ${task.completed ? "checked" : ""}>
                <button class="btn__delete" data-index="${i}"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
                <button class="btn__edit" data-index="${i}" class="editBtn"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="#000000"></path></g></svg>
                </button>
            `;
            document.querySelectorAll('.text').forEach(item => {
                item.classList.add('owerflowWrap');
            });

            tasksContainer.appendChild(taskElement);
            
            const deleteBtn = taskElement.querySelector(".btn__delete");
            deleteBtn.addEventListener("click", () => {
                const taskId = task.id;
                deleteTaskById(taskId);
                saveTasks();
                newRender();
            });
    
            const checkbox = taskElement.querySelectorAll(".checkbox");
            checkbox.forEach(item => {
                item.addEventListener("change", () => {
                    const taskId = task.id;
                    checkedTaskById(taskId);
                    saveTasks();
                    newRender();
                });
            })
            const newText = document.querySelector('.text');
            const editBtn = taskElement.querySelector(".btn__edit");

            editBtn.addEventListener("click", (e) =>  {
                const taskId = task.id;
                editTaskById(taskId);
                saveTasks();
            });  
        }
    });
}

filterSelect.addEventListener("change", (event) => {
    currentFilter = event.target.value;
    newRender(); 
});

setToday(); 
newRender();
updateToday();
