const express = require('express');
const Unblocker = require('unblocker');
const app = express();

app.use(new Unblocker({ prefix: '/proxy/' }));
app.use(express.static('public'));

app.listen(process.env.PORT || 8080);