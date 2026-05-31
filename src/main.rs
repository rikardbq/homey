// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use homey::{
    KIOSK_SCRIPT, SRV_HOST, SRV_PORT, SRV_ROOT_DIR,
    application::{UserEvent, app::App},
    get_application_root_dir, get_or_default_env,
};
use std::path::PathBuf;
use std::{env, path::Path};

use actix_files::{Files, NamedFile};
use actix_web::{HttpRequest, HttpServer, web};
use winit::{
    event_loop::EventLoop,
    window::{Fullscreen, Window},
};

async fn index(_req: HttpRequest) -> actix_web::Result<NamedFile> {
    let path: PathBuf =
        get_application_root_dir().join(Path::new(&format!("{SRV_ROOT_DIR}/index.html")));
    Ok(NamedFile::open(path)?)
}

// #[actix_web::main]
#[tokio::main]
async fn main() {
    let srv_host = get_or_default_env("SRV_HOST", SRV_HOST);
    let srv_port = get_or_default_env("SRV_PORT", SRV_PORT);
    let srv_root = get_or_default_env("SRV_ROOT_DIR", SRV_ROOT_DIR);

    let web_srv = tokio::spawn({
        HttpServer::new(move || {
            actix_web::App::new()
                .route("/", web::get().to(index))
                .service(Files::new(
                    "/",
                    get_application_root_dir().join(Path::new(&srv_root)),
                ))
        })
        .bind(format!("0.0.0.0:{srv_port}"))
        .unwrap()
        .run()
    });

    let event_loop: EventLoop<UserEvent> = EventLoop::with_user_event().build().unwrap();
    let mut app = App::new(srv_host, srv_port, &event_loop);
    let cli_args: Vec<String> = env::args().collect();
    cli_args.iter().for_each(|x| match x.as_str() {
        "--kiosk" => {
            let fullscreen = Some(Fullscreen::Borderless(None));
            app.set_window_attributes(Window::default_attributes().with_fullscreen(fullscreen));
            app.set_initialization_script(KIOSK_SCRIPT);
        }
        _ => (),
    });

    event_loop.run_app(&mut app).unwrap();
    web_srv.abort();
}
