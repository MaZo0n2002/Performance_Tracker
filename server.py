from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


# ---------- DATABASE ----------
def init_db():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        first_name TEXT,
        last_name TEXT,
        employee_id TEXT,
        task TEXT,
        duration REAL,
        assigned_by TEXT,
        status TEXT,
        comment TEXT,
        form_type TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()


# ---------- SUBMIT ----------
@app.route("/submit", methods=["POST"])
def submit():

    data = request.json

    date = data["date"]
    time = data["time"]
    first_name = data["firstName"]
    last_name = data["lastName"]
    employee_id = data["employeeID"]
    form_type = data["formType"]

    tasks = data["tasks"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    for task in tasks:

        assigned_by = task["assignedBy"]
        status = task["status"]
        comment = task["comment"]

        # If CheckIn → status/comment NULL
        if form_type == "CheckIn":
            status = None
            comment = None

        cursor.execute("""
        INSERT INTO tasks
        (date,time,first_name,last_name,employee_id,task,duration,assigned_by,status,comment,form_type)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """,(
            date,
            time,
            first_name,
            last_name,
            employee_id,
            task["task"],
            task["duration"],
            assigned_by,
            status,
            comment,
            form_type
        ))

    conn.commit()
    conn.close()

    return jsonify({"message":"Saved successfully"})


# ---------- VIEW DATA ----------
@app.route("/data")
def view_data():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT
    date,
    time,
    first_name,
    last_name,
    employee_id,
    task,
    duration,
    assigned_by,
    status,
    comment,
    form_type
    FROM tasks
    """)

    rows = cursor.fetchall()

    conn.close()

    return render_template("view_data.html", rows=rows)


# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)