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

def get_config(user_id):
	dynamo = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url='dynamodb.us-east-1.amazonaws.com')
	table = dynamo.Table('weather_settings')
	try:
		response = table.get_item(Key=user_id)
	except ClientError as e:
		return({'city': None, 'state': None, 'highlights': []})
	else:
		return(response['Item'])

if(__name__ == '__main__'):
	print('{0}'.format(lambda_handler(None, None)))
