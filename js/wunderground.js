var highlights = [8, 12, 18];
var state = 'NJ';
var city = 'Fair_Lawn';
var conditions = []
conditions['Light Drizzle'] = '../img/cloud_rain.png';
conditions['Heavy Drizzle'] = '../img/cloud_rain.png';
conditions['Light Rain'] = '../img/cloud_rain.png';
conditions['Heavy Rain'] = '../img/cloud_rain.png';
conditions['Light Snow'] = '../img/cloud_snow.png';
conditions['Heavy Snow'] = '../img/cloud_snow.png';
conditions['Light Snow Grains'] = '../img/cloud_snow.png';
conditions['Heavy Snow Grains'] = '../img/cloud_snow.png';
conditions['Light Ice Crystals'] = '../img/cloud_snow.png';
conditions['Heavy Ice Crystals'] = '../img/cloud_snow.png';
conditions['Light Ice Pellets'] = '../img/cloud_snow.png';
conditions['Heavy Ice Pellets'] = '../img/cloud_snow.png';
conditions['Light Hail'] = '../img/cloud_snow.png';
conditions['Heavy Hail'] = '../img/cloud_snow.png';
conditions['Light Mist'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Mist'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Fog'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Fog'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Fog Patches'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Fog Patches'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Smoke'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Smoke'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Volcanic Ash'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Volcanic Ash'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Widespread Dust'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Widespread Dust'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Sand'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Sand'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Haze'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Haze'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Spray'] = '../img/cloud_rain.png';
conditions['Heavy Spray'] = '../img/cloud_rain.png';
conditions['Light Dust Whirls'] = '../img/twister.png';
conditions['Heavy Dust Whirls'] = '../img/twister.png';
conditions['Light Sandstorm'] = '../img/twister.png';
conditions['Heavy Sandstorm'] = '../img/twister.png';
conditions['Light Low Drifting Snow'] = '../img/cloud_snow.png';
conditions['Heavy Low Drifting Snow'] = '../img/cloud_snow.png';
conditions['Light Low Drifting Widespread Dust'] = '../img/dark_cloud_light_cloud.png';
conditions['Heavy Low Drifting Widespread Dust'] = '../img/dark_cloud_light_cloud.png';
conditions['Light Low Drifting Sand'] = '../img/twister.png';
conditions['Heavy Low Drifting Sand'] = '../img/twister.png';
conditions['Light Blowing Snow'] = '../img/cloud_snow.png';
conditions['Heavy Blowing Snow'] = '../img/cloud_snow.png';
conditions['Light Blowing Widespread Dust'] = '../img/twister.png';
conditions['Heavy Blowing Widespread Dust'] = '../img/twister.png';
conditions['Light Blowing Sand'] = '../img/twister.png';
conditions['Heavy Blowing Sand'] = '../img/twister.png';
conditions['Light Rain Mist'] = '../img/cloud_rain.png';
conditions['Heavy Rain Mist'] = '../img/cloud_rain.png';
conditions['Light Rain Showers'] = '../img/cloud_rain.png';
conditions['Heavy Rain Showers'] = '../img/cloud_rain.png';
conditions['Light Snow Showers'] = '../img/cloud_snow.png';
conditions['Heavy Snow Showers'] = '../img/cloud_snow.png';
conditions['Light Snow Blowing Snow Mist'] = '../img/cloud_snow.png';
conditions['Heavy Snow Blowing Snow Mist'] = '../img/cloud_snow.png';
conditions['Light Ice Pellet Showers'] = '../img/cloud_snow_rain.png';
conditions['Heavy Ice Pellet Showers'] = '../img/cloud_snow_rain.png';
conditions['Light Hail Showers'] = '../img/cloud_snow.png';
conditions['Heavy Hail Showers'] = '../img/cloud_snow.png';
conditions['Light Small Hail Showers'] = '../img/cloud_snow.png';
conditions['Heavy Small Hail Showers'] = '../img/cloud_snow.png';
conditions['Light Thunderstorm'] = '../img/dark_cloud_lightning.png';
conditions['Heavy Thunderstorm'] = '../img/dark_cloud_lightning.png';
conditions['Light Thunderstorms and Rain'] = '../img/dark_cloud_lightning_rain.png';
conditions['Heavy Thunderstorms and Rain'] = '../img/dark_cloud_lightning_rain.png';
conditions['Light Thunderstorms and Snow'] = '../img/dark_cloud_lightning_snow.png';
conditions['Heavy Thunderstorms and Snow'] = '../img/dark_cloud_lightning_snow.png';
conditions['Light Thunderstorms and Ice Pellets'] = '../img/dark_cloud_lightning_snow.png';
conditions['Heavy Thunderstorms and Ice Pellets'] = '../img/dark_cloud_lightning_snow.png';
conditions['Light Thunderstorms with Hail'] = '../img/dark_cloud_lightning_snow.png';
conditions['Heavy Thunderstorms with Hail'] = '../img/dark_cloud_lightning_snow.png';
conditions['Light Thunderstorms with Small Hail'] = '../img/dark_cloud_lightning_snow.png';
conditions['Heavy Thunderstorms with Small Hail'] = '../img/dark_cloud_lightning_snow.png';
conditions['Light Freezing Drizzle'] = '../img/cloud_snow_rain.png';
conditions['Heavy Freezing Drizzle'] = '../img/cloud_snow_rain.png';
conditions['Light Freezing Rain'] = '../img/cloud_snow_rain.png';
conditions['Heavy Freezing Rain'] = '../img/cloud_snow_rain.png';
conditions['Light Freezing Fog'] = '../img/cloud_snow_rain.png';
conditions['Heavy Freezing Fog'] = '../img/cloud_snow_rain.png';
conditions['Patches of Fog'] = '../img/dark_cloud_light_cloud.png';
conditions['Shallow Fog'] = '../img/dark_cloud_light_cloud.png';
conditions['Partial Fog'] = '../img/dark_cloud_light_cloud.png';
conditions['Overcast'] = '../img/dark_cloud_light_cloud.png';
conditions['Clear'] = '../img/sun.png';
conditions['Partly Cloudy'] = '../img/sun_cloud.png';
conditions['Mostly Cloudy'] = '../img/sun_cloud.png';
conditions['Scattered Clouds'] = '../img/dark_cloud_light_cloud.png';
conditions['Small Hail'] = '../img/cloud_snow_rain.png';
conditions['Squalls'] = '../img/twister.png';
conditions['Funnel Cloud'] = '../img/twister.png';
conditions['Unknown Precipitation'] = '../img/cloud_rain.png';
conditions['Unknown'] = '../img/question_mark.png';

