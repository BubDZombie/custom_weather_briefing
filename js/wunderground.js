var state = 'NJ';
var city = 'Fair_Lawn';
//var state = 'FL';
//var city = 'Orlando';

function onload(){
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
        var api_key = localStorage.getItem('api_key');
        if(api_key){
            get_weather(state, city);
        } else {
            document.getElementById('weather').className = 'hidden';
        }
    }
}

function open_edit(){
    document.getElementById('settings_container').className = 'settings_container';
    document.getElementById('weather').className = 'hidden';
    document.getElementById('open_edit').className = 'hidden';
    document.getElementById('close_edit').className = 'edit';
    edit_render_highlights();
}

function close_edit(){
    document.getElementById('settings_container').className = 'hidden';
    var weather = document.getElementById('weather').className = 'weather';
    document.getElementById('close_edit').className = 'hidden';
    document.getElementById('open_edit').className = 'edit';
    get_weather(state, city);
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
    console.log("edit_render_highlights highlights: " + highlights);
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
    console.log("printable_time(" + hour + ")");
    var ampm = 'AM';
    if(hour == 0){
        hour = 12;
    } else if(hour == 12){
        ampm = 'PM';
    } if(hour > 12){
        hour -= 12;
        ampm = 'PM';
    }
    console.log("Became " + hour + " " + ampm);
    return(String(hour).padStart(2, '0') + ':00 ' + ampm);
}

function save_api_key(){
    localStorage.setItem('api_key', document.getElementById('api_key').value);
    document.getElementById('key_container').className = 'hidden';
    document.getElementById('weather').className = 'weather';
    get_weather(state, city);
}

function get_weather(state, city){
    document.getElementById('pacifier').className = 'pacifier';
    document.getElementById('weather').className = 'hidden';
    var api_key = localStorage.getItem('api_key');
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
            process_weather(weather_data, highlights);
        } else if(this.readyState == 4) {
            error_div = document.getElementById('error');
            error_div.className = 'error';
            error_div.innerHTML = 'Wunderground Error<br />' + this.responseText;
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function process_weather(weather_data, highlights){
    var highlights = localStorage.getItem('highlights');
    if(!highlights){
        highlights = [];
    } else {
        highlights = JSON.parse(highlights);
    }
    var day = null;
    for(i = 0; i < weather_data.length; i++){
        var hour = weather_data[i];
        var current_day = hour['FCTTIME']['month_name']
            + ' ' + hour['FCTTIME']['mday']
        var highlight_index = highlights.indexOf(parseInt(hour['FCTTIME']['hour']));
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
    var weather_element = document.getElementById('weather');
    var new_content = '<div class="day">' + day + '</div>';
    weather_element.innerHTML += new_content;
}

function add_highlight(time, condition, temperature){
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
