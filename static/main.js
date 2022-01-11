var todayData = {};
var futureData = [];
var latlong;

window.onload = function () {
    clearpage();
}

function clearpage() {
    document.getElementById("curr_weather_card").style.display = "none";
    document.getElementById("selected_weather_card").style.display = "none";
    document.getElementById("table_container").style.display = "none";
    document.getElementById("charts").style.display = "none";
    document.getElementById("plots").style.display = "none";
    document.getElementById('no_records').style.display = 'none';
    document.getElementById("checkbox_id").checked = false;
    document.getElementById("street_id").value = "";
    document.getElementById("city_id").value = "";
    document.getElementById("state_id").value = "";
    document.getElementById("street_id").disabled = false;
    document.getElementById("city_id").disabled = false;
    document.getElementById("state_id").disabled = false;
    document.getElementById("table_contents").innerHTML = "";
}

function toggle_checkbox(check_box) {
    if (check_box.checked) {
        // clear and disable all fields if check box is checked
        document.getElementById("street_id").disabled = true;
        document.getElementById("city_id").disabled = true;
        document.getElementById("state_id").disabled = true;
        document.getElementById("street_id").value = "";
        document.getElementById("city_id").value = "";
        document.getElementById("state_id").value = "";
        document.getElementById("table_contents").innerHTML = "";
    }
    else {
        // enable all fields if check box is unchecked
        document.getElementById("street_id").disabled = false;
        document.getElementById("city_id").disabled = false;
        document.getElementById("state_id").disabled = false;
    }
}

function get_weather() {
    // alert("In get_weather");
    var lat_long;
    var format_address;
    // if check box is unchecked, get values of all fields
    if (!document.getElementById("checkbox_id").checked) {
        street = document.getElementById("street_id").value.replace(" ", "+");
        state = document.getElementById("state_id").value.replace(" ", "+");
        city = document.getElementById("city_id").value.replace(" ", "+");
        address = street + "+" + city + "+" + state
        url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBmMa0wk35WY_HEudCHu3aEGE0S7DqzcNI"
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    data = JSON.parse(xhr.response);
                    lat_long = data.results[0].geometry.location.lat + "," + data.results[0].geometry.location.lng;
                    format_address = data.results[0]['formatted_address'];
                    latlong = lat_long
                    weather_call(lat_long, format_address);
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }
    else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://ipinfo.io/?token=b1ac7c2d0e80a3', true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    data = JSON.parse(xhr.response)
                    lat_long = data.loc
                    // get formatted address
                    format_address = data.city + ', ' + data.region;
                    latlong = lat_long
                    weather_call(lat_long, format_address);
                            
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }
    
}

function get_weather_image(weather_code) {
    switch (weather_code) {
        case 4201: return { 'description': 'Heavy Rain', 'image': 'static/Images/rain_heavy.svg' };
        case 4001: return { 'description': 'Rain', 'image': 'static/Images/rain.svg' };
        case 4200: return { 'description': 'Light Rain', 'image': 'static/Images/rain_light.svg' };
        case 6201: return { 'description': 'Heavy Freezing Rain', 'image': 'static/Images/freezing_rain_heavy.svg' };
        case 6001: return { 'description': 'Freezing Rain', 'image': 'static/Images/freezing_rain.svg' };
        case 6200: return { 'description': 'Light Freezing Rain', 'image': 'static/Images/freezing_rain_light.svg' };
        case 6000: return { 'description': 'Freezing Drizzle', 'image': 'static/Images/freezing_drizzle.svg' };
        case 4000: return { 'description': 'Drizzle', 'image': 'static/Images/drizzle.svg' };
        case 7101: return { 'description': 'Heavy Ice Pellets', 'image': 'static/Images/ice_pellets_heavy.svg' };
        case 7000: return { 'description': 'Ice Pellets', 'image': 'static/Images/ice_pellets.svg' };
        case 7102: return { 'description': 'Light Ice Pellets', 'image': 'static/Images/ice_pellets_light.svg' };
        case 5101: return { 'description': 'Heavy Snow', 'image': 'static/Images/snow_heavy.svg' };
        case 5000: return { 'description': 'Snow', 'image': 'static/Images/snow.svg' };
        case 5100: return { 'description': 'Light Snow', 'image': 'static/Images/snow_light.svg' };
        case 5001: return { 'description': 'Flurries', 'image': 'static/Images/flurries.svg' };
        case 8000: return { 'description': 'Thunderstorm', 'image': 'static/Images/thunderstorm.svg' };
        case 2100: return { 'description': 'Light Fog', 'image': 'static/Images/fog_light.svg' };
        case 2000: return { 'description': 'Fog', 'image': 'static/Images/fog.svg' };
        case 1001: return { 'description': 'Cloudy', 'image': 'static/Images/cloudy.svg' };
        case 1102: return { 'description': 'Mostly Cloudy', 'image': 'static/Images/mostly_cloudy.svg' };
        case 1101: return { 'description': 'Partly Cloudy', 'image': 'static/Images/partly_cloudy_day.svg' };
        case 1100: return { 'description': 'Mostly Clear', 'image': 'static/Images/mostly_clear_day.svg' };
        case 1000: return { 'description': 'Clear', 'image': 'static/Images/clear_day.svg' };
        case 3000: return { 'description': 'Light Wind', 'image': 'static/Images/light_wind.jpg' };
        case 3001: return { 'description': 'Wind', 'image': 'static/Images/wind.png' };
        case 3002: return { 'description': 'Strong Wind', 'image': 'static/Images/strong-wind.png' };
        default: return { 'description': 'Not Found', 'image': '' };
    }
}

