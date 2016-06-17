# Healthcheck
This is a simple monit style healthcheck script for HTTP/HTTPS based Services

The Service takes a host and path checkpoint and does repeated checks against the service. If it doesnt receive a 200 OK it will post a JSON 
message to a configurable URL. The JSON is in Slack notification format.

#Configuration
Options on the service are set via environment parameters

##Mandatory Environment variables
SERVER - This should be the host and port  e.g.   google.com:443

NOTIFICATION_URL - A Slack notification or other url to post alerts to e.g. https://hooks.slack.com/services/XXXXXXXX/XXXXXXXX/XXXXXXXXXXXXXX

##OptionalEnvironment variables
CONTEXT_PATH -  defaults to /healthcheck'

USE_HTTPS -  defaults to false

INTERVAL -  defaults to 5000 (5 seconds)  Call the healthcheck endpoint every 5 seconds

TIMEOUT - defaults to 3000 (3 seconds) if the endpoint doesnt respond within 3 seconds count this as a failure

NOTIFY_AFTER - defaults to 3, only send an alert after 3 failures

UPDATE_EVERY - defaults to 20, send a repeat of the failure alert after every 20 fails after the first alert

NOTIFICATION_USER - defaults to 'healthcheck', the username to display in Slack

# Running the docker image

```
docker run -d -e SERVER="google.co.uk:443" -e USE_HTTPS=true -e NOTIFICATION_URL="https://hooks.slack.com/services/XXXXXXXX/XXXXXXXX/XXXXXXXXXXXXXX" zekizeki/healthcheck:latest
```
