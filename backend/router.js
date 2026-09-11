import { URL } from 'node:url';

export class NativeRouter {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler) {
    // Convert path pattern (e.g. /api/incidents/:id) to regex
    const paramNames = [];
    const regexPath = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexPath}$`);

    this.routes.push({
      method: method.toUpperCase(),
      pattern,
      regex,
      paramNames,
      handler
    });
  }

  get(pattern, handler) { this.add('GET', pattern, handler); }
  post(pattern, handler) { this.add('POST', pattern, handler); }
  patch(pattern, handler) { this.add('PATCH', pattern, handler); }
  put(pattern, handler) { this.add('PUT', pattern, handler); }
  delete(pattern, handler) { this.add('DELETE', pattern, handler); }

  match(method, pathname) {
    for (const r of this.routes) {
      if (r.method === method.toUpperCase()) {
        const match = pathname.match(r.regex);
        if (match) {
          const params = {};
          r.paramNames.forEach((name, i) => {
            params[name] = decodeURIComponent(match[i + 1]);
          });
          return { handler: r.handler, params, pattern: r.pattern };
        }
      }
    }
    return null;
  }
}

