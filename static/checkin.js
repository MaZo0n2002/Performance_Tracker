let taskCount = 1;

const addTaskButton = document.getElementById("addTask");
const tasksContainer = document.getElementById("tasksContainer");
const form = document.getElementById("checkinForm");
const formType = document.getElementById("formType");


// ADD TASK
addTaskButton.addEventListener("click", () => {

    taskCount++;

    const taskRow = document.createElement("div");
    taskRow.classList.add("task-row");

    taskRow.innerHTML = `
        <div class="task-field">
            <label>Task ${taskCount}</label>
            <input type="text" required>
        </div>

        <div class="duration-field">
            <label>Estimated Duration (hours)</label>
            <input type="number" min="0" step="0.5" required>
        </div>

        <div class="assigned-field">
            <label>Assigned By</label>
            <input type="text">
        </div>

        <div class="status-field toggle-field">
            <label>Status</label>
            <select>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        <div class="comment-field toggle-field">
            <label>Comment</label>
            <input type="text">
        </div>

        <button type="button" class="remove-btn">✖</button>
    `;

    tasksContainer.appendChild(taskRow);

    addRemoveEvent(taskRow);

    toggleFields();
});


// REMOVE TASK
function addRemoveEvent(taskRow){

    const removeButton = taskRow.querySelector(".remove-btn");

    removeButton.addEventListener("click", () => {

        if(tasksContainer.children.length > 1){
            taskRow.remove();
        } else {
            alert("At least one task is required.");
        }

    });

}


// AUTO DATE + TIME
window.addEventListener("DOMContentLoaded", () => {

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

    toggleFields();
});


// CHECKIN / CHECKOUT
formType.addEventListener("change", toggleFields);

function toggleFields(){

    const type = formType.value;

    const fields = document.querySelectorAll(".toggle-field");

    fields.forEach(field => {

        const input = field.querySelector("input, select");

        if(type === "CheckIn"){
            input.disabled = true;
        } else {
            input.disabled = false;
        }

    });

}


// FORM SUBMIT
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const date = document.getElementById("CheckInDate").value;
    const time = document.getElementById("CheckInTime").value;
    const firstName = document.getElementById("FirstName").value;
    const lastName = document.getElementById("LastName").value;
    const employeeID = document.getElementById("ID").value;
    const formTypeValue = formType.value;

    const taskRows = tasksContainer.querySelectorAll(".task-row");

    let tasks = [];

    taskRows.forEach(row => {

        const task = row.querySelector(".task-field input").value.trim();
        const duration = row.querySelector(".duration-field input").value;
        const assignedBy = row.querySelector(".assigned-field input").value;
        const status = row.querySelector(".status-field select").value;
        const comment = row.querySelector(".comment-field input").value;

        if(task !== ""){

            tasks.push({
                task,
                duration,
                assignedBy,
                status,
                comment
            });

        }

    });

    const formData = {
        date,
        time,
        firstName,
        lastName,
        employeeID,
        formType: formTypeValue,
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

        toggleFields();

    }catch(error){

        console.error(error);
        alert("Error saving data");

    }

});