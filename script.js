// ===== State =====
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// ===== Save to localStorage =====
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ===== Render all todos =====
function renderTodos() {
  const list = document.getElementById('todoList');
  const emptyMsg = document.getElementById('emptyMsg');

  list.innerHTML = '';

  if (todos.length === 0) {
    emptyMsg.classList.add('visible');
    return;
  }

  emptyMsg.classList.remove('visible');

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    if (todo.editing) {
      // ---- EDIT MODE ----
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
        <input class="edit-input" type="text" value="${escapeHtml(todo.text)}" id="edit-${index}" />
        <button class="btn-update" onclick="updateTodo(${index})">Update</button>
        <button class="btn-delete" onclick="deleteTodo(${index})">Delete</button>
      `;

      // Focus the edit input after render
      setTimeout(() => {
        const input = document.getElementById(`edit-${index}`);
        if (input) {
          input.focus();
          input.selectionStart = input.value.length;
        }
      }, 0);

      // Allow pressing Enter to save
      const editInput = li.querySelector('.edit-input');
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') updateTodo(index);
        if (e.key === 'Escape') cancelEdit(index);
      });

    } else {
      // ---- NORMAL MODE ----
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})" />
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
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({ text, completed: false, editing: false });
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
  // Close any other open edits first
  todos.forEach((t, i) => { if (i !== index) t.editing = false; });
  todos[index].editing = true;
  renderTodos();
}

// ===== Save Updated Text =====
function updateTodo(index) {
  const editInput = document.getElementById(`edit-${index}`);
  const newText = editInput ? editInput.value.trim() : '';

  if (!newText) {
    editInput.focus();
    return;
  }

  todos[index].text = newText;
  todos[index].editing = false;

  saveTodos();
  renderTodos();
}

// ===== Cancel Edit (Escape key) =====
function cancelEdit(index) {
  todos[index].editing = false;
  saveTodos();
  renderTodos();
}

// ===== Delete Todo =====
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// ===== Helper: Escape HTML to prevent XSS =====
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== Allow pressing Enter in add input =====
document.getElementById('todoInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// ===== Initial Render =====
renderTodos();