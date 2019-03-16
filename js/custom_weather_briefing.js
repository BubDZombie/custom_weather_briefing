var wunderground_api_key = '2109b5cfe5d83404';
var open_weather_map_api_key = '18f9cc81f59f7c21dfa87929b4ebc95d'

function open_edit(){
    var saved_state = localStorage.getItem('state');
    var state_select = document.getElementById('state');
    while(state_select.options.length > 0){
        state_select.remove(0);
    }
    for(state in state_cities){
        var state_option = document.createElement('option');
        state_option.text = state;
        if(state == saved_state){
            state_option.selected = 'selected';
        }
        state_select.add(state_option);
    }
    edit_populate_cities();
    document.getElementById('settings_container').className = 'settings_container';
    document.getElementById('weather').className = 'hidden';
    document.getElementById('open_edit').className = 'hidden';
    document.getElementById('close_edit').className = 'edit';
    edit_render_highlights();
}

function edit_populate_cities(){
    var saved_city = localStorage.getItem('city');
    var city_select = document.getElementById('city');
    while(city_select.options.length > 0){
        city_select.remove(0);
    }
    var state_select = document.getElementById('state');
    cities = state_cities[state_select.value];
    for(var i = 0; i < cities.length; i++){
        var city = cities[i];
        var city_option = document.createElement('option');
        city_option.text = city;
        if(city == saved_city){
            city_option.selected = 'selected';
        }
        city_select.add(city_option);
    }
}

function edit_save_location(){
    var state_select = document.getElementById('state');
    var city_select = document.getElementById('city')
    localStorage.setItem('state', state_select.value);
    localStorage.setItem('city', city_select.value);
    var p = document.getElementById('p_select_location');
    red = 0x13;
    green = 0xD7;
    blue = 0x38;
    p.style.color = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    setTimeout(function(){
        while(red > 0 || green > 0 || blue > 0){
            if(red > 0){ red -= 1; }
            if(green > 0){ green -= 1; }
            if(blue > 0){ blue -= 1; }
        }
        p.style.color = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    }, 2000);
}

function close_edit(){
    document.getElementById('settings_container').className = 'hidden';
    var weather = document.getElementById('weather').className = 'weather';
    document.getElementById('close_edit').className = 'hidden';
    document.getElementById('open_edit').className = 'edit';
    get_open_weather();
}

function edit_add_highlight(){
    var highlights = localStorage.getItem('highlights');
    if(!highlights){
        highlights = [];
    } else {
        highlights = JSON.parse(highlights);
    }
    var new_highlight = parseInt(document.getElementById("highlight_select").value);
    highlights = unique_sorted_insert(new_highlight, highlights);
    localStorage.setItem('highlights', JSON.stringify(highlights));
    edit_render_highlights();
}

function edit_remove_highlight(hour){
    var highlights = localStorage.getItem('highlights');
    if(!highlights){
        highlights = [];
    } else {
        highlights = JSON.parse(highlights);
    }
    var i = highlights.indexOf(hour);
    if(i >= 0){
        highlights.splice(i, 1);
        localStorage.setItem('highlights', JSON.stringify(highlights));
    }
    edit_render_highlights();
}

function unique_sorted_insert(new_item, items){
    if(items.length == 0){
        return([new_item]);
    } else {
        var i = 0;
        while(new_item > items[i] && i < items.length){
            i++;
        }
        if(items[i] != new_item){
            items.splice(i, 0, new_item);
        }
    }
    return(items);
}

function edit_render_highlights(){
    var highlights = localStorage.getItem('highlights');
    if(!highlights){
        return;
    }
    highlights = JSON.parse(highlights);
    var inner_html = '<ul>';
    //for(var highlight in highlights){
    for(var i = 0; i < highlights.length; i++){
        inner_html += '<li>'
            + '<div class="edit_highlight">'
            + printable_time(highlights[i])
            + '</div>'
            + '<div class="garbage">'
            + '<a href="javascript:;" onclick="edit_remove_highlight(' + highlights[i] + ');">X</a>'
            + '</div>'
            + '</li>';
    }
    inner_html += '</ul>';
    document.getElementById('highlights').innerHTML = inner_html;
}

// Given an hour between 0 and 23 inclusive, return a string 12 hour time.
function printable_time(hour){
    var ampm = 'AM';
    if(hour == 0){
        hour = 12;
    } else if(hour == 12){
        ampm = 'PM';
    } if(hour > 12){
        hour -= 12;
        ampm = 'PM';
    }
    return(String(hour).padStart(2, '0') + ':00 ' + ampm);
}

