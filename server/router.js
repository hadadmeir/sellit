// eBay API client for Node.js
global.$ = require("jquery");
var _ = require('lodash');
var express = require('express');
var path    = require("path");
var authParams = require('./config/auth-params.js');
var ebay = require('./lib/xml-request');

module.exports = _.extend({},
  require('./lib/xml-request'),
  require('./lib/xml-converter'),
  require('./lib/json-parser'),
  require('./lib/errors')
);

var app = express();

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
    this.json(results);
	}.bind(res)
);
});
app.get('/login', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
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

app.listen(5050);
