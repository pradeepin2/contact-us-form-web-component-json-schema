// Required Modules
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Array of Mime Types
const mimeTypes = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
    "svg": "image/svg+xml",
    "icon": "image/x-icon",
    "webm": "video/webm",
    "ogg": "video/ogg",
    "mp4": "video/mp4",
    "mp3": "audio/mpeg",
    "ttf": "font/ttf",
    "otf": "font/otf",
    "woff": "font/woff",
    "woff2": "font/woff2",
    "pdf": "application/pdf"
};

// Hostname and Port
const hostname = '127.0.0.1';
const port = 3000;

// Create Server
const server = http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    const fileName = path.join(process.cwd(), unescape(uri)); // Current working directory + uri
    console.log('Loading ' + uri);
    let stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        // If file not found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    // Check if file or directory
    if (stats.isFile()) {
        const mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
        res.statusCode = 200;
        res.setHeader('Content-Type', mimeType);
        const fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.statusCode = 302;
        res.setHeader('Location', 'index.html');
        res.end();
    } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500 Internal Error\n');
    }
});

// Run Server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/\n`);
});
