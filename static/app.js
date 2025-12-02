const bodyEl = document.getElementById("taskBody");
const titleEl = document.getElementById("title");

async function load() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();

  bodyEl.innerHTML = "";

  for (const t of tasks) {
    const tr = document.createElement("tr");

    // Task title
    const tdTitle = document.createElement("td");
    tdTitle.textContent = t.title;

    // Status badge based on t.done
    const tdStatus = document.createElement("td");
    const span = document.createElement("span");
    if (t.done) {
      span.className = "badge done";
      span.textContent = "Done";
    } else {
      span.className = "badge not-started";
      span.textContent = "Not started";
    }
    tdStatus.appendChild(span);

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

async function addTask() {
  const title = titleEl.value.trim();
  if (!title) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ title })
  });

  titleEl.value = "";
  await load();
}

async function removeTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  await load();
}

// You can still toggle done via another control later if you want.
load();
