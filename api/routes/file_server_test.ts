//andrews tests

import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var http = require('http');
var url = require('url');
var fs = require('fs');

var router = PromiseRouter();

router.route('/')
	.get((req, res) => {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("enter a file to access");
		res.write("shouldnt this be an error? oh well, send 200");
		return res.end();
	});
router.route('*')
	.get((req, res) => {
		/*
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("enter route *");
		return res.end();
		*/
		var q = url.parse(req.url, true);
		var filename = "." + q.pathname;
		console.log(filename);
		//var filename = "./google_login_test.html";
		fs.readFile(filename, function(err, data) {
			if (err) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found. lol 2");
			}  
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			return res.end();
		});
	});
  
export var FileServerRouter = router;
