import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [page, setPage] = useState("home"); // ✅ FIX
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Sidebar setPage={setPage} setDarkMode={setDarkMode} />
      <div className="content">
        {page === "home" && <Dashboard />}
        {page === "tasks" && <Tasks />}
        {page === "timer" && <Timer />}
        {page === "analytics" && <Analytics />}
      </div>

    </div>
  );
}

export default App;

// Sidebar
function Sidebar({ setPage, setDarkMode }) {
  return (
    <div className="sidebar">
      <h2>uTask</h2>

      <button onClick={() => setPage("home")}>Dashboard</button>
      <button onClick={() => setPage("tasks")}>Tasks</button>
      <button onClick={() => setPage("timer")}>Timer</button>
      <button onClick={() => setPage("analytics")}>Analytics</button>

      <button onClick={() => setDarkMode(prev => !prev)}>
        🌙 Toggle Mode
      </button>
    </div>
  );
}

// Dashboard Page
function Dashboard() {

  const getWeeklyData = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach(task => {
      if (task.done && task.date) {
        const day = new Date(task.date).getDay();
        counts[day]++;
      }
    });

    return counts;
  };

  const data = getWeeklyData().every(v => v === 0)
    ? [2, 4, 3, 5, 2, 6, 4] // fallback demo data
    : getWeeklyData();