function getPrecipitationType(code) {
    switch (code) {
        case 0: return 'N/A';
        case 1: return 'Rain';
        case 2: return 'Snow';
        case 3: return 'Freezing Rain';
        case 4: return 'Ice Pellets';
        default: return 'N/A';
    }
}

function getDateString(isoDate) {
    var d = new Date(isoDate);
    var options = { weekday: 'long', year: 'numeric', month: 'short', day: '2-digit' };
    dateString = d.toLocaleDateString('en-US', options);
    parts = dateString.split(",");
    mmddparts = parts[1].split(" ");
    return parts[0] + ", " + mmddparts[2] + " " + mmddparts[1] + " " + parts[2];
}

function getformatHours(date) {
    var hours = date.getHours();
    // var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ampm;
    return strTime;
}

function getSunriseSunset(sunriseisoDate, sunsetisoDate) {
    var sunrised = new Date(sunriseisoDate);
    var sunsetd = new Date(sunsetisoDate);
    return getformatHours(sunrised) + "/" + getformatHours(sunsetd);
}

function showCharts(event) {
    let element = event.target || event.srcElement;
    if (element.src.includes('down')) {
        setupCharts();
        element.src = "static/Images/point-up-512.png"
        document.getElementById("plots").style.display = "block";
        // window.scrollTo(0, document.body.scrollHeight);
        // document.getElementById("plots").scrollIntoView(false);
    }
    else {
        element.src = "static/Images/point-down-512.png"
        document.getElementById("plots").style.display = "none";
    }
    // event.preventDefault();
}

function setupCharts() {
    getTempMinMax();
    getWeatherChart();
}

function setupDailyCard(date, data) {
    document.getElementById("daily_card_date").innerHTML = getDateString(date);
    image = get_weather_image(data['weatherCode']);
    document.getElementById("daily_card_img").src = image['image'];
    document.getElementById("daily_card_img").alt = image['description'];
    document.getElementById("daily_card_climate").innerHTML = image['description'];
    document.getElementById("daily_card_temp").innerHTML = data['temperatureMax'] + String.fromCharCode(176) + 'F/' + data['temperatureMin'] + String.fromCharCode(176) + 'F';
    document.getElementById("daily_card_precipitation").innerHTML = getPrecipitationType(data['precipitationType']);
    document.getElementById("daily_card_chance_of_rain").innerHTML = data['precipitationProbability'];
    document.getElementById("daily_card_wind_speed").innerHTML = data['windSpeed'];
    document.getElementById("daily_card_humidity").innerHTML = data['humidity'];
    document.getElementById("daily_card_visibility").innerHTML = data['visibility'];
    document.getElementById("daily_card_sunrise_sunset").innerHTML = getSunriseSunset(data['sunriseTime'], data['sunsetTime']);
    document.getElementById("arrow_button").src = 'static/Images/point-down-512.png'
}

function onRowClick(index) {
    document.getElementById("curr_weather_card").style.display = "none";
    document.getElementById("table_container").style.display = "none";
    setupDailyCard(futureData[index]['startTime'], futureData[index]['values']);
    document.getElementById("selected_weather_card").style.display = "block";
    document.getElementById("charts").style.display = "block";
}

