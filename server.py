from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


# ---------- CREATE DATABASE + TABLE ----------
def init_db():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        first_name TEXT,
        employee_id TEXT,
        task TEXT,
        duration REAL,
        status TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()


# ---------- SUBMIT DATA ----------
@app.route("/submit", methods=["POST"])
def submit():

    data = request.json

    date = data["date"]
    time = data["time"]
    first_name = data["firstName"]
    employee_id = data["employeeID"]
    tasks = data["tasks"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    for task in tasks:

        cursor.execute("""
        INSERT INTO tasks
        (date, time, first_name, employee_id, task, duration, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            date,
            time,
            first_name,
            employee_id,
            task["task"],
            task["duration"],
            task["status"]
        ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Saved successfully"})


# ---------- VIEW DATA ----------
@app.route("/data")
def view_data():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT date, time, first_name, employee_id, task, duration, status FROM tasks")
    rows = cursor.fetchall()

    conn.close()

    return render_template("view_data.html", rows=rows)


# ---------- RUN SERVER ----------
if __name__ == "__main__":
    app.run(debug=True)