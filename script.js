const taskInputInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('addTask');
const taskListsColumn = document.getElementById('task-lists');
const inProgressColumn = document.getElementById('inProgress');
const completedColumn = document.getElementById('completed');

addTaskButton.addEventListener('click', handleAddTask);

function handleAddTask() {
    const taskInput = taskInputInput.value.trim();
    if (taskInput !== '') {
        const taskElement = createTaskElement(taskInput);
        taskListsColumn.appendChild(taskElement);
        taskInputInput.value = '';
    }
}

function createTaskElement(task, isCompleted = false) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    if (isCompleted) {
        taskElement.classList.add('completed');
    } else {
        taskElement.draggable = true;
        taskElement.addEventListener('dragstart', handleDragStart);
    }

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task;
    taskElement.appendChild(taskText);

    const editBtn = document.createElement('span');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    if (!isCompleted) {
        editBtn.addEventListener('click', handleEdit);
    } else {
        editBtn.classList.add('disabled');
        editBtn.style.pointerEvents = 'none';
    }
    taskElement.appendChild(editBtn);

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', handleDelete);
    if (isCompleted) {
        deleteBtn.classList.add('disabled');
        deleteBtn.style.pointerEvents = 'none';
    }
    taskElement.appendChild(deleteBtn);
    
    return taskElement;
}

function handleEdit(e) {
    const taskElement = e.target.closest('.task');
    const taskText = taskElement.querySelector('.task-text');
    const newText = prompt('Edit task:', taskText.textContent);
    if (newText !== null && newText.trim() !== '') {
        taskText.textContent = newText.trim();
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.querySelector('.task-text').textContent);
    e.dataTransfer.setData('sourceColumn', e.target.closest('.column').id);
}

function handleDelete(e) {
    const taskElement = e.target.closest('.task');
    const taskText = taskElement.querySelector('.task-text').textContent;
    taskElement.remove();
    const completedTask = createTaskElement(taskText, true);
    completedColumn.appendChild(completedTask);
}

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', e => e.preventDefault());
    column.addEventListener('drop', handleDrop);
});

function handleDrop(e) {
    e.preventDefault();
    const task = e.dataTransfer.getData('text/plain');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    const targetColumn = e.target.closest('.column').id;
    
    if (targetColumn !== sourceColumn && targetColumn !== 'completed') {
        const taskElement = createTaskElement(task);
        e.target.closest('.column').appendChild(taskElement);
        document.getElementById(sourceColumn).querySelectorAll('.task').forEach(el => {
            if (el.querySelector('.task-text').textContent === task) {
                el.remove();
            }
        });
    }
}