function create_curr_weather_card(data) {
    document.getElementById("formatted_address").innerHTML = data['formatted_address'];
    image = get_weather_image(data['weatherCode']);
    document.getElementById("curr_climate_img").src = image['image'];
    document.getElementById("curr_climate_desc").innerHTML = image['description'];
    document.getElementById("curr_temp_value").innerHTML = data['temperature'];
    document.getElementById("curr_humidity").innerHTML = data['humidity'];
    document.getElementById("curr_pressure").innerHTML = data['pressureSeaLevel'];
    document.getElementById("curr_wind_speed").innerHTML = data['windSpeed'];
    document.getElementById("curr_visibility").innerHTML = data['visibility'];
    document.getElementById("curr_cloud_cover").innerHTML = data['cloudCover'];
    document.getElementById("curr_UV_Level").innerHTML = data['uvIndex'];
    document.getElementById("curr_weather_card").style.display = "flex";
}

function create_weather_table(data) {
    tbody = document.getElementById("table_contents");
    for (i = 1; i <= Math.min(15, data.length - 1); i++) {
        var tr = tbody.insertRow();
        tr.classList.add('weather_row')
        tr.onclick = function (arg) { return function () { onRowClick(arg); }; }(i);
        td = tr.insertCell();
        td.appendChild(document.createTextNode(getDateString(data[i]['startTime'])));
        td = tr.insertCell();
        td.classList.add('status_col');
        img = document.createElement('img');
        var img_data = get_weather_image(data[i]['values']['weatherCode']);
        img.src = img_data['image']
        td.appendChild(img);
        td.appendChild(document.createTextNode(img_data['description']));
        td = tr.insertCell();
        td.appendChild(document.createTextNode(data[i]['values']['temperatureMax']));
        td = tr.insertCell();
        td.appendChild(document.createTextNode(data[i]['values']['temperatureMin']));
        td = tr.insertCell();
        td.appendChild(document.createTextNode(data[i]['values']['windSpeed']));
    }
    document.getElementById("table_container").style.display = "block";
}

function weather_call(lat_long, format_address) {
    var url = "/search_curr_weather?location=" + lat_long
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.response)
                data['formatted_address'] = format_address
                todayData = data;
                if(Object.keys(todayData).length && document.getElementById('no_records').style.display != 'block') {
                    create_curr_weather_card(todayData);
                }
                else {
                    document.getElementById('no_records').style.display = 'block';
                }
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);

    tableurl = "/search_intervals_weather?location=" + lat_long
    tablexhr = new XMLHttpRequest();
    tablexhr.open('GET', tableurl, true);
    tablexhr.onload = function (e) {
        if (tablexhr.readyState === 4) {
            if (tablexhr.status === 200) {
                data = JSON.parse(tablexhr.response)
                futureData = data;
                if(futureData.length && document.getElementById('no_records').style.display != 'block') {
                    create_weather_table(futureData);
                }
                else {
                    document.getElementById('no_records').style.display = 'block';
                }
            } else {
                console.error(tablexhr.statusText);
            }
        }
    };
    tablexhr.onerror = function (e) {
        console.error(tablexhr.statusText);
    };
    tablexhr.send(null);
    }

/**
 * This is a complex demo of how to set up a Highcharts chart, coupled to a
 * dynamic source and extended by drawing image sprites, wind arrow paths
 * and a second grid on top of the chart. The purpose of the demo is to inpire
 * developers to go beyond the basic chart types and show how the library can
 * be extended programmatically. This is what the demo does:
 *
 * - Loads weather forecast from www.yr.no in form of a JSON service.
 * - When the data arrives async, a Meteogram instance is created. We have
 *   created the Meteogram prototype to provide an organized structure of the
 *   different methods and subroutines associated with the demo.
 * - The parseData method parses the data from www.yr.no into several parallel
 *   arrays. These arrays are used directly as the data option for temperature,
 *   precipitation and air pressure.
 * - After this, the options structure is built, and the chart generated with
 *   the parsed data.
 * - On chart load, weather icons and the frames for the wind arrows are
 *   rendered using custom logic.
 */

function Meteogram(json, container) {
    // Parallel arrays for the chart data, these are populated as the JSON file
    // is loaded
    this.symbols = [];
    this.humidity = [];
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];

    // Initialize
    this.json = json;
    this.container = container;

    // Run
    this.parseData();
}



