var highlights = [8, 12, 18];

function on_load(){
		if(typeof(Storage) == 'undefined'){
				document.getElementById('key_container').style.visibility = 'hidden';
				document.getElementById('local_storage_error').style.visibility = 'visible';
		} else {
				api_key = localStorage.getItem('api_key');
				if(api_key){
						document.getElementById('key_container').style.visibility = 'hidden';
						console.log('The API key is ' + api_key);
						document.getElementById('weather').innerHTML = 'Some Weather!'
				}
		}
}

function save_api_key(){
		localStorage.setItem('api_key', document.getElementById('api_key').value);
}

function get_weather(state, city){
		api_key = localStorage.getItem('api_key');
		var xmlhttp = new XMLHttpRequest();
		var url = 'https://api.wunderground.com/api/'
				+ '/hourly/q/'
				+ state + '/'
				+ city + '.json'

		xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
						var myArr = JSON.parse(this.responseText);
						process_weather(myArr);
				}
		};

		xmlhttp.open("GET", url, true);
		xmlhttp.send();
}

function process_weather(weather_data, highlights){
}
