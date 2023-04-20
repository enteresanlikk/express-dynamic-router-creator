'use strict';
const RouteLog = require('./routeLog');
const colors = require('./colors');
const { allowedMethods, texts } = require('../constants');
const { getIp } = require('./utils');

class DynamicRouter {
  #tempRoutes;
  #allRoutes;
  #routeIds;
  #routeId;
  #groupRoutes;
  #hasRouters = false;

  constructor({ app, routers, folders, routerFiles, info = true, port = null }) {
    this.app = app;
    this.routers = routers;
    this.port = port;
    this.folders = folders;
    this.routerFiles = routerFiles;
    this.info = info;

    this.#tempRoutes = [];
    this.#allRoutes = [];
    this.#routeIds = [];
    this.#routeId = 0;
    this.#groupRoutes = [];

    return this;
  }

  run() {
    this.#validate();
    if(!this.#hasRouters) {
      this.#loadRoutes();
    } else {
      this.#setMainRouting(this.routers);
    }

    if (this.port) {
      const ip = getIp();
      this.app.listen(this.port, () => {
        console.log(`${texts.server_is_running} ${colors.blue(`http://${ip}:${this.port}`)}`);
      });
    }

    return this;
  }

  #validate() {
    if (!this.app) throw new Error(texts.app_is_required);
    if(typeof this.routers !== 'undefined') {
      if (!this.routers) throw new Error(texts.routers_is_required);
      if (this.routers.length === 0) {
        throw new Error(texts.routers_is_empty);
      }
      this.#hasRouters = true;
    } else {
      if (!this.folders) throw new Error(texts.folders_is_required);
      if (!this.routerFiles) throw new Error(texts.routerFiles_is_required);
      if (!this.folders.routers) throw new Error(texts.folders_routers_is_required);
    }
  }

  #loadRoutes() {
    for (const file of this.routerFiles) {
      this.#log(colors.blue(colors.underline(file)));

      let routes = [];
      try {
        routes = require(`${this.folders.routers}/${file}`);
      } catch (error) {
        console.log(colors.red(`${file} ${texts.route_file_not_found}`));
        console.log();
        break;
      }

      this.#setMainRouting(routes);
    }
  }

  #setMainRouting(routes) {
    this.#editRoutesIds(routes);
    this.#editRoutes(routes);

    this.#setRoutes(this.#tempRoutes);
    this.#log('');

    this.#tempRoutes = [];
  }

  #editRoutesIds(routes) {
    for (const route of routes) {
      route.id = this.#routeId;
      if (route.routes) {
        this.#routeIds.push(this.#routeId);
        this.#editRoutesIds(route.routes);
        this.#routeIds.pop();
      } else {
        if (this.#routeIds.length > 0) {
          route.parentIds = [...this.#routeIds];
        }
      }
      this.#routeId++;
    }
  }

  #editRoutes(routes) {
    for (const route of routes) {
      if (route.routes) {
        this.#groupRoutes.push(route);
        this.#editRoutes(route.routes);
        this.#groupRoutes.pop();
      } else {
        route.key = route.key || '';
        route.middlewares =
          typeof route.middlewares === 'function'
            ? [route.middlewares]
            : route.middlewares || [];

        if (route.parentIds) {
          let routeUrls = [];
          for (const item of this.#groupRoutes) {
            if (route.parentIds.includes(item.id)) {
              routeUrls.push(item.url);
              if (item.middlewares) {
                route.middlewares = [...route.middlewares, ...item.middlewares];
              }
            }
          }

          let organizedMiddlewares = route.middlewares.filter((a, b, c) => {
            return c.indexOf(a) === b;
          });

          route.middlewares = organizedMiddlewares;

          if (!route.controller) {
            for (let i = this.#groupRoutes.length - 1; i >= 0; i--) {
              if (this.#groupRoutes[i].controller) {
                route.controller = this.#groupRoutes[i].controller;
                break;
              }
            }
          }

          if (!route.action) {
            for (let i = this.#groupRoutes.length - 1; i >= 0; i--) {
              if (this.#groupRoutes[i].action) {
                route.action = this.#groupRoutes[i].action;
                break;
              }
            }
          }

          if (!route.method) {
            for (let i = this.#groupRoutes.length - 1; i >= 0; i--) {
              if (this.#groupRoutes[i].method) {
                route.method = this.#groupRoutes[i].method;
                break;
              }
            }
          }

          for (let i = this.#groupRoutes.length - 1; i >= 0; i--) {
            if (typeof this.#groupRoutes[i].status !== 'undefined') {
              route.status = this.#groupRoutes[i].status;
              break;
            }
          }

          routeUrls = routeUrls.filter((url) => url);
          route.url =
            routeUrls.length > 0
              ? `${routeUrls.join('/')}${route.url ? `/${route.url}` : ''}`
              : '';
        }

        if (typeof route.status === 'undefined') {
          route.status = true;
        }

        route.url = `${route.url || ''}`;

        if (!route.key) {
          route.key = route.url.replace(/[^a-zA-Z0-9]+/g, '_');
        }

        route.url = `/${route.url}`;

        this.#tempRoutes.push(route);
        this.#allRoutes.push(route);
      }
    }
  }

  #methodControl(method) {
    return allowedMethods.includes(method);
  }

  #setRoutes(routes) {
    const log = [];
    for (const route of routes) {
      let hasMethod = this.#methodControl(route.method);
      if (!hasMethod) {
        log.push(new RouteLog(route, 'method_error'));
        continue;
      }

      if (!route.status) {
        log.push(new RouteLog(route, 'passive_route'));
        continue;
      };

      const actionIsFunction = typeof route.action === 'function';

      let action = route.action;
      let controller = route.controller;

      if (!actionIsFunction) {
        let fullControllerPath = `${this.folders.controllers}/${route.controller}`;

        try {
          controller = require(fullControllerPath);
        } catch (e) {
          log.push(new RouteLog(route, 'controller_not_found'));
          continue;
        }

        if (typeof controller[action] !== 'undefined') {
          action = controller[action];
        } else {
          log.push(new RouteLog(route, 'action_not_found'));
          continue;
        }
      }

      if (actionIsFunction) {
        log.push(new RouteLog(route, 'inline_code'));
      } else {
        log.push(new RouteLog(route, 'action_with_controller'));
      }

      this.app[route.method](
        route.url,
        route.middlewares.map((middleware) => {
          return typeof middleware === 'function'
            ? middleware
            : require(`${this.folders.middlewares}/${middleware}`);
        }),
        action
      );
    }

    this.#routesLog(log);
  }

  #log(text) {
    if (this.info) console.log(text);
  }

  #routesLog(routes) {
    if (this.info) {
      console.table(routes);
    }
  }
}

module.exports = DynamicRouter;
