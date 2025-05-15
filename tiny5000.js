// Absolute smallest possible server for port 5000
import http from 'http';
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const PORT = process.env.PLACEHOLDER_PORT || 5000;
http.createServer((_, res) => res.end()).listen(PORT);