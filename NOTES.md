### Notes to self (RUST)

- frontend is a react + vite combo 
- http-server based on https://github.com/diegorodrigo90/rust-http-server
- use (rust wry + winit) to connect a webview to the served content from http-server
    - build out the http-server to better handle multiple types of requests
    - separate static files serve and regular requests
- UX will probably be some tailwind'
- Applications can come in the form of on-device apps and websites
    - Shortcuts may come in various forms
        - Actual windows shortcuts
        - Some homebrewed format to support website/local app linkage
            - Need to add some way to open dialog box to manually find apps on the system so that the homebrewed format could work seamlessly and without hand written links
- If I feel like this even becomes useful I will add some simple installer to streamline the installation and usage
