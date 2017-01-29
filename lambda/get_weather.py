#!/usr/bin/env python

import json
import os
import urllib2

def lambda_handler(event, context):
	state = 'NJ'
	city = 'Fair_Lawn'
	highlights = ['7:00 AM', '12:00 PM', '6:00 PM']

	url = 'http://api.wunderground.com/api/{key}/hourly/q/{state}/{city}.json'.format(
		key=os.environ['WUNDERGROUND_KEY'],
		state=state,
		city=city)
	response = urllib2.urlopen(url)
	response = json.loads(response.read())

	highlight_responses = []
	for hour in response['hourly_forecast']:
		if(hour['FCTTIME']['civil'] in highlights):
			highlight_responses.append('{time}: {temp} and {condition}.'.format(
				time=hour['FCTTIME']['civil'],
				temp=hour['feelslike']['english'],
				condition=hour['condition']))

	return(' '.join(highlight_responses))

if(__name__ == '__main__'):
	print(lambda_handler(None, None))
