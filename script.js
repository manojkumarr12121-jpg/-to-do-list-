// store all tasks
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// store current filter
let currentFilter = 'all';

// save tasks to localStorage
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

// show task counter
const updateCounter = () => {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  document.getElementById('taskCounter').textContent = `✅ ${completed} of ${total} tasks completed`;
};

// filter button click
const setFilter = (filter, btn) => {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTodos();
};

// get filtered tasks based on current filter
const getFiltered = () => {
  const allTodos = todos.map((t, i) => ({ ...t, index: i }));

  if (currentFilter === 'all') return allTodos;
  if (currentFilter === 'completed') return allTodos.filter(t => t.completed);
  return allTodos.filter(t => t.priority === currentFilter);
};

// show all tasks on screen
const renderTodos = () => {
  const list = document.getElementById('todoList');
  const emptyMsg = document.getElementById('emptyMsg');
  const filtered = getFiltered();

  list.innerHTML = '';
  updateCounter();

  if (filtered.length === 0) {
    emptyMsg.classList.add('visible');
    return;
  }

  emptyMsg.classList.remove('visible');

  filtered.forEach(todo => {
    const index = todo.index;
    const li = document.createElement('li');
    const badgeLabel = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

    li.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;

    if (todo.editing) {
      // edit mode
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <input class="edit-input" type="text" value="${escapeHtml(todo.text)}" id="edit-${index}" />
        <select class="edit-priority" id="editPriority-${index}">
          <option value="low"    ${todo.priority === 'low'    ? 'selected' : ''}>🟢 Low</option>
          <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
          <option value="high"   ${todo.priority === 'high'   ? 'selected' : ''}>🔴 High</option>
        </select>
        <button class="btn-update" onclick="updateTodo(${index})">Update</button>
        <button class="btn-delete" onclick="deleteTodo(${index})">Delete</button>
      `;

      // focus edit input
      setTimeout(() => {
        const inp = document.getElementById(`edit-${index}`);
        if (inp) inp.focus();
      }, 0);

      // enter to save, escape to cancel
      li.querySelector('.edit-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') updateTodo(index);
        if (e.key === 'Escape') cancelEdit(index);
      });

    } else {
      // normal mode
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <span class="priority-badge badge-${todo.priority}">${badgeLabel}</span>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="btn-edit" onclick="startEdit(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteTodo(${index})">Delete</button>
      `;
    }

    list.appendChild(li);
  });

  // enable drag and drop after tasks are shown
  addDragAndDrop();
};

// add new task
const addTodo = () => {
  const input = document.getElementById('todoInput');
  const priority = document.getElementById('prioritySelect').value;
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({ text, priority, completed: false, editing: false });
  input.value = '';
  input.focus();

  saveTodos();
  renderTodos();
};

// tick or untick task
const toggleComplete = (index) => {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
};

// click edit button
const startEdit = (index) => {
  todos.forEach((t, i) => { t.editing = i === index; });
  renderTodos();
};

// click update button to save edited task
const updateTodo = (index) => {
  const editInput = document.getElementById(`edit-${index}`);
  const editPriority = document.getElementById(`editPriority-${index}`);

  if (!editInput) return;

  const newText = editInput.value.trim();
  if (!newText) {
    editInput.focus();
    return;
  }

  todos[index].text = newText;
  todos[index].priority = editPriority.value;
  todos[index].editing = false;

  saveTodos();
  renderTodos();
};

// cancel edit mode
const cancelEdit = (index) => {
  todos[index].editing = false;
  saveTodos();
  renderTodos();
};

// delete a task
const deleteTodo = (index) => {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
};

// clear all completed tasks
const clearCompleted = () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
};
// drag and drop to reorder tasks
const addDragAndDrop = () => {
  const items = document.querySelectorAll('.todo-item');
  let draggedIndex = null;

  items.forEach((item, i) => {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', () => {
      draggedIndex = i;
      setTimeout(() => item.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', () => {
      item.classList.remove('drag-over');
      if (draggedIndex === null || draggedIndex === i) return;

      const dragged = todos.splice(draggedIndex, 1)[0];
      todos.splice(i, 0, dragged);

      draggedIndex = null;
      saveTodos();
      renderTodos();
    });
  });
};

// remove special characters from text
const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// press enter to add task
document.getElementById('todoInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// load tasks when page opens
renderTodos();