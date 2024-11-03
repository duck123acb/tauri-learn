const { invoke } = window.__TAURI__.core;

let remindersContainerEl;
let newInputEl;
let reminderElInstance;

let reminders = [];

function getAllReminders() {
  let allReminders = "";
  for (let reminder in reminders) {
    allReminders += reminder + "\n"
  }
  console.log(allReminders);
  return allReminders;
}

async function addItem(msg) {
  if (msg.trim() === "") { // if the reminder is empty, dont consider it
    return;
  }
  
  let newReminder = reminderElInstance.cloneNode(true);
  newReminder.querySelector(".item").innerText = msg; // change the reminder's text to be the text the user wants
  remindersContainerEl.appendChild(newReminder); // add the reminder to the DOM
  newReminder.querySelector(".done-btn").addEventListener("click", (e) => { // the click function doesnt bind unless its been added to the DOM first
    deleteItem(e.target.parentElement); // deletes the active buttons reminder
  });
  
  reminders.push(msg);
  
  await invoke("save_reminders", { reminders: getAllReminders() });
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

    addItem(newInputEl.value);
    newInputEl.value = ""; // reset the input box
});
  document.querySelector("#new-btn").addEventListener("click", () => {
    addItem(newInputEl.value);
    newInputEl.value = ""; // reset the input box
});
});
