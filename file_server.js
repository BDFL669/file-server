import { createServer } from "node:http";
import { stat, readdir, rmdir, unlink } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { resolve, sep } from "node:path";
import { lookup } from "mime-types";

// Set working directory as base
const baseDirectory = process.cwd();

// Restrict access to files below baseDirectory
function urlPath(url) {
  let { pathname } = new URL(url, "http://d");
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Forbidden" };
  }
  return path;
}

// Method handlers
const methods = Object.create(null);

// Handle GET requests (read file or list directory)
methods.GET = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { status: 404, body: "File not found" };
  }

  if (stats.isDirectory()) {
    return { body: (await readdir(path)).join("\n") };
  } else {
    return { body: createReadStream(path), type: lookup(path) || "application/octet-stream" };
  }
};

// Handle DELETE requests (delete file or directory)
methods.DELETE = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { status: 204 };
  }

  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);

  return { status: 204 };
};

// Pipe utility to copy request stream into a file
function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

// Handle PUT requests (write or overwrite file)
methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};

// Fallback for unsupported methods
async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  };
}

// Start server
createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request).catch(error => {
    if (error.status != null) return error;
    return { status: 500, body: String(error) };
  }).then(({ body, status = 200, type = "text/plain" }) => {
    response.writeHead(status, { "Content-Type": type });
    if (body && body.pipe) body.pipe(response);
    else response.end(body);
  });
}).listen(8000);

console.log("File server running at http://localhost:8000/");
