use homey::application::app::App;
use std::path::PathBuf;
use winit::event_loop::EventLoop;

use actix_files::{Files, NamedFile};
use actix_web::{HttpRequest, HttpServer, web};

const HOST: &str = "127.0.0.1";
const PORT: &str = "8000";
const ROOT_DIR: &str = "assets";

async fn index(_req: HttpRequest) -> actix_web::Result<NamedFile> {
    let path: PathBuf = format!("./{ROOT_DIR}/index.html").parse().unwrap();
    Ok(NamedFile::open(path)?)
}

// idk what im doing here :<
// #[actix_web::main]
#[tokio::main]
async fn main() {
    let web_srv = tokio::spawn({
        HttpServer::new(|| {
            actix_web::App::new()
                .route("/", web::get().to(index))
                .service(Files::new("/", format!("./{ROOT_DIR}")))
        })
        .bind(format!("{HOST}:{PORT}"))
        .unwrap()
        .run()
    });

    let event_loop = EventLoop::new().unwrap();
    let mut app = App::default();

    event_loop.run_app(&mut app).unwrap();
    web_srv.abort();
}
