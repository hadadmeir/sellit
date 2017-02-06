// eBay API client for Node.js
global.$ = require("jquery");
var _ = require('lodash');
var express = require('express');
var path    = require("path");
var authParams = require('./config/auth-params.js');
var ebay = require('./lib/xml-request');
var MongoClient = require('mongodb').MongoClient;
var db;

module.exports = _.extend({},
  require('./lib/xml-request'),
  require('./lib/xml-converter'),
  require('./lib/json-parser'),
  require('./lib/errors')
);

var app = express();

// Initialize connection once
MongoClient.connect("mongodb://ofear-sellit-ebay-sdk-4253870:27017/main", function(err, database) {
  if(err) throw err;
  db = database;
});

app.get('/getOrders', function(req, res) {
  ebay.xmlRequest({
  serviceName : 'Trading',
  opType : 'GetOrders',

  // app/environment
  devId: authParams.devId(),
  certId: authParams.certId(),
  appName: authParams.appId(),
  sandbox: false,

  // per user
  authToken: authParams.authToken(),

  params: {
    'OrderStatus': 'Active',
    'NumberOfDays': 1
  }
}, function(error, results) {
   if (error) throw error;

		console.log(results);
		console.log('Found', results.Orders.length, 'results');
		
		for (var i = 0; i < results.length; i++) {
		  console.log('- ' + results[i]);
		}
		db.collection('orders').insert(results.Orders,                      
                       {safe:true},function(err, resu){console.log(resu);});
        res.json(results);
	}
);
});
app.get("/dbtest", function(req, res) {
  //db.collection("orders").insert({id:"224535353", type:"123", date:new Date},{safe:true},function(err, result){console.log(result);});
  var document = {id:"224535353", type:"123"};
  db.collection('orders').insert(document, function(err, records){
      if (err) throw err;
		console.log("Record added as "+records[0]._id);
  });
});
app.get('/login', function(req, res) {
  var user = req.param('user');
  var pass = req.param('pass');

  var user = db.collection('users').findOne(
       { _id: user, password: pass}
    );
    var response = {
        user: user,
        status: (user) ? 'SUCCESS' : 'ERROR' 
    };
    
    res.json(user);
});

app.get("/orders", function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
  db.collection("orders").find().toArray(function(err, docs) {
    res.json(docs);
  });
});

app.get("/products", function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
  db.collection("products").find().toArray(function(err, products) {
    res.json(products);
  });
}); 

app.listen(process.env.PORT, process.env.IP);
