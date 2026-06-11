let todos = [];

function addTodo() {
    let input = document.getElementById("todoInput");
    let text = input.value.trim();

    if (text === "") {
        alert("Please enter something!");
        return;
    }

    let todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    input.value = "";
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });
    renderTodos();
}

function completeTodo(id) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].completed = !todos[i].completed;
            break;
        }
    }
    renderTodos();
}

// ✏️ NEW: Edit function
function editTodo(id) {
    let list = document.getElementById("todoList");
    let items = list.getElementsByTagName("li");

    for (let i = 0; i < items.length; i++) {
        let li = items[i];

        if (li.dataset.id == id) {
            let span = li.querySelector(".todo-text");
            let btnGroup = li.querySelector(".btn-group");
            let currentText = span.textContent;

            // Replace span with input field
            let editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = currentText;
            editInput.classList.add("edit-input");

            li.replaceChild(editInput, span);

            // Replace Edit button with Save button
            let saveBtn = document.createElement("button");
            saveBtn.textContent = "Save";
            saveBtn.classList.add("save-btn");
            saveBtn.onclick = function() {
                saveTodo(id, editInput);
            };

            // Find and replace the edit button with save button
            let editBtn = btnGroup.querySelector(".edit-btn");
            btnGroup.replaceChild(saveBtn, editBtn);

            // Focus the input
            editInput.focus();
            break;
        }
    }
}

// ✏️ NEW: Save function
function saveTodo(id, editInput) {
    let newText = editInput.value.trim();

    if (newText === "") {
        alert("Task cannot be empty!");
        return;
    }

    // Update the todos array
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].text = newText;
            break;
        }
    }

    renderTodos();
}

function renderTodos() {
    let list = document.getElementById("todoList");
    let emptyMsg = document.getElementById("emptyMsg");

    list.innerHTML = "";

    if (todos.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];

        let li = document.createElement("li");
        li.dataset.id = todo.id; // ✏️ NEW: store id on li element

        let span = document.createElement("span");
        span.classList.add("todo-text");
        span.textContent = todo.text;

        if (todo.completed) {
            span.classList.add("done");
        }

        let btnGroup = document.createElement("div");
        btnGroup.classList.add("btn-group");

        let completeBtn = document.createElement("button");
        completeBtn.classList.add("complete-btn");
        completeBtn.textContent = todo.completed ? "Undo" : "Done";
        completeBtn.onclick = function() {
            completeTodo(todo.id);
        };

        // ✏️ NEW: Edit button
        let editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";
        editBtn.onclick = function() {
            editTodo(todo.id);
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function() {
            deleteTodo(todo.id);
        };

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(editBtn); // ✏️ NEW
        btnGroup.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(btnGroup);
        list.appendChild(li);
    }
}

document.getElementById("todoInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTodo();
    }
});
