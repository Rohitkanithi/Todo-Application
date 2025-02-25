let unOrderedListEl = document.getElementById("unOrderedList");
let addButtonTodoEl = document.getElementById("addButtonTodo");
let saveButton = document.getElementById("saveButton");

// Function to retrieve and parse the saved to-do list from localStorage
function stringToParse() {
    let stringified = localStorage.getItem("text");
    if (!stringified) { // Ensure localStorage is not null
        return [];
    }
    let parsified = JSON.parse(stringified);
    return Array.isArray(parsified) ? parsified : []; // Ensure it returns an array
}

let todolist = stringToParse();

// Function to save the to-do list to localStorage
function saveTodos() {
    localStorage.setItem("text", JSON.stringify(todolist));
}

// Save button click event
saveButton.onclick = saveTodos;

// Function to handle checkbox status change
function onTodoStatusChange(myCheckBox, labelid, uniqueNo) {
    let labelidEl = document.getElementById(labelid);
    labelidEl.classList.toggle("checked");

    let todoIndex = todolist.findIndex(todo => todo.uniqueNo === uniqueNo);
    if (todoIndex !== -1) {
        todolist[todoIndex].isChecked = document.getElementById(myCheckBox).checked;
    }

    saveTodos(); // Save state after change
}

// Function to delete a to-do item
function deleteTodo(listid) {
    let listidEl = document.getElementById(listid);
    if (listidEl) {
        unOrderedListEl.removeChild(listidEl);
    }

    let deleteIndex = todolist.findIndex(eachItem => "list" + eachItem.uniqueNo === listid);
    if (deleteIndex !== -1) {
        todolist.splice(deleteIndex, 1);
    }

    saveTodos(); // Update localStorage after deletion
}

// Function to create and append a new to-do item
function createAndAppendTodo(todo) {
    let myCheckBox = "checkbox" + todo.uniqueNo;
    let labelid = "label" + todo.uniqueNo;
    let listid = "list" + todo.uniqueNo;

    let listEl = document.createElement("li");
    listEl.id = listid;
    listEl.classList.add("list-container", "d-flex", "flex-row");
    unOrderedListEl.appendChild(listEl);

    let inputEl = document.createElement("input");
    inputEl.type = "checkbox";
    inputEl.id = myCheckBox;
    inputEl.checked = todo.isChecked || false; // Restore checked state
    inputEl.onclick = function() {
        onTodoStatusChange(myCheckBox, labelid, todo.uniqueNo);
    };
    listEl.appendChild(inputEl);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("labelContainerClass", "d-flex", "flex-row");
    listEl.appendChild(labelContainer);

    let labelEl = document.createElement("label");
    labelEl.setAttribute("for", myCheckBox);
    labelEl.id = labelid;
    labelEl.classList.add("labelBox");
    labelEl.textContent = todo.lang;
    if (todo.isChecked) {
        labelEl.classList.add("checked");
    }
    labelContainer.appendChild(labelEl);

    let deleteContainer = document.createElement("div");
    deleteContainer.classList.add("deleteIconContainer");
    labelContainer.appendChild(deleteContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.onclick = function() {
        deleteTodo(listid);
    };
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteContainer.appendChild(deleteIcon);
}

// Load saved to-dos from localStorage when page loads
for (let todo of todolist) {
    createAndAppendTodo(todo);
}

// Function to add a new to-do item
function addTodo() {
    let countTodo = todolist.length + 1;

    let inputTextEl = document.getElementById("inputText");
    let inputTextElValue = inputTextEl.value.trim();

    if (inputTextElValue === "") {
        alert("Enter a Value");
        return;
    }

    let newTodo = {
        lang: inputTextElValue,
        uniqueNo: countTodo,
        isChecked: false
    };
    todolist.push(newTodo);
    createAndAppendTodo(newTodo);
    inputTextEl.value = "";

    saveTodos(); // Save after adding
}

// Add button click event
addButtonTodoEl.onclick = function() {
    addTodo();
};