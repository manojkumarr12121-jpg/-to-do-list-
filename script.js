let currentFilter = 'all';

function addTodo() {
  const input = document.getElementById('todoInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const text = input.value.trim();
  const priority = prioritySelect.value;

  if (text === '') return;

  const li = createTaskElement(text, priority);
  document.getElementById('todoList').appendChild(li);

  input.value = '';
  prioritySelect.value = 'medium';

  updateEmptyMessage();
  applyFilter(currentFilter);
}

function createTaskElement(text, priority) {
  const li = document.createElement('li');
  li.classList.add('todo-item', `priority-${priority}`);
  li.dataset.priority = priority;

  // Priority badge
  const badge = document.createElement('span');
  badge.classList.add('priority-badge', `badge-${priority}`);
  const labels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
  badge.textContent = labels[priority];

  // Task text
  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = text;

  // Complete button
  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✔';
  completeBtn.classList.add('complete-btn');
  completeBtn.onclick = () => {
    li.classList.toggle('completed');
  };

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = () => {
    li.remove();
    updateEmptyMessage();
  };

  li.appendChild(badge);
  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);

  return li;
}

function filterTasks(priority) {
  currentFilter = priority;

  // Update active button style
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter-${priority}`).classList.add('active');

  applyFilter(priority);
}

function applyFilter(priority) {
  const items = document.querySelectorAll('.todo-item');
  items.forEach(item => {
    if (priority === 'all' || item.dataset.priority === priority) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function updateEmptyMessage() {
  const list = document.getElementById('todoList');
  const msg = document.getElementById('emptyMsg');
  msg.style.display = list.children.length === 0 ? 'block' : 'none';
}