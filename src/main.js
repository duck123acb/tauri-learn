const { invoke } = window.__TAURI__.core;

let remindersContainerEl;
let newInputEl;
let reminderElInstance;

// greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
async function addItem(inputElement) {
  let msg = inputElement.value;
  if (msg.trim() === "") { // if the reminder is empty, dont consider it
    return;
  }

  let newReminder = reminderElInstance.cloneNode(true);
  newReminder.querySelector(".item").innerText = msg; // change the reminder's text to be the text the user wants
  remindersContainerEl.appendChild(newReminder); // add the reminder to the DOM
  newReminder.querySelector(".done-btn").addEventListener("click", (e) => { // the click function doesnt bind unless its been added to the DOM first
    deleteItem(e.target.parentElement);
  });

  inputElement.value = ""; // reset the input box
}
async function deleteItem(reminderElement) {
  reminderElement.remove();
}

window.addEventListener("DOMContentLoaded", () => {
  remindersContainerEl = document.querySelector("#reminders-container");
  newInputEl = document.querySelector("#new-input");

  reminderElInstance = document.querySelector(".reminder-container").cloneNode(true); // gets an instance of the hidden element
  reminderElInstance.classList.remove("hidden");

  // adding items
  newInputEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") {
      return;
    }

    addItem(newInputEl);
  });
  document.querySelector("#new-btn").addEventListener("click", () => {
    addItem(newInputEl);
  });
});
