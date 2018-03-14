var highlights = [8, 12, 18];
var state = 'NJ';
var city = 'Fair_Lawn';
//var state = 'CA';
//var city = 'Los_Angeles';

function on_load(){
    document.getElementById('api_key').addEventListener('keyup', function(event){
        if(event.keyCode === 13){
            save_api_key();
        }
    });
    if(typeof(Storage) == 'undefined'){
        error_div = document.getElementById('error');
        error_div.innerHTML = 'Local Storage Error';
        error_div.className = 'error';
    } else {
        api_key = localStorage.getItem('api_key');
        if(api_key){
            get_weather(state, city);
        } else {
            document.getElementById('key_container').className = '';
            document.getElementById('weather').className = 'hidden';
        }
    }
}

function toggle_edit(){
    time_select = document.getElementById('time_select');
    if(time_select.className == 'hidden'){
        time_select.className = 'time_select';
    } else {
        time_select.className = 'hidden';
    }
}

function save_api_key(){
    localStorage.setItem('api_key', document.getElementById('api_key').value);
    document.getElementById('key_container').className = 'hidden';
    document.getElementById('weather').className = 'weather';
    get_weather(state, city);
}

function get_weather(state, city){
    document.getElementById('pacifier').className = 'pacifier';
    api_key = localStorage.getItem('api_key');
    var xmlhttp = new XMLHttpRequest();
    var url = 'https://api.wunderground.com/api/'
        + api_key + '/'
        + '/hourly/q/'
        + state + '/'
        + city + '.json'

    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var weather_data = JSON.parse(this.responseText)['hourly_forecast'];
            document.getElementById('pacifier').className = 'hidden';
            process_weather(weather_data, highlights);
        } else if(this.readyState == 4) {
            error_div = document.getElementById('error');
            error_div.className = 'error';
            error_div.innerHTML = 'Wunderground Error<br />' + this.responseText;
            document.getElementById('key_container').className = '';
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
            //delete highlights[highlight_index];
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

    temperature = parseInt(temperature);
    temperature_class = 'cold';
    if(temperature >= 50 && temperature < 75){
        temperature_class = 'temperate';
    }else if(temperature >= 75){
        temperature_class = 'hot';
    }

    condition_image = conditions['Unknown']
    if(condition in conditions){
        condition_image = conditions[condition];
    } else {
        console.log(condition);
    }

    new_content = '<div class="highlight">'
        + '<div class="time">' + time + '</div>'
        + '<div class="condition">'
        +   '<img src="' + condition_image + '" />'
        + '</div>'
        + '<div class="temperature ' + temperature_class + '">' + temperature + '&deg;</div>'
        + '</div>';
    weather_element.innerHTML += new_content;
}
