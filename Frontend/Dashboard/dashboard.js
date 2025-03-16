document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
})
let id = 1;

function createTodoElement(){
    const todo = document.createElement("li");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const button = document.createElement("button");

    button.setAttribute("id", "unfinished");
    title.setAttribute("id", `title-${id}`);
    description.setAttribute("id", `description-${id}`);
    id++;

    todo.appendChild(title);
    todo.appendChild(description);
    todo.appendChild(button);

    return todo;
}


async function addTodo(){
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const token = localStorage.getItem("token");
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title,
            description
        })
    }

    const response = await fetch("http://localhost:3000/todo/create", options);
    const data = await response.json();
    loadTodos();
}

async function loadTodos(){
    const todos = document.getElementById("todos-list");
    todos.innerHTML = ""
    const token = localStorage.getItem("token");
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Cotent-type": "application/json"
        }
    }

    const response = await fetch("http://localhost:3000/todo/allTodos", options);
    const data = await response.json();

    data.todos.forEach(element => {
        const todo = createTodoElement();
        todo.children[0].innerText = element.title;
        todo.children[1].innerText = element.description;
        todo.children[2].innerText = element.status ? "Finished" : "Finish";
        todo.setAttribute("id", `${element._id}`);
        todos.appendChild(todo);
    });
}