function get_open_weather(){
    var state = localStorage.getItem('state');
    var city = localStorage.getItem('city');
    if(!state || !city){
        open_edit();
        return;
    }
    state = state_map[state];
    city = encodeURI(city);
    document.getElementById('pacifier').className = 'pacifier';
    document.getElementById('weather').className = 'hidden';
    var xmlhttp = new XMLHttpRequest();
    var url = 'https://api.openweathermap.org/data/2.5/forecast'
        + '?q=' + city + ',' + state + ',us'
        + '&units=imperial'
        + '&APPID=' + open_weather_map_api_key;

    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var weather_data = JSON.parse(this.responseText);
            document.getElementById('pacifier').className = 'hidden';
            weather = document.getElementById('weather');
            weather.className = 'weather';
            weather.innerHTML = '';
            document.getElementById('error').className = 'hidden';
            process_open_weather(weather_data);
        } else if(this.readyState == 4) {
            error_div = document.getElementById('error');
            error_div.className = 'error';
            error_div.innerHTML = 'Open Weather Map Error<br />' + this.responseText;
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function get_wunderground_weather(){
	var state = localStorage.getItem('state');
    var city = localStorage.getItem('city');
    if(!state || !city){
        open_edit();
        return;
    }
    state = state_map[state];
    city = city.split(' ').join('_');
    document.getElementById('pacifier').className = 'pacifier';
    document.getElementById('weather').className = 'hidden';
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
            weather = document.getElementById('weather');
            weather.className = 'weather';
            weather.innerHTML = '';
            document.getElementById('error').className = 'hidden';
            process_wunderground_weather(weather_data);
        } else if(this.readyState == 4) {
            error_div = document.getElementById('error');
            error_div.className = 'error';
            error_div.innerHTML = 'Wunderground Error<br />' + this.responseText;
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function process_open_weather(weather_data){
    var highlights = JSON.parse(localStorage.getItem('highlights'));
    if(!highlights){
        open_edit();
        return;
    }
    render_location();
    var rendered_day = null;
    var last_day = null;
    var weather_i = 0;
    var highlights_i = 0;
    while(weather_i < weather_data['list'].length){
        var hour_data = weather_data['list'][weather_i];
        var tz_offset_milis = (new Date()).getTimezoneOffset() * 60 * 1000;
        var date = date = new Date(Date.parse(hour_data['dt_txt']) - tz_offset_milis);
        var hour = date.getHours();
        var day = date.toDateString().split(" ").slice(0, 3).join(" ");
        if(last_day != day){
            highlights_i = 0;
            last_day = day;
        }
        if(hour >= highlights[highlights_i]
                && Math.abs(hour - highlights[highlights_i]) < 3){
            if(day != rendered_day){
                render_day(day);
                rendered_day = day;
            }
            render_highlight(
                printable_time(highlights[highlights_i]),
                hour_data['weather'][0]['main'],
                hour_data['main']['temp']);
        }
        while(highlights[highlights_i] <= hour
                && highlights_i < highlights.length - 1){
            highlights_i++;
        }
        weather_i++;
    }
}

function process_wunderground_weather(weather_data){
    var highlights = JSON.parse(localStorage.getItem('highlights'));
    if(!highlights){
        open_edit();
        return;
    }
    render_location();
    var day = null;
    for(i = 0; i < weather_data.length; i++){
        var hour = weather_data[i];
        var current_day = hour['FCTTIME']['month_name']
            + ' ' + hour['FCTTIME']['mday']
        var highlight_index = highlights.indexOf(parseInt(hour['FCTTIME']['hour']));
        if(highlight_index >= 0){
            if(day != current_day){
                render_day(current_day);
                day = current_day;
            }
             render_highlight(
                hour['FCTTIME']['civil'],
                hour['condition'],
                hour['feelslike']['english']);
        }
    }
}

function render_location(){
    var city = localStorage.getItem('city');
    var state = localStorage.getItem('state');
    if(!city || !state){
        open_edit();
        return;
    }
    var weather_element = document.getElementById('weather');
    var new_content = '<div class="location">' + city + ', ' + state + '</div>';
    weather_element.innerHTML += new_content;
}

function render_day(day){
    var weather_element = document.getElementById('weather');
    var new_content = '<div class="day">' + day + '</div>';
    weather_element.innerHTML += new_content;
}

function render_highlight(time, condition, temperature){
    var weather_element = document.getElementById('weather');

    var temperature = parseInt(temperature);
    var temperature_class = 'cold';
    if(temperature >= 50 && temperature < 75){
        temperature_class = 'temperate';
    }else if(temperature >= 75){
        temperature_class = 'hot';
    }

    var condition_image = conditions['Unknown']
    if(condition in conditions){
        condition_image = conditions[condition];
    } else {
        console.log(condition);
    }

    var new_content = '<div class="highlight">'
        + '<div class="time">' + time + '</div>'
        + '<div class="condition">'
        +   '<img src="' + condition_image + '" />'
        + '</div>'
        + '<div class="temperature ' + temperature_class + '">' + temperature + '&deg;</div>'
        + '</div>';
    weather_element.innerHTML += new_content;
}
