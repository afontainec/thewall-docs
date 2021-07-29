const express = require('express');
const useragent = require('express-useragent');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');


const app = express();


app.use(useragent.express());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  next();
});

// LOG REQUESTS
if (process.env.NODE_ENV !== 'test') {
  logger.token('body', (req) => {
    return req.url.includes('login') ? 'hidden' : JSON.stringify(req.body || {});
  });
  app.use(logger('[:date[clf]] :method :url HTTP/:http-version :status :response-time ms :res[content-length] ":body"'));
}

// app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// vuepress static app files

app.use('/', express.static(path.join(__dirname, '/docs/.vuepress/dist/')));


function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);


module.exports = {
  server,
  port,
};

// module.exports = app;
