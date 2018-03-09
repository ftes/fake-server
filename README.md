# Fake Server

- Serve static responses from `config/data` directory.
- Override add responses, proxy responses etc. through express middleware in `config/configuration.js`.


## Mapping requests to `data` files

The file matching a request is expected to be present at `config/data/<req.path>/<req.method>.json`.
If a segment of `req.path` does not have a matching directory the `*` directory at that level is used as fallback (if present).

### Examples

| Request                   | Response                       |
| ------------------------- | ------------------------------ |
| `GET  books`              | `/books/get.json`              |
| `GET  books/123`          | `/books/*/get.json`            |
| `POST books`              | `/books/post.json`             |
| `GET  books/123/chapters` | `/books/123/chapters/get.json` |