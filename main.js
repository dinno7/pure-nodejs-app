const fs = require('fs');
const http = require('http');
const { parse: parseUrl } = require('url');

const { defineHtmlVars } = require('./utils');

let overviewHtml = fs.readFileSync('./views/index.html', 'utf-8');
let productCardHtml = fs.readFileSync('./views/product-card.html', 'utf-8');
let productHtml = fs.readFileSync('./views/product.html', 'utf-8');

let dataObj = fs.readFileSync('./json/data.json', 'utf-8');
dataObj = JSON.parse(dataObj);

const server = http.createServer(async (req, res) => {
	if (req.url.toLowerCase() === '/favicon.ico') return;
	let url = parseUrl(req.url, true);
	//? GET - /
	if (url.pathname == '/') {
		let productCards = dataObj.map((el) => {
			return defineHtmlVars(productCardHtml, {
				id: el.id + '',
				image: el.image,
				productName: el.productName,
				quantity: el.quantity,
				price: el.price,
				isOrganic: !el.organic ? 'not-organic' : 'is-organic',
			});
		});

		overviewHtml = defineHtmlVars(overviewHtml, {
			productCards: productCards,
		});
		return res.end(overviewHtml);
	}
	//? GET - /product
	else if (url.pathname === '/product') {
		let product = await dataObj.find((i) => i.id == +url?.query?.id);
		let output;
		if (product) {
			output = defineHtmlVars(productHtml, {
				image: product.image,
				productName: product.productName,
				quantity: product.quantity,
				price: product.price,
				isOrganic: !product.organic ? 'not-organic' : 'is-organic',
				nutrients: product.nutrients,
				description: product.description,
				from: product.from,
			});
			res.writeHead(200, 'OK', {
				'Content-type': 'text/html',
			});
		} else {
			output = '<h1>The product not found!</h1>';
			res.writeHead(404, '404', {
				'Content-type': 'text/html',
			});
		}
		return res.end(output);
	}
	//? GET - /404
	else {
		res.writeHead(404, ' - page not found');
		return res.end('404 - Page not found!');
	}
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, 'localhost', () => {
	console.log('✨', `Server running on port ${PORT}\n🔗 Go to link: http://localhost:${PORT}`);
});
