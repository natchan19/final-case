const bodyEl = document.getElementById("taskBody");
const titleEl = document.getElementById("title");
const statusEl = document.getElementById("statusSelect");

// LOAD TASKS
async function load() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  bodyEl.innerHTML = "";

  for (const t of tasks) {
    const tr = document.createElement("tr");

    // Title
    const tdTitle = document.createElement("td");
    tdTitle.textContent = t.title;

    // Status dropdown
    const tdStatus = document.createElement("td");

    const select = document.createElement("select");
    select.className = "status-select";
    select.innerHTML = `
      <option value="not started">Not Started</option>
      <option value="in progress">In Progress</option>
      <option value="done">Done</option>
    `;
    select.value = t.status;
    select.onchange = () => updateStatus(t.id, select.value);

    const badge = document.createElement("span");
    badge.className = "badge " + cssClass(t.status);
    badge.textContent = label(t.status);

    tdStatus.appendChild(select);
    tdStatus.appendChild(document.createTextNode(" "));
    tdStatus.appendChild(badge);

    // Delete
    const tdDelete = document.createElement("td");
    const btn = document.createElement("button");
    btn.className = "delete-btn";
    btn.textContent = "Delete";
    btn.onclick = () => removeTask(t.id);
    tdDelete.appendChild(btn);

    tr.append(tdTitle, tdStatus, tdDelete);
    bodyEl.appendChild(tr);
  }
}

function cssClass(s) {
  return s.replace(" ", "-");
}

function label(s) {
  return s
    .split(" ")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// ADD TASK
async function addTask() {
  const title = titleEl.value.trim();
  const status = statusEl.value;

  if (!title) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status }),
  });

  titleEl.value = "";
  await load();
}

// UPDATE STATUS
async function updateStatus(id, status) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  await load();
}

// DELETE TASK
async function removeTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  await load();
}

load();
