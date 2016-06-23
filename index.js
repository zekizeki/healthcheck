var dateformat = require('dateformat');
var HealthCheck = require("healthcheck").HealthCheck;
var Request = require('request');

// allow connection to self signed ssl certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var CONTEXT_PATH = process.env.CONTEXT_PATH || '/healthcheck';
var SERVER = process.env.SERVER;
var USE_HTTPS = process.env.USE_HTTPS || false;
var NOTIFICATION_URL = process.env.NOTIFICATION_URL;
var INTERVAL = process.env.INTERVAL || 5000;
var TIMEOUT = process.env.TIMEOUT || 3000;
var NOTIFY_AFTER = process.env.NOTIFY_AFTER || 3;
var UPDATE_EVERY = process.env.UPDATE_EVERY || 20;
var NOTIFICATION_USER = process.env.NOTIFICATION_USER || 'healthcheck';

if(!SERVER || !NOTIFICATION_URL) {
  console.log('You must set the env variable SERVER and a NOTIFICATION_URL');
  process.exit(1);
}


console.log('Starting to monitor ' + SERVER + ' with GET request to ' + CONTEXT_PATH);

var instance = new HealthCheck({
    servers: [
        SERVER
    ],
    delay: INTERVAL,
    timeout: TIMEOUT,
    failcount: 1,
    send: CONTEXT_PATH,
    https: USE_HTTPS,
    logger: function(list) {
        
        
        var servers = Object.keys(list);

        servers.forEach(function(s) {
          
            var hc = list[s];
            
            var action_time = dateformat(hc.action_time, 'HH:MM:ss');
            
            // if server is down still after 3 checks perform slack alert
            if(hc.down && (hc.concurrent == NOTIFY_AFTER || (hc.concurrent % UPDATE_EVERY ==0) ) ) {
              // healthcheck is down
              var message = 'Healthcheck failed for '+s+ CONTEXT_PATH +' at ' + action_time + ' last status is '+hc.last_status;
              console.log(message)
              performSlackNotification(message);
            }
        });
    }
});

var performSlackNotification = function(serverStatus){

  var jsonbody = {
    text: serverStatus,
    username: NOTIFICATION_USER
  }

  var options = {
    url: NOTIFICATION_URL,
    method: 'POST',
    body: jsonbody,
    json: true
  }
  Request(options,function(err,response,body){
    if(err)
      console.log(err);
  });

}
