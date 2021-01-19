# Strapi plugin serve-ui

This plugin will redirect fallback requests to a specified folder and index.html in it, or redirect requests to an another server.

## Configuration
- Enable `serve-ui` middleware and put it to the end of the loading order.
- Customize settings in /config/middleware.js (section: settings["serve-ui"])
  - `path`: the path of the served folder if you want to use the file server mode.
  - `proxy`: the host(string) or the port of the server if the content is served through a proxy.