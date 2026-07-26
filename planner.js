const STORAGE_KEY = "skg_planner_tasks_v1";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const plannerStats = document.getElementById("plannerStats");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeFilter = "all";
let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(dateValue) {
  if (!dateValue) return "No due date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString();
}

function getPriorityClass(priority) {
  if (priority === "high") return "task-priority-high";
  if (priority === "medium") return "task-priority-medium";
  return "task-priority-low";
}

function taskMatchesFilter(task) {
  if (activeFilter === "open") return !task.completed;
  if (activeFilter === "completed") return task.completed;
  return true;
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const open = total - completed;
  plannerStats.textContent = `Total: ${total} | Open: ${open} | Completed: ${completed}`;
}

function buildTaskCard(task) {
  const card = document.createElement("article");
  card.className = "fact-card planner-task-card";
  card.dataset.taskId = task.id;

  const left = document.createElement("div");
  left.className = `task-priority ${getPriorityClass(task.priority)}`;
  left.textContent = task.priority.toUpperCase();

  const right = document.createElement("div");
  right.innerHTML = `
    <h3 class="${task.completed ? "task-done" : ""}">${task.title}</h3>
    <p class="muted"><strong>Due:</strong> ${formatDate(task.dueDate)}</p>
    <p class="muted"><strong>Status:</strong> ${task.completed ? "Completed" : "Open"}</p>
  `;

  const actions = document.createElement("div");
  actions.className = "utility-actions";

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "btn btn-secondary";
  toggleBtn.textContent = task.completed ? "Mark open" : "Mark complete";
  toggleBtn.addEventListener("click", () => toggleTask(task.id));

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-secondary";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editTask(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-secondary";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  actions.append(toggleBtn, editBtn, deleteBtn);
  right.appendChild(actions);
  card.append(left, right);
  return card;
}

function renderTasks() {
  taskList.innerHTML = "";
  const filtered = tasks.filter(taskMatchesFilter);

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No tasks in this view. Add one to get started.";
    taskList.appendChild(empty);
    updateStats();
    return;
  }

  filtered
    .sort((a, b) => {
      const priorityScore = { high: 3, medium: 2, low: 1 };
      const byPriority = priorityScore[b.priority] - priorityScore[a.priority];
      if (byPriority !== 0) return byPriority;
      return (a.createdAt || 0) - (b.createdAt || 0);
    })
    .forEach((task) => taskList.appendChild(buildTaskCard(task)));

  updateStats();
}

function addTask(event) {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = String(formData.get("taskTitle") || "").trim();
  if (!title) return;

  const task = {
    id: crypto.randomUUID(),
    title,
    dueDate: String(formData.get("taskDate") || ""),
    priority: String(formData.get("taskPriority") || "medium"),
    completed: false,
    createdAt: Date.now()
  };

  tasks.push(task);
  saveTasks();
  taskForm.reset();
  taskForm.taskPriority.value = "medium";
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function editTask(taskId) {
  const target = tasks.find((task) => task.id === taskId);
  if (!target) return;

  const updatedTitle = prompt("Update task title:", target.title);
  if (updatedTitle === null) return;
  const cleanTitle = updatedTitle.trim();
  if (!cleanTitle) return;

  const updatedDate = prompt("Update due date (YYYY-MM-DD) or leave empty:", target.dueDate || "");
  if (updatedDate === null) return;

  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, title: cleanTitle, dueDate: updatedDate.trim() } : task
  );
  saveTasks();
  renderTasks();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

taskForm.addEventListener("submit", addTask);
renderTasks();