const projects = localStorage.getItem("projects") || 0;
const clients = localStorage.getItem("clients") || 0;
const reviews = localStorage.getItem("reviews") || 0;
  return (
    <div>

      {/* Header */}
      <div className="header-card">
        <div>
          <h2>Good morning, Kaavya 👋</h2>
          <p>Check your daily task & schedules</p>
        </div>
      </div>


{/* Stats Section */}
<div className="stats-row">

  <div className="small-card">
    <p>Projects</p>
    <h2>{projects}</h2>
  </div>

  <div className="small-card">
    <p>Clients</p>
    <h2>{clients}</h2>
  </div>

  <div className="small-card">
    <p>Reviews</p>
    <h2>{reviews}</h2>
  </div>

</div>

{/* Progress + Pie Chart */}
<div className="progress-section">

  <div className="progress-card">
    <p>Progress</p>
    <h2>
      {projects > 0
        ? Math.floor((reviews / projects) * 100)
        : 0}
      %
    </h2>
  </div>

  {/* PIE CHART */}
  <div
    className="pie-chart"
    style={{
      background: `conic-gradient(
        #c471f5 ${(projects > 0 ? (reviews / projects) * 100 : 0)}%,
        #eee ${(projects > 0 ? (reviews / projects) * 100 : 0)}%
      )`
    }}
  >
    <span>
      {projects > 0
        ? Math.floor((reviews / projects) * 100)
        : 0}
      %
    </span>
  </div>

</div>

      {/* Bottom Section */}
      <div className="bottom-grid">

        {/* Activity */}
        <div className="card">
          <h3>Activity</h3>
          <div className="graph">
            {data.map((value, i) => (
              <div key={i} style={{ height: `${value * 20}px` }}></div>
            ))}
          </div>
        </div>

        {/* Meetings */}
       <div className="card">
  <h3>Meetings</h3>
  <ul className="list">
    <li>
      <input type="checkbox" onChange={(e) => {
        e.target.parentElement.style.textDecoration =
          e.target.checked ? "line-through" : "none";
      }} />
      Sprint Daily Meeting
    </li>

    <li>
      <input type="checkbox" onChange={(e) => {
        e.target.parentElement.style.textDecoration =
          e.target.checked ? "line-through" : "none";
      }} />
      Meeting with Client
    </li>

    <li>
      <input type="checkbox" onChange={(e) => {
        e.target.parentElement.style.textDecoration =
          e.target.checked ? "line-through" : "none";
      }} />
      Meeting with HR
    </li>

    <li>
      <input type="checkbox" onChange={(e) => {
        e.target.parentElement.style.textDecoration =
          e.target.checked ? "line-through" : "none";
      }} />
      Design Conference
    </li>
  </ul>
</div>

        {/* Today */}
        <div className="card">
          <h3>Today</h3>
          <ul className="list">
            <li><input type="checkbox" /> ☕ Coffee Break</li>
            <li><input type="checkbox" /> 🎨 New Branding</li>
            <li><input type="checkbox" /> 💻 Development</li>
          </ul>
        </div>

        {/* Calendar */}
        <div className="card">
          <h3>Calendar</h3>
          <div className="calendar">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="day">{i + 1}</div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
// Tasks Page
function Tasks() {
  const [tasks, setTasks] = React.useState(
    JSON.parse(localStorage.getItem("calendarTasks")) || {}
  );

  const [selectedDay, setSelectedDay] = React.useState(null);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem("calendarTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input || selectedDay === null) return;

    const updated = { ...tasks };
    if (!updated[selectedDay]) updated[selectedDay] = [];

    updated[selectedDay].push(input);
    setTasks(updated);
    setInput("");
  };

  const moveTask = (fromDay, toDay, taskIndex) => {
    const updated = { ...tasks };

    const task = updated[fromDay][taskIndex];

    updated[fromDay].splice(taskIndex, 1);

    if (!updated[toDay]) updated[toDay] = [];
    updated[toDay].push(task);

    setTasks(updated);
  };

  return (
    <div>
      <h1>Task Calendar</h1>

      {/* Calendar */}
      <div className="calendar-grid">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`day-box ${selectedDay === i ? "active" : ""}`}
            onClick={() => setSelectedDay(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const data = JSON.parse(e.dataTransfer.getData("task"));
              moveTask(data.from, i, data.index);
            }}
          >
            <strong>{i + 1}</strong>

            <div className="tasks-inside">
              {(tasks[i] || []).map((t, idx) => (
                <div
                  key={idx}
                  className="task-item"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "task",
                      JSON.stringify({ text: t, from: i, index: idx })
                    );
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task */}
      {selectedDay !== null && (
        <div className="task-input-card">
          <h3>✨ Add Task for Day {selectedDay + 1}</h3>

          <div className="input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your task..."
            />
            <button className="main-btn" onClick={addTask}>
              ➕ Add Task
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="notes-section">
        <h2>Notes</h2>
        <ul>
          <li>📌 Focus on priority tasks</li>
          <li>📌 Complete assignments before deadline</li>
          <li>📌 Revise topics for study session</li>
        </ul>
      </div>

      {/* Today's Schedule */}
      <div className="schedule-section">
        <h2>Today's Schedule</h2>

        <div className="schedule-grid">
          <div className="time">09:00 AM</div>
          <div className="event">☕ Coffee Break</div>

          <div className="time">11:00 AM</div>
          <div className="event">🎨 New Branding</div>

          <div className="time">01:00 PM</div>
          <div className="event">💻 Development</div>

          <div className="time">03:00 PM</div>
          <div className="event">📞 Client Meeting</div>
        </div>
      </div>
    </div>
  );
}
// Timer Page
function Timer() {
  const [seconds, setSeconds] = React.useState(1500);
  const [initialTime, setInitialTime] = React.useState(1500);
  const [running, setRunning] = React.useState(false);

  const [hours, setHours] = React.useState("");
  const [minutes, setMinutes] = React.useState("");
  const [focusMode, setFocusMode] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const format = () => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h > 0 ? h + ":" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const setTime = (mins) => {
    const total = mins * 60;
    setSeconds(total);
    setInitialTime(total);
    setRunning(false);
  };

  const handleCustomTime = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;

    const total = h * 3600 + m * 60;
    if (total <= 0) return;

    setSeconds(total);
    setInitialTime(total);
    setRunning(false);
    setHours("");
    setMinutes("");
  };

  const progress =
    initialTime > 0 ? (seconds / initialTime) * 100 : 0;

  const safeProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className="timer-page">

      <h2>Start Focus Time</h2>

      {/* Presets */}
      <div className="time-options">
        <button onClick={() => setTime(25)}>25 min</button>
        <button onClick={() => setTime(15)}>15 min</button>
        <button onClick={() => setTime(5)}>5 min</button>
      </div>

      {/* Custom Input */}
      <div className="custom-time">
        <input
          type="number"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
        <button onClick={handleCustomTime}>Set</button>
      </div>

      {/* Animated Clock */}
      <div
        className="clock"
        style={{
          background: `conic-gradient(#c471f5 ${safeProgress}%, #eee ${safeProgress}%)`
        }}
      >
        <div className="time">{format()}</div>
      </div>

      {/* Controls */}
 <div className="timer-controls">
  <button
    className="main-btn"
    onClick={() => {
      setRunning(true);
      setFocusMode(true);
    }}
  >
    Start
  </button>

  <button className="main-btn" onClick={() => setRunning(false)}>
    Pause
  </button>

  <button
    className="main-btn"
    onClick={() => {
      setSeconds(initialTime);
      setRunning(false);
    }}
  >
    Reset
  </button>

  {/* ✅ ADD THIS HERE */}
  <button
    className="main-btn"
    onClick={() => setFocusMode(false)}
  >
    Exit Focus
  </button>
</div>

    </div>
  );
  {focusMode && (
  <div className="focus-overlay">
    <h1>Focus Mode 🔕</h1>
    <div className="focus-time">{format()}</div>

    <button
      className="main-btn"
      onClick={() => setFocusMode(false)}
    >
      Exit
    </button>
  </div>
)}
}
function Analytics() {
  const tasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};

  const [projects, setProjects] = React.useState(
    Number(localStorage.getItem("projects")) || 0
  );
  const [clients, setClients] = React.useState(
    Number(localStorage.getItem("clients")) || 0
  );
  const [reviews, setReviews] = React.useState(
    Number(localStorage.getItem("reviews")) || 0
  );

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem("projects", projects);
    localStorage.setItem("clients", clients);
    localStorage.setItem("reviews", reviews);
  }, [projects, clients, reviews]);

  // Graph data (7 days)
  const data = Array.from({ length: 7 }, (_, i) => {
    return (tasks[i] || []).length;
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <h1>Analytics</h1>

      {/* Graph Section */}
      <div className="card">
        <h3>Weekly Task Completion</h3>

        <div className="graph">
          {data.map((value, i) => (
            <div key={i} className="bar-container">
              <div
                className="bar"
                style={{ height: `${value * 30 + 10}px` }}
              ></div>
              <span>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Input Section */}
      <div className="card">
        <h3>Update Productivity Stats</h3>

        <div className="stats-input">

          {/* Projects */}
          <div className="stat-box">
            <p>Projects</p>
            <div className="controls">
              <button onClick={() => setProjects(Math.max(0, projects - 1))}>−</button>
              <span>{projects}</span>
              <button onClick={() => setProjects(projects + 1)}>+</button>
            </div>
          </div>

          {/* Clients */}
          <div className="stat-box">
            <p>Clients</p>
            <div className="controls">
              <button onClick={() => setClients(Math.max(0, clients - 1))}>−</button>
              <span>{clients}</span>
              <button onClick={() => setClients(clients + 1)}>+</button>
            </div>
          </div>

          {/* Reviews */}
          <div className="stat-box">
            <p>Reviews</p>
            <div className="controls">
              <button onClick={() => setReviews(Math.max(0, reviews - 1))}>−</button>
              <span>{reviews}</span>
              <button onClick={() => setReviews(reviews + 1)}>+</button>
            </div>
          </div>

        </div>
      </div>

      {/* Total Tasks */}
      <div className="card">
        <h3>Total Tasks</h3>
        <p>{Object.values(tasks).flat().length}</p>
      </div>

    </div>
  );
}