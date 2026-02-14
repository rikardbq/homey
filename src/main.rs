use homey::application::app::{App, HOST, PORT, ROOT_DIR, WebConfig};
use std::env;
use std::path::PathBuf;

use actix_files::{Files, NamedFile};
use actix_web::{HttpRequest, HttpServer, web};
use winit::{
    event_loop::EventLoop,
    window::{Fullscreen, Window},
};

fn get_or_default_env(env_var: &str, default: &str) -> String {
    env::var(env_var).unwrap_or(default.to_string())
}

async fn index(_req: HttpRequest) -> actix_web::Result<NamedFile> {
    let path: PathBuf = format!("./{ROOT_DIR}/index.html").parse().unwrap();
    Ok(NamedFile::open(path)?)
}

// #[actix_web::main]
#[tokio::main]
async fn main() {
    let srv_host = get_or_default_env("SRV_HOST", HOST);
    let srv_port = get_or_default_env("SRV_PORT", PORT);
    let srv_root = get_or_default_env("SRV_ROOT", ROOT_DIR);

    let web_srv = tokio::spawn({
        HttpServer::new(move || {
            actix_web::App::new()
                .route("/", web::get().to(index))
                .service(Files::new("/", format!("./{srv_root}")))
        })
        .bind(format!("{srv_host}:{srv_port}"))
        .unwrap()
        .run()
    });

    let event_loop = EventLoop::new().unwrap();
    let mut app = App::default();
    let mut web_config = WebConfig::default();

    web_config.set_hostname(srv_host);
    web_config.set_port(srv_port.parse::<usize>().unwrap());
    app.set_web_config(web_config);

    let cli_args: Vec<String> = env::args().collect();
    cli_args.iter().for_each(|x| match x.as_str() {
        "--kiosk" => {
            let fullscreen = Some(Fullscreen::Borderless(None));
            app.set_window_attributes(Window::default_attributes().with_fullscreen(fullscreen));
        }
        _ => (),
    });

    event_loop.run_app(&mut app).unwrap();
    web_srv.abort();
}
