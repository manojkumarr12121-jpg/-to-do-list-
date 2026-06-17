// ===== State =====
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ===== Save to localStorage =====
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
// ===== Update Task Counter =====
function updateCounter() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  document.getElementById('taskCounter').textContent = 
    `✅ ${completed} of ${total} tasks completed`;
}

// ===== Set Filter =====
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTodos();
}

// ===== Get Filtered Todos =====
function getFiltered() {
  if (currentFilter === 'all') return todos.map((t, i) => ({ ...t, index: i }));
  if (currentFilter === 'completed') return todos.map((t, i) => ({ ...t, index: i })).filter(t => t.completed);
  return todos.map((t, i) => ({ ...t, index: i })).filter(t => t.priority === currentFilter);
}

// ===== Render all todos =====
function renderTodos() {
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

  filtered.forEach((todo) => {
    const index = todo.index;
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority}` + (todo.completed ? ' completed' : '');

    const badgeClass = `badge-${todo.priority}`;
    const badgeLabel = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

    if (todo.editing) {
      // ---- EDIT MODE ----
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <input class="edit-input" type="text" value="${escapeHtml(todo.text)}" id="edit-${index}" />
        <select class="edit-priority" id="editPriority-${index}">
          <option value="low"  ${todo.priority === 'low'    ? 'selected' : ''}>🟢 Low</option>
          <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
          <option value="high" ${todo.priority === 'high'   ? 'selected' : ''}>🔴 High</option>
        </select>
        <button class="btn-update" onclick="updateTodo(${index})">Update</button>
        <button class="btn-delete" onclick="deleteTodo(${index})">Delete</button>
      `;

      setTimeout(() => {
        const input = document.getElementById(`edit-${index}`);
        if (input) { input.focus(); input.selectionStart = input.value.length; }
      }, 0);

      li.querySelector('.edit-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') updateTodo(index);
        if (e.key === 'Escape') cancelEdit(index);
      });

    } else {
      // ---- NORMAL MODE ----
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <span class="priority-badge ${badgeClass}">${badgeLabel}</span>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="btn-edit" onclick="startEdit(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteTodo(${index})">Delete</button>
      `;
    }

    list.appendChild(li);
  });
}

// ===== Add Todo =====
function addTodo() {
  const input = document.getElementById('todoInput');
  const priority = document.getElementById('prioritySelect').value;
  const text = input.value.trim();

  if (!text) { input.focus(); return; }

  todos.push({ text, priority, completed: false, editing: false });
  input.value = '';
  input.focus();

  saveTodos();
  renderTodos();
}

// ===== Toggle Complete =====
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// ===== Start Edit Mode =====
function startEdit(index) {
  todos.forEach((t, i) => { if (i !== index) t.editing = false; });
  todos[index].editing = true;
  renderTodos();
}

// ===== Save Updated Task =====
function updateTodo(index) {
  const editInput = document.getElementById(`edit-${index}`);
  const editPriority = document.getElementById(`editPriority-${index}`);
  const newText = editInput ? editInput.value.trim() : '';

  if (!newText) { editInput.focus(); return; }

  todos[index].text = newText;
  todos[index].priority = editPriority ? editPriority.value : todos[index].priority;
  todos[index].editing = false;

  saveTodos();
  renderTodos();
}

// ===== Cancel Edit =====
function cancelEdit(index) {
  todos[index].editing = false;
  saveTodos();
  renderTodos();
}


 

// ===== Drag and Drop =====
function addDragAndDrop() {
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


addDragAndDrop();
}

// ===== Delete Todo =====
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// ===== Helper: Escape HTML =====
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== Enter key on add input =====
document.getElementById('todoInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// ===== Initial Render =====
renderTodos();