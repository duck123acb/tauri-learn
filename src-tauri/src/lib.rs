const FILE_PATH: &str = "../assets/reminders.txt"; // file reletave to src/tauri

use std::fs::File;
use std::io::{self, Write};

fn write_to_file(file_path: &str, content: &str) -> io::Result<()> {
  let mut file = File::create(file_path)?;
  file.write_all(content.as_bytes())?;
  
  Ok(())
}

#[tauri::command]
fn save_reminders(reminders: &str) {
  match write_to_file(FILE_PATH, reminders) {
    Ok(_) => { 
      // yay :D
    },
    Err(e) => eprintln!("Error creating file: {}", e), // aw D:
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![save_reminders])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
