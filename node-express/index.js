const express = require('express'),
     http = require('http');
const bodyparser = require('body-parser');
const hostname = 'localhost';
const port = 3000;

const app = express();
const morgan = require("morgan");

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(express.static(__dirname+'/public'));

const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
app.use('/dishes', dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);



app.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});