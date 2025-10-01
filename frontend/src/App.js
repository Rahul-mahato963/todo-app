import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  // Add task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;
    const res = await axios.post("http://localhost:5000/api/tasks", { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  // Toggle complete
  const handleToggle = async (id, completed) => {
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed });
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  // Delete task
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>✅ To-Do App</h1>

      {/* Add Task Form */}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button type="submit">Add</button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ margin: "10px 0" }}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => handleToggle(task._id, !task.completed)}
            >
              {task.title}
            </span>
            <button
              onClick={() => handleDelete(task._id)}
              style={{ marginLeft: "10px" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
