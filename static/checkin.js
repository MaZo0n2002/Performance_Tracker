let taskCount = 1;

const addTaskButton = document.getElementById("addTask");
const tasksContainer = document.getElementById("tasksContainer");


// ADD TASK
addTaskButton.addEventListener("click", () => {

    taskCount++;

    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

    taskRow.innerHTML = `
        <div class="task-field">
            <label for="Task${taskCount}">Task ${taskCount}</label>
            <input type="text" id="Task${taskCount}" name="Task${taskCount}" required>
        </div>

        <div class="duration-field">
            <label for="Duration${taskCount}">Estimated Duration (hours)</label>
            <input type="number" id="Duration${taskCount}" name="Duration${taskCount}" min="0" step="0.5" required>
        </div>

        <div class="status-field">
            <label for="Status${taskCount}">Status</label>
            <select id="Status${taskCount}" name="Status${taskCount}">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        <button type="button" class="remove-btn">✖</button>
    `;

    tasksContainer.appendChild(taskRow);

    addRemoveEvent(taskRow);
});


// REMOVE TASK
function addRemoveEvent(taskRow){

    const removeButton = taskRow.querySelector(".remove-btn");

    removeButton.addEventListener("click", function(){

        if(tasksContainer.children.length > 1){

            taskRow.remove();
            updateTaskNumbers();

        }else{

            alert("At least one task is required.");

        }

    });

}


// UPDATE TASK NUMBERS
function updateTaskNumbers(){

    const allRows = document.querySelectorAll(".task-row");

    taskCount = 0;

    allRows.forEach((row)=>{

        taskCount++;

        const label = row.querySelector(".task-field label");
        const input = row.querySelector(".task-field input");
        const durationInput = row.querySelector(".duration-field input");
        const statusInput = row.querySelector(".status-field select");

        label.textContent = `Task ${taskCount}`;

        input.name = `Task${taskCount}`;
        input.id = `Task${taskCount}`;

        durationInput.name = `Duration${taskCount}`;
        durationInput.id = `Duration${taskCount}`;

        statusInput.name = `Status${taskCount}`;
        statusInput.id = `Status${taskCount}`;

    });

}


// AUTO DATE + TIME
window.addEventListener("DOMContentLoaded", ()=>{

    const dateField = document.getElementById("CheckInDate");
    const timeField = document.getElementById("CheckInTime");

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2,"0");
    const day = String(now.getDate()).padStart(2,"0");

    dateField.value = `${year}-${month}-${day}`;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2,"0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    timeField.value = `${hours}:${minutes} ${ampm}`;

});


// FORM SUBMIT
const form = document.getElementById("checkinForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const date = document.getElementById("CheckInDate").value;
    const time = document.getElementById("CheckInTime").value;
    const firstName = document.getElementById("FirstName").value;
    const employeeID = document.getElementById("ID").value;

    const taskRows = document.querySelectorAll(".task-row");

    let tasks = [];

    taskRows.forEach(row=>{

        const task = row.querySelector(".task-field input").value.trim();
        const duration = row.querySelector(".duration-field input").value;
        const status = row.querySelector(".status-field select").value;

        if(task !== ""){

            tasks.push({
                task,
                duration,
                status
            });

        }

    });

    const formData = {
        date,
        time,
        firstName,
        employeeID,
        tasks
    };

    try{

        const response = await fetch("http://127.0.0.1:5000/submit",{

            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(formData)

        });

        const result = await response.json();

        alert("Data saved successfully");

        form.reset();

        location.reload();

    }catch(error){

        alert("Error saving data");

        console.error(error);

    }

});