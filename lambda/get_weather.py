#!/usr/bin/env python

import boto3
import datetime
import json
import os
import urllib2

def lambda_handler(event, context):
	return(read_briefing({'state': 'NJ', 'city': 'Fair_Lawn', 'highlights': ['7:00 AM', '12:00 PM', '6:00 PM', '11:00 PM']}))

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

	# Build the Alexa response.
	alexa_response = {
		'version': '1.0',
		'response': {
			'outputSpeech': {
				'type': 'PlainText',
				'text': ' '.join(highlight_responses)
			},
			'shouldEndSession': True
		}
	}
	return(alexa_response)

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
	set_config({'user_id': 'matt', 'city': 'Fair_Lawn', 'state': 'NJ', 'highlights': ['7:00 AM', '8:00 AM']})
	print('{0}'.format(get_config('matt')))
