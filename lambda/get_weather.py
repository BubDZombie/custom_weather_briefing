#!/usr/bin/env python

import boto3
from datetime import datetime
import json
import os
import urllib2

help_message = '''
Welcome to five cast. Set your state by saying set state, like five cast set state New Jersey.
Set your city by saying set city, like five cast set city Fair Lawn.
Tell five cast what part of the day to highlight by saying add highlight, like five cast add highlight 7 A.M.
Remove a highlight by saying remove higlight, like five cast remove highlight 7 A.M.
Turn five cast off by saying stop.
'''
get_city_message = '''
Your city is {city}.
'''
get_state_message = '''
Your state is {state}.
'''
get_highlights_message = '''
Your highlights are {highlights}.
'''
no_weather_message = '''
I'm sorry, I couldn't find weather for {city}, {state}.
'''
stop_message = '''
Thank you for using Five Cast!
'''

state_code_map = {
        "Alabama": "AL",
        "Alaska": "AK",
        "Arizona": "AZ",
        "Arkansas": "AR",
        "California": "CA",
        "Colorado": "CO",
        "Connecticut": "CT",
        "Delaware": "DE",
        "Florida": "FL",
        "Georgia": "GA",
        "Hawaii": "HI",
        "Idaho": "ID",
        "Illinois": "IL",
        "Indiana": "IN",
        "Iowa": "IA",
        "Kansas": "KS",
        "Kentucky": "KY",
        "Louisiana": "LA",
        "Maine": "ME",
        "Maryland": "MD",
        "Massachusetts": "MA",
        "Michigan": "MI",
        "Minnesota": "MN",
        "Mississippi": "MS",
        "Missouri": "MO",
        "Montana": "MT",
        "Nebraska": "NE",
        "Nevada": "NV",
        "New Hampshire": "NH",
        "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        "North Carolina": "NC",
        "North Dakota": "ND",
        "Ohio": "OH",
        "Oklahoma": "OK",
        "Oregon": "OR",
        "Pennsylvania": "PA",
        "Rhode Island": "RI",
        "South Carolina": "SC",
        "South Dakota": "SD",
        "Tennessee": "TN",
        "Texas": "TX",
        "Utah": "UT",
        "Vermont": "VT",
        "Virginia": "VA",
        "Washington": "WA",
        "West Virginia": "WV",
        "Wisconsin": "WI",
        "Wyoming": "WY"
}

def lambda_handler(event, context):
	user_id = event['session']['user']['userId']
	config = get_config(user_id)
        intent = 'Help'
        try:
                intent = event['request']['intent']['name']
        except:
                pass
	if(intent == 'FiveCast'
			and config.get('state', None)
			and config.get('city', None)
			and config.get('highlights', None)):
		return(read_briefing(config))
	elif(intent == 'FiveCast'):
		return(build_response(help_message))
	elif(intent == 'SetCity'):
		config['city'] = event['request']['intent']['slots']['City']['value']
		set_config(config)
                return(get_city(config))
	elif(intent == 'GetCity'):
                return(get_city(config))
        elif(intent == 'SetState'):
                state = event['request']['intent']['slots']['State']['value']
                state = state_code_map.get(state, state)
                config['state'] = state
                set_config(config)
                return(get_state(config))
        elif(intent == 'GetState'):
                return(get_state(config))
	elif(intent == 'AddHighlight'):
                config = add_highlight(event['request']['intent']['slots']['Time']['value'], config)
                return(get_highlights(config))
	elif(intent == 'RemoveHighlight'):
                config = remove_highlight(event['request']['intent']['slots']['Time']['value'], config)
                return(get_highlights(config))
	elif(intent == 'GetHighlights'):
                return(get_highlights(config))
        elif(intent == 'Stop'):
                return(build_response(stop_message, True))
        else:
                return(build_response(help_message))

def get_city(config):
        city = config.get('city', 'not set')
        if(not city):
                city = 'not set'
        return(build_response(get_city_message.format(city=city)))

def get_state(config):
        state = config.get('state', 'not set')
        if(not state):
                state = 'not set'
        return(build_response(get_state_message.format(state=state)))

def add_highlight(time, config):
        if(not time in config['highlights']):
                config['highlights'].append(time)
                config['highlights'].sort()
                set_config(config)
        return(config)

def remove_highlight(time, config):
        config['highlights'].remove(time)
        set_config(config)
        return(config)

def get_highlights(config):
        highlights = None
        if(not config.get('highlights', None)):
                highlights = 'not set'
        elif(len(config['highlights']) > 1):
                highlights = twelve_hour_highlights(config['highlights'])
                highlights.insert(-1, 'and')
                highlights = ', '.join(highlights)
        else:
                highlights = ', '.join(twelve_hour_highlights(config['highlights']))
        return(build_response(get_highlights_message.format(highlights=highlights)))

def debug_slots(event):
        response = []
        for slot_name, slot_value in event['request']['intent']['slots'].iteritems():
                response.append(slot_name)
                for key, value in slot_value.iteritems():
                        response.extend([key, value])
        return(build_response('Slots are {slots}.'.format(slots=' '.join(response))))

def twelve_hour_highlights(highlights):
        '''Given a list of highlights in 24 hour time, return a list of highlights
        in 12 hour time'''

        twelve_hour_highlights = []
        for highlight in highlights:
                time = datetime.strptime(highlight, '%H:%M')
                twelve_hour_highlights.append(datetime.strftime(time, '%I:%M %p'))
        return(twelve_hour_highlights)

def read_briefing(config):
	state = config['state']
	city = '_'.join([word.capitalize() for word in config['city'].split()])
	highlights = twelve_hour_highlights(config['highlights'])
        wunderground_response = None
        highlight_responses = []
        
	try:
		# Get the hourly weather forecast from the Weather Underground API.
		url = 'http://api.wunderground.com/api/{key}/hourly/q/{state}/{city}.json'.format(
			key=os.environ['WUNDERGROUND_KEY'],
			state=state,
			city=city)
		wunderground_response = urllib2.urlopen(url)
		wunderground_response = json.loads(wunderground_response.read())

                # Get details for each highlight time.
                today = wunderground_response['hourly_forecast'][0]['FCTTIME']['mday']
                for hour in wunderground_response['hourly_forecast']:
                        if(hour['FCTTIME']['civil'] in highlights and hour['FCTTIME']['mday'] == today):
                                highlight_responses.append('{time}: {temp} and {condition}.'.format(
                                        time=hour['FCTTIME']['civil'],
                                        temp=hour['feelslike']['english'],
                                        condition=hour['condition']))

	except Exception as e:
                pass

        if(highlight_responses):
                return(build_response(' '.join(highlight_responses)))
        else:
                return(build_response(no_weather_message.format(city=config['city'], state=config['state'])))

def build_response(text, should_end_session=False):
	return({
		'version': '1.0',
		'response': {
			'outputSpeech': {
				'type': 'PlainText',
				'text': text.replace('\n', ' ')
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
