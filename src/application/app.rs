use winit::{
    application::ApplicationHandler,
    event::WindowEvent,
    event_loop::{ActiveEventLoop, EventLoop, EventLoopProxy},
    platform::windows::IconExtWindows,
    window::{Icon, Window, WindowAttributes, WindowId},
};
use wry::{WebView, WebViewBuilder};
// use x_win::get_open_windows;

use crate::{
    IPC_HANDLER_INIT_SCRIPT, ROOT_DIR,
    application::{IpcRequest, IpcResponse, UserEvent, WebConfig},
};

pub struct App {
    event_proxy: EventLoopProxy<UserEvent>,
    web_config: WebConfig,
    window: Option<Window>,
    window_attributes: Option<WindowAttributes>,
    webview: Option<WebView>,
    initialization_script: Option<&'static str>,
}

impl App {
    pub fn new(host: String, port: String, event_loop: &EventLoop<UserEvent>) -> Self {
        let event_proxy = event_loop.create_proxy();

        Self {
            event_proxy: event_proxy,
            web_config: WebConfig::new(host, port),
            window: None,
            window_attributes: None,
            webview: None,
            initialization_script: None,
        }
    }
    pub fn set_window_attributes(&mut self, attributes: WindowAttributes) {
        self.window_attributes = Some(attributes);
    }
    pub fn set_initialization_script(&mut self, script: &'static str) {
        self.initialization_script = Some(script);
    }
    pub fn eval_script(&mut self, script: &str) -> Result<(), wry::Error> {
        self.webview.as_ref().unwrap().evaluate_script(script)
    }
}

impl ApplicationHandler<UserEvent> for App {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        let win_attr = self
            .window_attributes
            .to_owned()
            .or(Some(Window::default_attributes()))
            .unwrap()
            .with_window_icon(Some(
                Icon::from_path(&format!("{ROOT_DIR}/testicon.ico"), None).unwrap(),
            ));
        let window = event_loop.create_window(win_attr).unwrap();
        let mut webview_builder = WebViewBuilder::new()
            .with_url(format!(
                "http://{}:{}",
                self.web_config.hostname, self.web_config.port
            ))
            .with_initialization_script(IPC_HANDLER_INIT_SCRIPT);

        let proxy_clone = self.event_proxy.clone();
        webview_builder = webview_builder.with_ipc_handler(move |req| {
            let msg = req.body().to_string();
            proxy_clone
                .send_event(UserEvent::ExecEval(msg))
                .expect("Failed to send event");
        });
        if let Some(script) = self.initialization_script {
            webview_builder = webview_builder.with_initialization_script(script);
        }
        let webview = webview_builder.build(&window).unwrap();
        self.window = Some(window);
        self.webview = Some(webview);
    }

    fn user_event(&mut self, _event_loop: &ActiveEventLoop, event: UserEvent) {
        match event {
            UserEvent::ExecEval(msg) => {
                let req: IpcRequest = serde_json::from_str(&msg).unwrap();
                let result = match req.method.as_str() {
                    "list_files" => {
                        let files: Vec<String> = std::fs::read_dir(".")
                            .unwrap()
                            .filter_map(|e| e.ok())
                            .map(|e| e.file_name().to_string_lossy().to_string())
                            .collect();

                        serde_json::to_value(files).unwrap()
                    }
                    // "get_windows" => {
                    //     let open_windows = get_open_windows().expect("Error showing windows");
                    //     let titles: Vec<String> = open_windows.iter().map(|x| x.title.clone()).collect();
                    //     serde_json::to_value(titles).unwrap()

                    // }
                    _ => serde_json::json!({"error": "unknown method"}),
                };

                let response = IpcResponse { id: req.id, result };
                let json = serde_json::to_string(&response).unwrap();

                self.webview
                    .as_ref()
                    .unwrap()
                    .evaluate_script(&format!("window.ipc_handler.responseHandler({});", json))
                    .unwrap();
            } // _ => ()
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
