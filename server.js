const express = require('express');
const XLSX = require('xlsx');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const filePath = "./data/database.xlsx";
const sheetName = "CheckIn";

app.post("/checkin", (req, res) => {
    const { firstName, employeeID, date, time, tasks } = req.body;

    let workbook;
    let data = [];

    // If file exists, read it
    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);

        // Check if sheet exists
        if (workbook.Sheets[sheetName]) {
            const worksheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(worksheet);
        }
    } else {
        workbook = XLSX.utils.book_new();
    }

    // Add new rows
    tasks.forEach(task => {
        data.push({
            EmployeeID: employeeID,
            FirstName: firstName,
            Date: date,
            Time: time,
            Task: task.task,
            EstimatedDuration: task.duration,
            Status: ""
        });
    });

    // Convert JSON to sheet
    const newSheet = XLSX.utils.json_to_sheet(data);

    // Replace or add sheet
    workbook.Sheets[sheetName] = newSheet;
    if (!workbook.SheetNames.includes(sheetName)) {
        workbook.SheetNames.push(sheetName);
    }

    // Write file
    XLSX.writeFile(workbook, filePath);

    res.json({ message: "Data saved successfully" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});