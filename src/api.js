export async function getEntries() {
  const res = await fetch('/api/entries');
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

export async function createEntry(entry) {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to create entry');
  return res.json();
}

export async function deleteEntryById(id) {
  const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
  return res.json();
}

export async function clearAllEntries() {
  const res = await fetch('/api/entries', { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear entries');
  return res.json();
}

export async function getSettings() {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(payload) {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}
