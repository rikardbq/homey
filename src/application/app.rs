use winit::{
    application::ApplicationHandler,
    event::WindowEvent,
    event_loop::ActiveEventLoop,
    platform::windows::IconExtWindows,
    window::{Icon, Window, WindowAttributes, WindowId},
};
use wry::{WebView, WebViewBuilder};

use crate::{HOST, PORT, ROOT_DIR};

pub struct WebConfig {
    hostname: String,
    port: usize,
}

impl WebConfig {
    pub fn default() -> Self {
        WebConfig {
            hostname: HOST.to_string(),
            port: PORT.parse::<usize>().unwrap(),
        }
    }
    pub fn set_hostname(&mut self, hostname: String) {
        self.hostname = hostname;
    }
    pub fn set_port(&mut self, port: usize) {
        self.port = port;
    }
}

#[derive(Default)]
pub struct App {
    window: Option<Window>,
    webview: Option<WebView>,
    window_attributes: Option<WindowAttributes>,
    initialization_script: Option<&'static str>,
    web_config: Option<WebConfig>,
}

impl App {
    pub fn set_window_attributes(&mut self, attributes: WindowAttributes) {
        self.window_attributes = Some(attributes);
    }
    pub fn set_initialization_script(&mut self, script: &'static str) {
        self.initialization_script = Some(script);
    }
    pub fn set_web_config(&mut self, web_config: WebConfig) {
        self.web_config = Some(web_config);
    }
}

impl ApplicationHandler for App {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        let web_config = match &self.web_config {
            Some(conf) => conf,
            None => &WebConfig::default(),
        };
        let win_attr = self
            .window_attributes
            .to_owned()
            .or(Some(Window::default_attributes()))
            .unwrap()
            .with_window_icon(Some(
                Icon::from_path(&format!("{ROOT_DIR}/testicon.ico"), None).unwrap(),
            ));
        let window = event_loop.create_window(win_attr).unwrap();
        // let ipc_handler = IPCHandler::new(window.id());
        let mut webview_builder = WebViewBuilder::new()
            // .with_ipc_handler(ipc_handler.handlers)
            .with_url(format!(
                "http://{}:{}",
                web_config.hostname, web_config.port
            ));

        if let Some(script) = self.initialization_script {
            webview_builder = webview_builder.with_initialization_script(script);
        }

        let webview = webview_builder.build(&window).unwrap();

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
