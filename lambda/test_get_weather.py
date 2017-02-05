#!/usr/bin/env python

import unittest
import get_weather

class TestGetWeather(unittest.TestCase):
    def setUp(self):
        self.five_cast_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "FiveCast",
                        }
                },
                "version": "1.0"
        }
        self.set_city_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "SetCity",
                                "slots": {
                                        "City": {
                                                "name": "City",
                                                "value": "fair lawn"
                                        }
                                }
                        }
                },
                "version": "1.0"
        }
        self.get_city_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "GetCity",
                        }
                },
                "version": "1.0"
        }
        self.set_state_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "SetState",
                                "slots": {
                                        "State": {
                                                "name": "State",
                                                "value": "NJ"
                                        }
                                }
                        }
                },
                "version": "1.0"
        }
        self.add_highlight_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "AddHighlight",
                                "slots": {
                                        "Time": {
                                                "name": "Time",
                                                "value": "23:00"
                                        }
                                }
                        }
                },
                "version": "1.0"
        }
        self.add_highlight_payload_two = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "AddHighlight",
                                "slots": {
                                        "Time": {
                                                "name": "Time",
                                                "value": "22:00"
                                        }
                                }
                        }
                },
                "version": "1.0"
        }
        self.remove_highlight_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "RemoveHighlight",
                                "slots": {
                                        "Time": {
                                                "name": "Time",
                                                "value": "23:00"
                                        }
                                }
                        }
                },
                "version": "1.0"
        }
        self.get_highlights_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "GetHighlights",
                        }
                },
                "version": "1.0"
        }
        self.help_payload = {
                "session": {
                        "sessionId": "SessionId.9744c5f0-958c-4cb0-b7eb-973cfc38e3e0",
                        "application": {
                                "applicationId": "test_app_id"
                        },
                        "attributes": {},
                        "user": {
                                "userId": "test_user_id"
                        },
                        "new": False
                },
                "request": {
                        "type": "IntentRequest",
                        "requestId": "test_request_id",
                        "locale": "en-US",
                        "timestamp": "2017-02-04T03:38:06Z",
                        "intent": {
                                "name": "Help",
                        }
                },
                "version": "1.0"
        }

    def test_set_city(self):
        response = get_weather.lambda_handler(self.set_city_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_get_city(self):
        response = get_weather.lambda_handler(self.get_city_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_set_state(self):
        response = get_weather.lambda_handler(self.set_state_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_add_highlight(self):
        response = get_weather.lambda_handler(self.add_highlight_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_five_cast(self):
        response = get_weather.lambda_handler(self.five_cast_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_remove_highlight(self):
        response = get_weather.lambda_handler(self.remove_highlight_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_get_highlights(self):
        get_weather.lambda_handler(self.add_highlight_payload, None)
        get_weather.lambda_handler(self.add_highlight_payload_two, None)
        response = get_weather.lambda_handler(self.get_highlights_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_fivecast_help(self):
        response = get_weather.lambda_handler(self.help_payload, None)
        print(response['response']['outputSpeech']['text'])
    def test_everything(self):
        get_weather.lambda_handler(self.set_city_payload, None)
        get_weather.lambda_handler(self.set_state_payload, None)
        get_weather.lambda_handler(self.add_highlight_payload, None)
        response = get_weather.lambda_handler(self.five_cast_payload, None)
        print(response['response']['outputSpeech']['text'])        

if __name__ == '__main__':
    unittest.main()
