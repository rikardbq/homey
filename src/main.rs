use homey::application::app::App;
use std::fs;
use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};
use std::path::Path;
use std::thread;
use winit::event_loop::EventLoop;

// Constants for server configuration
const HOST: &str = "127.0.0.1";
const PORT: &str = "8000";
const ROOT_DIR: &str = "assets";

fn main() {
    let _ = thread::spawn(|| {
        // Bind to the host and port
        let endpoint = format!("{}:{}", HOST, PORT);
        let listener = TcpListener::bind(endpoint).unwrap();
        println!("Web server is listening at port {}", PORT);

        // Accept incoming connections
        for incoming_stream in listener.incoming() {
            let mut stream = incoming_stream.unwrap();
            handle_connection(&mut stream);
        }
    });

    let event_loop = EventLoop::new().unwrap();
    let mut app = App::default();

    event_loop.run_app(&mut app).unwrap();
}

fn handle_connection(stream: &mut TcpStream) {
    // Buffer to read the incoming request
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();

    // Convert the request buffer to a string
    let request_str = String::from_utf8_lossy(&buffer);

    println!("Asdasdasd {}", request_str);

    // Parse the request path
    let request_path = parse_request_path(&request_str);

    // Serve the requested file
    serve_requested_file(&request_path, stream);
}

fn parse_request_path(request: &str) -> String {
    // Extract the path part of the request
    request.split_whitespace().nth(1).unwrap_or("/").to_string()
}

fn serve_requested_file(file_path: &str, stream: &mut TcpStream) {
    // Construct the full file path, if "/" the use index.html
    let file_path = if file_path == "/" {
        format!("{}/index.html", ROOT_DIR)
    } else {
        format!("{}/{}", ROOT_DIR, &file_path[1..])
    };

    let path = Path::new(&file_path);
    let mime = match path.to_str().unwrap().split(".").last().unwrap() {
        "js" => "text/javascript",
        "svg" => "image/svg+xml",
        _ => "",
    };

    println!("MIME={}", mime);

    // Generate the HTTP response
    let response = match fs::read_to_string(&path) {
        Ok(contents) => format!(
            "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nContent-Type: {}\r\n\r\n{}",
            contents.len(),
            mime,
            contents,
        ),
        Err(_) => {
            let not_found = "404 Not Found.";
            format!(
                "HTTP/1.1 404 NOT FOUND\r\nContent-Length: {}\r\n\r\n{}",
                not_found.len(),
                not_found
            )
        }
    };

    // Send the response over the TCP stream
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
