document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);
    clearAllBtn.addEventListener('click', clearAllTasks);
    deleteSelectedBtn.addEventListener('click', deleteSelectedTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const li = createTaskElement(taskText);
        taskList.appendChild(li);

        saveTasks();
        taskInput.value = '';
        updateButtonsVisibility();
    }

    function handleTaskClick(e) {
        if (e.target.closest('.delete-btn')) {
            e.target.closest('li').remove();
            saveTasks();
            updateButtonsVisibility();
        } else if (e.target.closest('.edit-btn')) {
            const li = e.target.closest('li');
            const taskText = li.childNodes[1];
            const newTaskText = prompt('Edit your task', taskText.nodeValue.trim());
            if (newTaskText !== null && newTaskText.trim() !== '') {
                taskText.nodeValue = newTaskText;
                saveTasks();
            }
        } else if (e.target.tagName === 'INPUT') {
            e.target.parentElement.classList.toggle('completed');
            saveTasks();
        }
    }

    function deleteSelectedTasks() {
        document.querySelectorAll('#taskList li.completed').forEach(li => li.remove());
        saveTasks();
        updateButtonsVisibility();
    }

    function clearAllTasks() {
        taskList.innerHTML = '';
        saveTasks();
        updateButtonsVisibility();
    }

    function createTaskElement(taskText) {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const textNode = document.createTextNode(taskText);

        const editBtn = document.createElement('button');
        editBtn.classList.add('icon-btn', 'edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('icon-btn', 'delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

        li.appendChild(checkbox);
        li.appendChild(textNode);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.childNodes[1].nodeValue,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = createTaskElement(task.text);
            if (task.completed) {
                li.classList.add('completed');
                li.querySelector('input').checked = true;
            }
            taskList.appendChild(li);
        });
        updateButtonsVisibility();
    }

    function updateButtonsVisibility() {
        if (taskList.children.length === 0) {
            deleteSelectedBtn.style.display = 'none';
            clearAllBtn.style.display = 'none';
        } else {
            deleteSelectedBtn.style.display = 'block';
            clearAllBtn.style.display = 'block';
        }
    }
});
