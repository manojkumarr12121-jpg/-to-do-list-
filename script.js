
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

function renderTodos() {
    let list = document.getElementById("todoList");
    let emptyMsg = document.getElementById("emptyMsg");

    // clear the list first
    list.innerHTML = "";

    if (todos.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];

        let li = document.createElement("li");

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

        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function() {
            deleteTodo(todo.id);
        };

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(btnGroup);
        list.appendChild(li);
    }
}

// also allow pressing Enter to add a todo
document.getElementById("todoInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTodo();
    }
});