/**
 * Draw blocks around wind arrows, below the plot area
 */
Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
    const xAxis = chart.xAxis[0];

    for (
        let pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5,
        i += 1
    ) {

        // Get the X position
        const isLast = pos === max + 36e5,
            x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        const isLong = this.resolution > 36e5 ?
            pos % this.resolution === 0 :
            i % 2 === 0;

        chart.renderer
            .path([
                'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                'L', x, chart.plotTop + chart.plotHeight + 32,
                'Z'
            ])
            .attr({
                stroke: chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }

    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

};

/**
 * Build and return the Highcharts options structure
 */
Meteogram.prototype.getChartOptions = function () {
    return {
        chart: {
            renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 70,
            plotBorderWidth: 1,
            height: 400,
            alignTicks: false,
            scrollablePlotArea: {
                minWidth: 720
            }
        },

        defs: {
            patterns: [{
                id: 'precipitation-error',
                path: {
                    d: [
                        'M', 3.3, 0, 'L', -6.7, 10,
                        'M', 6.7, 0, 'L', -3.3, 10,
                        'M', 10, 0, 'L', 0, 10,
                        'M', 13.3, 0, 'L', 3.3, 10,
                        'M', 16.7, 0, 'L', 6.7, 10
                    ].join(' '),
                    stroke: '#68CFE8',
                    strokeWidth: 1
                }
            }]
        },

        title: {
            text: 'Hourly Weather (For Next 5 Days)',
            align: 'center',
            style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        },

        credits: {
            text: 'Forecast from <a href="https://tomorrow.io">tomorrow.io</a>',
            href: 'https://tomorrow.io',
            position: {
                x: -40
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small>' +
                '<b>{point.point.symbolName}</b><br>'

        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 4 * 36e5, // four hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // humidity axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'inHg',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: "#f1af4c"
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: "#f1af4c"
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.y}°F</b><br/>'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Humidity',
            data: this.humidity,
            type: 'column',
            color: '#7ab3ec',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
                enabled: !this.hasPrecipitationError,
                filter: {
                    operator: '>',
                    property: 'y',
                    value: 0
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }, {
            name: 'Air pressure',
            color: "#f1af4c",
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' inHg'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: Highcharts.getOptions().colors[1],
            lineWidth: 1.5,
            data: this.winds,
            vectorLength: 18,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' mph'
            }
        }]
    };
};

/**
 * Post-process the chart from the callback function, the second argument
 * Highcharts.Chart.
 */
Meteogram.prototype.onChartLoad = function (chart) {
    this.drawBlocksForWindArrows(chart);
};

/**
 * Create the chart. This function is called async when the data file is loaded
 * and parsed.
 */
Meteogram.prototype.createChart = function () {
    this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
        this.onChartLoad(chart);
    });
};

Meteogram.prototype.error = function () {
    document.getElementById('loading').innerHTML =
        '<i class="fa fa-frown-o"></i> Failed loading data, please try again later';
};

/**
 * Handle the data. This part of the code is not Highcharts specific, but deals
 * with yr.no's specific data format
 */
Meteogram.prototype.parseData = function () {

    let pointStart;

    if (!this.json) {
        return this.error();
    }

    // Loop over hourly (or 6-hourly) forecasts
    this.json.forEach((node, i) => {

        const x = Date.parse(node.startTime),
            to = x + 36e5;

        this.temperatures.push({
            x,
            y: Math.round(node.values.temperature)
        });

        this.humidity.push({
            x,
            y: Math.round(node.values.humidity)
        });

        if (i % 2 === 0) {
            this.winds.push({
                x,
                value: node.values.windSpeed,
                direction: node.values.windDirection
            });
        }

        this.pressures.push({
            x,
            y: Math.round(node.values.pressureSeaLevel)
        });

        if (i === 0) {
            pointStart = (x + to) / 2;
        }
    });

    // Create the chart when the data is loaded
    this.createChart();
};
// End of the Meteogram protype


// On DOM ready...


function getWeatherChart() {
    // Set the hash to the yr.no URL we want to parse

    const url = "/get_next_five_days?location=" + latlong;
    Highcharts.ajax({
        url,
        dataType: 'json',
        success: json => {
            window.meteogram = new Meteogram(json, 'hourly');
            window.scrollTo(0, document.body.scrollHeight);
        },
        error: Meteogram.prototype.error,
        headers: {
            // Override the Content-Type to avoid preflight problems with CORS
            // in the Highcharts demos
            'Content-Type': 'text/plain'
        }
    });
}

function getTempMinMax() {
    ranges = []
    futureData.forEach((node, i) => {
        const x = Date.parse(node.startTime)
        ranges.push([
            x,
            node.values.temperatureMin,
            node.values.temperatureMax
        ]);
    });
    Highcharts.chart('tempminmax', {

        title: {
            text: 'Temperature Ranges (Min, Max)'
        },

        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: From current to next 15 days'
            }
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°F'
        },

        series: [{
            name: 'Temperatures',
            data: ranges,
            type: 'arearange',
            lineWidth: 2,
            linkedTo: ':previous',
            color: "#f1af4c",
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, "#f1af4c"],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            zIndex: 0,
            marker: {
                enabled: true,
                fillColor: '#7ab3ec',
                lineWidth: 2,
                lineColor: '#7ab3ec'
            }
        }]
    });
}

