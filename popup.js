// Builds one switch per feature from features.js and saves changes to chrome.storage.sync.
const groups = document.getElementById('groups');

chrome.storage.sync.get(YTF_DEFAULTS, (saved) => {
  const byGroup = {};
  for (const f of YTF_FEATURES) (byGroup[f.group] ||= []).push(f);

  for (const [name, features] of Object.entries(byGroup)) {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${name}</h2><div class="card"></div>`;
    const card = section.querySelector('.card');

    for (const f of features) {
      const row = document.createElement('label');
      row.className = 'row';
      row.innerHTML = `
        <span class="text"><span class="label"></span><span class="note"></span></span>
        <input type="checkbox" role="switch">`;
      row.querySelector('.label').textContent = f.label;
      row.querySelector('.note').textContent = f.note;
      const box = row.querySelector('input');
      box.checked = saved[f.key];
      box.addEventListener('change', () => chrome.storage.sync.set({ [f.key]: box.checked }));
      card.appendChild(row);
    }
    groups.appendChild(section);
  }
});
