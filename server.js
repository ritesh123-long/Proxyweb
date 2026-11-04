const express = require('express');
const Unblocker = require('unblocker');

const app = express();
const PREFIX = '/proxy/';

// Optional password: Render env me PROXY_PASS set karo
if (process.env.PROXY_PASS) {
  app.use((req, res, next) => {
    const auth = req.headers.authorization || '';
    const decoded = Buffer.from(auth.split(' ')[1] || '', 'base64').toString();
    if (decoded.split(':').slice(1).join(':') === process.env.PROXY_PASS) return next();
    res.set('WWW-Authenticate', 'Basic realm="Proxy"').status(401).send('Login required');
  });
}

// Static files (UI) pehle
app.use(express.static('public'));

// Pretty URLs: /youtube.com/  aur  /https://youtube.com/
app.use((req, res, next) => {
  if (req.url.startsWith(PREFIX) || req.url === '/favicon.ico') return next();
  const raw = req.url.slice(1);
  const m = raw.match(/^(?:(https?):\/+)?((?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[\/?#].*)?)$/i);
  if (!m) return next();
  const scheme = (m[1] || 'https').toLowerCase();
  res.redirect(302, PREFIX + scheme + '://' + m[2]);
});

app.use(new Unblocker({ prefix: PREFIX }));

app.use((req, res) => res.redirect('/'));

app.listen(process.env.PORT || 8080, () => console.log('Proxy running'));
