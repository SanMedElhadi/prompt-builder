use tauri::{AppHandle, Manager};
use std::fs;

#[tauri::command]
fn get_templates(app: AppHandle) -> Result<Vec<serde_json::Value>, String> {
    let path = app.path().app_data_dir().map_err(|e| e.to_string())?.join("templates.json");
    if path.exists() {
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let templates: Vec<serde_json::Value> = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(templates)
    } else {
        Ok(vec![])
    }
}

#[tauri::command]
fn save_templates(app: AppHandle, templates: Vec<serde_json::Value>) -> Result<(), String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }
    let path = dir.join("templates.json");
    let content = serde_json::to_string_pretty(&templates).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_topics(app: AppHandle) -> Result<Vec<serde_json::Value>, String> {
    let path = app.path().app_data_dir().map_err(|e| e.to_string())?.join("topics.json");
    if path.exists() {
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let topics: Vec<serde_json::Value> = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(topics)
    } else {
        Ok(vec![])
    }
}

#[tauri::command]
fn save_topics(app: AppHandle, topics: Vec<serde_json::Value>) -> Result<(), String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }
    let path = dir.join("topics.json");
    let content = serde_json::to_string_pretty(&topics).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
        get_templates,
        save_templates,
        get_topics,
        save_topics
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
