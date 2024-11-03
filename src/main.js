const { invoke } = window.__TAURI__.core;

let remindersContainerEl;
let reminderElInstance;
let newInput;

async function addItem(msg) {
  if (msg.trim() === "") {
    return;
  }
  console.log(msg);
  // greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  remindersContainerEl = document.querySelector("#reminders-container");
  reminderElInstance = document.querySelector(".reminder-container").cloneNode(true);
  reminderElInstance.classList.remove("hidden");
  newInput = document.querySelector("#new-input");
  newInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") {
      return;
    }

    addItem(newInput.value);
  });
  document.querySelector("#new-btn").addEventListener("click", () => {
    addItem(newInput.value);
  });
});
