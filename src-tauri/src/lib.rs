const FILE_PATH: &str = "../assets/reminders.txt"; // file relative to src/tauri

use std::fs;
use std::io::{self, Write};

fn write_to_file(file_path: &str, content: &str) -> io::Result<()> {
  let mut file = fs::File::create(file_path)?;
  file.write_all(content.as_bytes())?;
  
  Ok(())
}
fn read_file_contents(path: &str) -> io::Result<String> {
  let contents = fs::read_to_string(path)?;
  Ok(contents)
}

#[tauri::command]
fn save_reminders(reminders: &str) {
  match write_to_file(FILE_PATH, reminders) { // dont need to do anything if it succeeds
    Ok(_) => { 
      // yay :D
    },
    Err(e) => eprintln!("Error writing/creating file: {}", e), // aw D:
  }
}
#[tauri::command]
fn load_saved_reminders() -> String {
  let mut reminders = "".to_string();

  match read_file_contents(FILE_PATH) { // if we cant read the file it complains, otherwise we store the contents in the reminders variable 
    Ok(contents) => reminders = contents,
    Err(e) => eprintln!("Error reading file: {}", e),
  }

  reminders
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![save_reminders, load_saved_reminders])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