function on_load(){
		if(typeof(Storage) == 'undefined'){
				document.getElementById('local_storage_error').className = '';
		} else {
				api_key = localStorage.getItem('api_key');
				if(api_key){
						get_weather(state, city);
				} else {
						document.getElementById('key_container').className = '';
				}
		}
}

function save_api_key(){
		localStorage.setItem('api_key', document.getElementById('api_key').value);
		get_weather(state, city);
}

function get_weather(state, city){
		api_key = localStorage.getItem('api_key');
		var xmlhttp = new XMLHttpRequest();
		var url = 'https://api.wunderground.com/api/'
				+ api_key + '/'
				+ '/hourly/q/'
				+ state + '/'
				+ city + '.json'

		xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
						var weather_data = JSON.parse(this.responseText)['hourly_forecast'];
						process_weather(weather_data, highlights);
				}
		};

		xmlhttp.open("GET", url, true);
		xmlhttp.send();
}

function process_weather(weather_data, highlights){
		var day = null;
		for(i = 0; i < weather_data.length; i++){
				hour = weather_data[i];
				current_day = hour['FCTTIME']['month_name']
						+ ' ' + hour['FCTTIME']['mday']
				highlight_index = highlights.indexOf(parseInt(hour['FCTTIME']['hour']));
				if(highlight_index >= 0){
						if(day != current_day){
								add_day(current_day);
								day = current_day;
						}
						delete highlights[highlight_index];
						add_highlight(
								hour['FCTTIME']['civil'],
								hour['condition'],
								hour['feelslike']['english']);
				}
		}
}

function add_day(day){
		weather_element = document.getElementById('weather');
		new_content = '<div class="day">' + day + '</div>';
		weather_element.innerHTML += new_content;
}

function add_highlight(time, condition, temperature){
		weather_element = document.getElementById('weather');
		new_content = '<div class="highlight">'
				+ '<div class="time">' + time + '</div>'
				+ '<div class="condition">' + condition + '</div>'
				+ '<div class="temperature">' + temperature + '</div>'
				+ '</div>';
		weather_element.innerHTML += new_content;
}
