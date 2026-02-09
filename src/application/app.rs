use std::{fs, path::PathBuf};

use winit::{
    application::ApplicationHandler,
    event::WindowEvent,
    event_loop::ActiveEventLoop,
    window::{Fullscreen, Window, WindowId},
};
use wry::{WebViewBuilder, http::Request};

use crate::application::ipc_handlers::IPCHandlers;

#[derive(Default)]
pub struct App {
    window: Option<Window>,
    webview: Option<wry::WebView>,
}

impl ApplicationHandler for App {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("assets")
            .join("index.html");
        if let Ok(html) = fs::read_to_string(path) {
            let fullscreen = Some(Fullscreen::Borderless(None));
            let win_attr = Window::default_attributes().with_fullscreen(fullscreen);
            let window = event_loop.create_window(win_attr).unwrap();
            let ipc_handler = IPCHandlers::new(window.id());
            let webview = WebViewBuilder::new()
                .with_ipc_handler(ipc_handler.read_file)
                .with_ipc_handler(|_req| {
                    print!("ASDDDDD");
                })
                .with_html(html)
                // .with_url("./index.html")
                .build(&window)
                .unwrap();

            self.window = Some(window);
            self.webview = Some(webview);
        } else {
            panic!("UI Entry missing!")
        }
    }

    fn window_event(
        &mut self,
        event_loop: &ActiveEventLoop,
        _window_id: WindowId,
        event: WindowEvent,
    ) {
        match event {
            WindowEvent::CloseRequested => {
                println!("The close button was pressed; stopping");
                event_loop.exit();
            }
            _ => (),
        }
    }
}
