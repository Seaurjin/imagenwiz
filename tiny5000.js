// Absolute smallest possible server for port 5000
import http from 'http';
http.createServer((_, res) => res.end()).listen(5000);