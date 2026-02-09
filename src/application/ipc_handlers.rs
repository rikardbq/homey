use winit::window::WindowId;
use wry::http::Request;

// i may not need..
pub struct IPCHandler {
    pub id: WindowId,
    pub handlers: fn(Request<String>),
}

impl IPCHandler {
    pub fn new(id: WindowId) -> Self {
        IPCHandler {
            id,
            handlers: |req| {
                // handle various things
                print!("handling it! {}", req.body());
            },
        }
    }
}
