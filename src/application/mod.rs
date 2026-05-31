use serde::{Deserialize, Serialize};

pub mod app;

#[derive(Deserialize)]
struct IpcRequest {
    id: u64,
    method: String,
    params: serde_json::Value,
}

#[derive(Serialize)]
struct IpcResponse {
    id: u64,
    result: serde_json::Value,
}

#[derive(Debug)]
pub enum UserEvent {
    ExecEval(String),
}

pub struct WebConfig {
    hostname: String,
    port: usize,
}

impl WebConfig {
    pub fn new(hostname: String, port: String) -> Self {
        Self {
            hostname,
            port: port.parse::<usize>().unwrap(),
        }
    }
    pub fn set_hostname(&mut self, hostname: String) {
        self.hostname = hostname;
    }
    pub fn set_port(&mut self, port: usize) {
        self.port = port;
    }
}
