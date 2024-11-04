const FILE_DIR: &str  = "/.todo_duckacb/";
const FILE: &str = "reminders.txt";

use std::fs::{self};
use std::io::{self, Write};
use dirs::home_dir;

fn get_home_directory() -> String {
  home_dir().map(|path| path.to_string_lossy().into_owned()).unwrap()
}
fn create_directory(dir_path: &str) -> io::Result<()>{
  fs::create_dir(dir_path)?;
  Ok(())
}
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
  let path = format!("{}{}{}", get_home_directory(), FILE_DIR, FILE);
  match write_to_file(&path, reminders) { // dont need to do anything if it succeeds
    Ok(_) => { 
      // yay :D
    },
    Err(e) => eprintln!("Error writing/creating file: {}", e) // aw D:
  }
}
#[tauri::command]
fn load_saved_reminders() -> String {
  let mut reminders = "".to_string();

  let directory = format!("{}{}", get_home_directory(), FILE_DIR);
  let path = format!("{}{}", directory, FILE);
  match read_file_contents(&path) { // if we cant read the file it complains, otherwise we store the contents in the reminders variable 
    Ok(contents) => reminders = contents,
    Err(e) => {
      eprintln!("Error reading file: {}\n Trying to create folder", e);
      match create_directory(&directory) {
        Ok(_) => {
          // do nothing
        },
        Err(e) => eprintln!("Error creating folder: {}. {}", directory, e)
      }
    },
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
