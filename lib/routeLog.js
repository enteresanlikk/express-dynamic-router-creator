const { texts } = require('../constants');

class RouteLog {
  constructor(route, type) {
    this.key = route.key || null;
    this.type = texts[type] || texts.unknown;
    this.method = route.method;
    this.url = route.url;
    this.controller = route.controller || null;
    this.action =
      typeof route.action === 'function' ? texts.inline_code : route.action;

    let middlewareTexts = [];
    if (route.middlewares.length > 0) {
      middlewareTexts = route.middlewares.map((middleware, i) => {
        return typeof middleware === 'function'
          ? `'${texts.inline_code}'`
          : middleware;
      });
    }

    this.middlewares = middlewareTexts.join(', ') || null;
  }
}

module.exports = RouteLog;
