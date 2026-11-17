const KEY = 'focusMinutes';
const input = document.getElementById('timer-minutes');
const saveBtn = document.getElementById('save');

function isValid(v) {
  const n = Number(v);
  return v.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= 60;
}

function updateButton() {
  saveBtn.disabled = !isValid(input.value);
}

const saved = localStorage.getItem(KEY);
if (saved) input.value = saved;
updateButton();

input.oninput = updateButton;

saveBtn.onclick = () => {
  if (!isValid(input.value)) return;
  localStorage.setItem(KEY, String(Number(input.value)));
  location.href = 'index.html';
};
