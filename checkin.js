let taskCount = 1;

const addTaskButton = document.getElementById('addTask');
const tasksContainer = document.getElementById('tasksContainer');

addTaskButton.addEventListener('click', () => {
    taskCount++;

    const taskRow = document.createElement('div');
    taskRow.classList.add('task-row');

    taskRow.innerHTML = `
         <div class="task-field">
            <label for="Task${taskCount}">Task ${taskCount}</label>
            <input type="text" id="Task${taskCount}" name="Task${taskCount}" required>
        </div>

        <div class="duration-field">
            <label for="Duration${taskCount}">Estimated Duration (hours)</label>
            <input type="number" id="Duration${taskCount}" name="Duration${taskCount}" min="0" step="0.5" required>
        </div>
        <button type="button" class="remove-btn">✖</button>
    `;
    tasksContainer.appendChild(taskRow);

    addRemoveEvent(taskRow);
});

function addRemoveEvent(taskRow) {

    const removeButton = taskRow.querySelector(".remove-btn");

    removeButton.addEventListener("click", function () {

        if (tasksContainer.children.length > 1) {
            taskRow.remove();
            updateTaskNumbers();
        } else {
            alert("At least one task is required.");
        }

    });
}

function updateTaskNumbers() {

    const allRows = document.querySelectorAll(".task-row");
    taskCount = 0;

    allRows.forEach((row) => {
        taskCount++;

        const label = row.querySelector(".task-field label");
        const input = row.querySelector(".task-field input");
        const durationInput = row.querySelector(".duration-field input");

        label.textContent = `Task ${taskCount}`;
        input.name = `Task${taskCount}`;
        durationInput.name = `Duration${taskCount}`;
    });
}


window.addEventListener('DOMContentLoaded', () => {
    const dateField = document.getElementById("CheckInDate");
    const timeField = document.getElementById("CheckInTime");

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateField.value = `${year}-${month}-${day}`;

    let  hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? "PM" : "AM";
     hours = hours % 12 || 12; // convert to 12h format
    timeField.value = `${hours}:${minutes} ${ampm}`;

});


const form = document.getElementById('checkInForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('FirstName').value;
    const employeeId = document.getElementById('ID').value;
    const date = document.getElementById('CheckInDate').value;
    const time = document.getElementById('CheckInTime').value;

    const taskRows = document.querySelectorAll('.task-row');
    const tasks = [];

    taskRows.forEach((row) => {
        const taskInput = row.querySelector(".task-field input").value;
        const durationInput = row.querySelector(".duration-field input").value;

        tasks.push({
            task: taskInput,
            duration: durationInput
        });
    });

    const formData = {
        firstName,
        employeeID: employeeId,
        date,
        time,
        tasks
    };

    try {
        const response = await fetch("http://localhost:3000/checkin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result);

        alert("Check-in submitted successfully! ✅");
        form.reset();

    } catch (error) {
        console.error("Error:", error);
        alert("Server error ❌");
    }
});