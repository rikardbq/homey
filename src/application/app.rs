use winit::{
    application::ApplicationHandler,
    event::WindowEvent,
    event_loop::ActiveEventLoop,
    window::{Fullscreen, Window, WindowId},
};
use wry::WebViewBuilder;

use crate::application::ipc_handlers::IPCHandler;

#[derive(Default)]
pub struct App {
    window: Option<Window>,
    webview: Option<wry::WebView>,
}

impl ApplicationHandler for App {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        let fullscreen = Some(Fullscreen::Borderless(None));
        let win_attr = Window::default_attributes().with_fullscreen(fullscreen);
        let window = event_loop.create_window(win_attr).unwrap();
        let ipc_handler = IPCHandler::new(window.id());
        let webview = WebViewBuilder::new()
            .with_ipc_handler(ipc_handler.handlers)
            .with_url("http://localhost:8000")
            .build(&window)
            .unwrap();

        self.window = Some(window);
        self.webview = Some(webview);
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
