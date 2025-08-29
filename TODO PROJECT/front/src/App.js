import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8080/api/todos";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    const todo = {
      title: newTask,
      completed: newStatus,
    };

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        });
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        });
      }

      setNewTask("");
      setNewStatus(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const todo = tasks.find((t) => t.id === id);
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, completed: !currentStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (task) => {
    setNewTask(task.title);
    setNewStatus(task.completed);
    setEditingId(task.id);
  };

  return (
    <div className="app">
      <h1>📝 To-Do List (Spring Boot + React + Fetch)</h1>

      <div className="input-section">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..."/>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value === "true")}>
          <option value="false">Incomplete</option>
          <option value="true">Completed</option>
        </select>
        <button onClick={addTask}>{editingId ? "Update" : "Add"}</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleTask(task.id, task.completed)}>
              {task.title} - {task.completed ? "Done" : "Not Done"}
            </span>
            <div>
              <button className="update" onClick={() => editTask(task)}>Update</button>
              <button className="delete" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;