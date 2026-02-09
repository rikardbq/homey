use winit::window::WindowId;
use wry::http::Request;

pub struct IPCHandlers {
    pub id: WindowId,
    pub read_file: fn(Request<String>),
}

impl IPCHandlers {
    pub fn new(id: WindowId) -> Self {
        IPCHandlers {
            id,
            read_file: |req| print!("{}", req.body()),
        }
    }
}
