const listEl = document.getElementById('list');
const titleEl = document.getElementById('title');

async function load() {
  const r = await fetch('/api/tasks');
  const tasks = await r.json();
  listEl.innerHTML = '';
  for (const t of tasks) {
    const li = document.createElement('li');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.onchange = () => toggleDone(t.id, cb.checked);

    const span = document.createElement('span');
    span.textContent = t.title + (t.done ? ' (done)' : '');

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.onclick = () => removeTask(t.id);

    li.append(cb, span, del);
    listEl.appendChild(li);
  }
}

async function addTask() {
  const title = titleEl.value.trim();
  if (!title) return;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title })
  });
  titleEl.value = '';
  await load();
}

async function toggleDone(id, done) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ done })
  });
  await load();
}

async function removeTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  await load();
}

load();
