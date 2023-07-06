const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');


/////////////////////////////////
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname, path} = url.parse(req.url, true);
  console.log(`path is: ${path}`);

  // Overview
  if(pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html' 
    });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  // Product
  else if(pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text' 
    });
    const id = query.id;
    const product = dataObj[id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // API
  else if(pathname === '/api') {
    fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
      res.writeHead(200, {
        'Content-type': 'application/json' 
      });
      res.end(data);
    });
  }

  // Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end("<h1>ERROR 404<h1>\n<h2>Page not found!</h2>");
  }
})

server.listen(8000);
// print the server port dinamically
console.log(`Listening to requests on port ${server.address().port}`);

