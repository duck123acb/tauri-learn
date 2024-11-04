const { invoke } = window.__TAURI__.core;

let remindersContainerEl;
let newInputEl;
let reminderElInstance;

let reminders = [];

function getAllReminders() {
  let allReminders = "";
  for (let reminder of reminders) {
    allReminders += reminder + "\n"
  }
  return allReminders;
}

async function loadReminders() {
  let remindersString = await invoke("load_saved_reminders", { });
  console.log(remindersString);
  let newReminders = remindersString.split("\n");
  
  for (let reminder of newReminders) {
    addItem(reminder);
  }
  await invoke("save_reminders", { reminders: getAllReminders() });
}
function addItem(msg) {
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
}
async function deleteItem(reminderElement) {
  let reminder = reminderElement.querySelector(".item").innerText;
  console.log(reminders.indexOf(reminder));
  reminders.splice(reminders.indexOf(reminder), 1); // removes the element from the list
  reminderElement.remove();

  await invoke("save_reminders", { reminders: getAllReminders() });
}

window.addEventListener("DOMContentLoaded", () => {
  remindersContainerEl = document.querySelector("#reminders-container");
  newInputEl = document.querySelector("#new-input");

  reminderElInstance = document.querySelector(".reminder-container").cloneNode(true); // gets an instance of the hidden element
  reminderElInstance.classList.remove("hidden");

  // adding items
  newInputEl.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") {
      return;
    }

    addItem(newInputEl.value);
    newInputEl.value = ""; // reset the input box
    await invoke("save_reminders", { reminders: getAllReminders() });
  });
  document.querySelector("#new-btn").addEventListener("click", async () => {
    addItem(newInputEl.value);
    newInputEl.value = ""; // reset the input box
    await invoke("save_reminders", { reminders: getAllReminders() });
  });
  loadReminders();
});
