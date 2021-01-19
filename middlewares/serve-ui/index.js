"use strict";

/**
 * Module dependencies
 */

// Node.js core.
const fs = require("fs");
const path = require("path");
const koaStatic = require("koa-static");
const convert = require("koa-connect");
const proxy = require("http-proxy-middleware").createProxyMiddleware;

/**
 * Public assets hook
 */

module.exports = (strapi) => {
  return {
    async initialize() {
      const config =
        (strapi.config.middleware &&
          strapi.config.middleware.settings &&
          strapi.config.middleware.settings["serve-ui"]) ||
        {};

      if (config.proxy) {
        const host =
          typeof config.proxy === "number"
            ? `localhost:${config.proxy}`
            : config.proxy;

        strapi.router.use(
          convert(
            proxy("/", {
              target: `ws://${host}`,
              ws: true,
              changeOrigin: true,
              secure: false,
              logLevel: "error",
            })
          )
        );
      } else if (config.path) {
        const { maxAge } = strapi.config.middleware.settings.public;
        const buildDir = path.resolve(strapi.dir, config.path);

        strapi.router.get(
          "/(.*)",
          koaStatic(buildDir, {
            maxage: maxAge,
          })
        );
        strapi.router.use((ctx) => {
          ctx.type = "html";
          ctx.body = fs.createReadStream(path.join(`${buildDir}/index.html`));
        });
      }
    },
  };
};
