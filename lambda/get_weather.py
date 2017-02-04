#!/usr/bin/env python

import boto3
import datetime
import json
import os
import urllib2

def lambda_handler(event, context):
	user_id = event['session']['user']['userId']
	config = get_config(user_id)
	intent = event['request']['intent']['name']
	if(intent == 'FiveCast'
			and config.get('state', None)
			and config.get('city', None)
			and config.get('highlights', None)):
		read_briefing(config)
	elif(intent == 'FiveCast'):
		help()
	elif(intent == 'SetCity'):
		config['city'] = event['request']['intent']['slots']['City']['value']
		set_config(config)
	elif(intent == 'GetCity'):
		#TODO
                pass
	elif(intent == 'AddHighlight'):
		#TODO
                pass
	elif(intent == 'RemoveHighlight'):
		#TODO
                pass
	elif(intent == 'GetHighlights'):
		#TODO
                pass
	elif(intent == 'SayCity'):
		city = event['request']['intent']['slots']['City']['value']
                response = []
                for slot_name, slot_value in event['request']['intent']['slots'].iteritems():
                        response.append(slot_name)
                        for key, value in slot_value.iteritems():
                                response.extend([key, value])
		return(build_response('Hello, Dave, the city is {city}.'.format(city=' '.join(response))))

def read_briefing(config):
	state = config['state']
	city = config['city']
	highlights = config['highlights']

	# Get the hourly weather forecast from the Weather Underground API.
	url = 'http://api.wunderground.com/api/{key}/hourly/q/{state}/{city}.json'.format(
		key=os.environ['WUNDERGROUND_KEY'],
		state=state,
		city=city)
	wunderground_response = urllib2.urlopen(url)
	wunderground_response = json.loads(wunderground_response.read())

	# Get details for each highlight time.
	today = wunderground_response['hourly_forecast'][0]['FCTTIME']['mday']
	highlight_responses = []
	for hour in wunderground_response['hourly_forecast']:
		if(hour['FCTTIME']['civil'] in highlights and hour['FCTTIME']['mday'] == today):
			highlight_responses.append('{time}: {temp} and {condition}.'.format(
				time=hour['FCTTIME']['civil'],
				temp=hour['feelslike']['english'],
				condition=hour['condition']))

	return(build_response(' '.join(highlight_responses), True))

def build_response(text, should_end_session=False):
	return({
		'version': '1.0',
		'response': {
			'outputSpeech': {
				'type': 'PlainText',
				'text': text
			},
			'shouldEndSession': should_end_session
		}
	})

def get_dynamo_table():
	dynamo = boto3.resource('dynamodb', region_name='us-east-1')
	return(dynamo.Table('weather_settings'))

def get_config(user_id):
	table = get_dynamo_table()
	response = table.get_item(Key={'user_id': user_id})
	if('Item' in response):
		return(response['Item'])
	else:
		config = {'user_id': user_id, 'city': None, 'state': None, 'highlights': []}
		set_config(config)
		return(config)

def set_config(config):
	table = get_dynamo_table()
	table.put_item(Item=config)

if(__name__ == '__main__'):
        payload = {
  "session": {
    "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
    "application": {
      "applicationId": "amzn1.ask.skill.9fedf725-c488-4481-9fc1-91f7b35bb064"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AHE7DVOH2ALI3QASZVPSGM2M7WJ55W637R2H66UOQRKHRGI5K6VPGYCYJD3IIPSGNLQS7RP7CATH4QH7KGDQJOFQWHXBPUBLS7EBMNCKD6CLV4LPPOOZVX54UA7LABYAI3KFDMLX2II7M7EAU3MDYBO4OQYEDNQDOOOEFBO3PHR2QDVLF5DCKT3FUVUMJ2YQTZTEBVKKOWJDHWQ"
    },
    "new": False
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.e0b510e7-fe1b-4679-92a9-90219f088130",
    "locale": "en-US",
    "timestamp": "2017-02-04T03:38:06Z",
    "intent": {
      "name": "SayCity",
      "slots": {
        "City": {
          "name": "City",
          "value": "farfigflugen"
        }
      }
    }
  },
  "version": "1.0"
}

	print('{0}'.format(lambda_handler(payload, None)))
