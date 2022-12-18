import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8080;
const app = express();

app.use('/', serveStatic(path.join(__dirname, '/dist')));
app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.listen(port);
