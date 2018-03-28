# Fake Server

[![npmjs](https://img.shields.io/npm/v/@ftes/fake-server.svg)](https://www.npmjs.com/package/@ftes/fake-server)

Serve static responses, proxy responses and generate random responses from swagger specs.

1. `npm install --global @ftes/fake-server` (or `yarn global add @ftes/fake-server`)
2. `fake-server --configDir=<config-dir>` (`configDir` parameter is mandatory)

The main idea is to use a `configDir` from your app repository (copy `./config` from this repo as a template). You can manage and version the fake responses together with the app you are developing. The `fake-server` installation uses this app-specific config to generate responses.

The behaviour of the fake server is fully configurable through the `configDir/configuration.js` file. The function it exports is called with the express `app` instance, the available `middleware` and all command line options.

## Config Directory
Use [`./config`](./config) as a template. Copy it to your app's repository. It must contain a `configuration.js` and `data` folder. The structure of the `data` folder is [explained below](#data).

## Data directory<span id="data"/>
Responses can be manually added as files. Also, proxied responses and swagger-generated ones are stored to this directory.

### Mapping requests to files
The file matching a request is expected to be present at `config/data/<req.path>/<req.method>.json`.
If a segment of `req.path` does not have a matching directory the `*` directory at that level is used as fallback (if present).

The responses can be manually added. Also, proxied responses and swagger-generated ones are stored to this directory.

### Examples

| Request                   | Response                            |
| ------------------------- | ----------------------------------- |
| `GET  books`              | `/data/books/get.json`              |
| `GET  books/123`          | `/data/books/*/get.json`            |
| `POST books`              | `/data/books/post.json`             |
| `GET  books/123/chapters` | `/data/books/123/chapters/get.json` |

#### Creating a simple echo endpoint

`configuration/configuration.js`

```javascript
module.exports = (app, { middleware, options }) => {
  app.all(['/echo', '/echo/*'], (req, res) => {
    res.send(JSON.stringify(Object.assign({}, req.body, req.query)));
  });
};
```

## Middleware
You can use the provided middleware in your `configuration.js`. This includes:
- [`echo-params`](./src/middleware/echo-params-middleware.js)
- [`file`](./src/middleware/file-middleware.js)
- [`proxy`](./src/middleware/proxy-middleware.js)
- [`send-body`](./src/middleware/send-body-middleware.js)
- [`swagger`](./src/middleware/swagger-middleware.js)
