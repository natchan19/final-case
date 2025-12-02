const bodyEl = document.getElementById("taskBody");
const titleEl = document.getElementById("title");

// Status cycle order
const cycle = ["not started", "in progress", "done"];

function nextStatus(current) {
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}

function cssClass(s) {
  return s.replace(" ", "-");
}

function label(s) {
  return s
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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

    // Status badge (clickable)
    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${cssClass(t.status)} clickable`;
    badge.textContent = label(t.status);

    badge.onclick = async () => {
      const newStatus = nextStatus(t.status);
      await updateStatus(t.id, newStatus);
      await load();
    };

    tdStatus.appendChild(badge);

    // Delete button
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

// ADD TASK (always default to NOT STARTED)
async function addTask() {
  const title = titleEl.value.trim();
  if (!title) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      status: "not started"
    })
  });

  titleEl.value = "";
  await load();
}

// UPDATE STATUS
async function updateStatus(id, status) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

// DELETE
async function removeTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  await load();
}

load();
