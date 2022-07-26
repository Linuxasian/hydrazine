#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod presence;
fn main() {
    presence::set_presence();
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("Unknown Error Occurred While Running Application!");
    loop {}
}
