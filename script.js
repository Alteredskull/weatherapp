var city;

var queryUrl;

var cityArr = JSON.parse(localStorage.getItem("cityArr") || "[]");
if (cityArr[0]) {
  city = cityArr[cityArr.length - 1];
  Generate();

  queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=e23860b213628f5095ed09c8b74d5dce";
  apiCall(queryUrl);
}
else {
  navigator.geolocation.getCurrentPosition(success, error);
  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    queryUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&APPID=e23860b213628f5095ed09c8b74d5dce";
    apiCall(queryUrl);
  }
  function error() {
  }
}

function Generate() {
  $("#cityResults").empty();
  if (cityArr) {
    for (var i = 0; i < cityArr.length; i++) {
      if (city === cityArr[i]) {
        cityArr.splice(i, 1);
      }
    }
  }
  cityArr.push(city);
  localStorage.setItem("cityArray", JSON.stringify(cityArr));

  if (cityArr) {
    for (var i = 0; i < cityArr.length; i++) {
      newDiv = $("<div>").addClass("cityPlaceholder");
      $("#cityResults").prepend(newDiv);
      var newCity = $("<a>").text(cityArr[i]).addClass("newCity px-2");
      newDiv.prepend(newCity);
    }
  }
  if (cityArr.length > 3) {
    $("#clearBtn").removeClass("hide"); 
  }
}

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  city = $("#citySearch").val();
  $("#citySearch").val("");
  queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=e23860b213628f5095ed09c8b74d5dce";
  apiCall(queryUrl);
});

function apiCall(queryUrl) {

  $.ajax({
    url: queryUrl,
    method: "GET",
    success: function (response) {
      $("#alert1").addClass("hide");

      city = response.name;
      $(".currentWeatherBox").css({ "background-image": "none", "height": "auto" });

      newDiv = $("<div>").addClass("cityPlaceholder");
      $("#cityResults").prepend(newDiv);
      var newCity = $("<a>").text(city).addClass("newCity px-2");
      newDiv.prepend(newCity);

      $("#city").text(response.name);
      $("#date").text("  ( " + moment().format('l') + ") ");
      $("#weatherImg").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
      $("#description").text(response.weather[0].description);

      var temp = response.main.temp.toFixed(1);
      $('#temperature').html("Temperature: " + temp + " &#8457;");
      $('#humidity').text("Humidity: " + response.main.humidity + "%");
      $('#windSpeed').text("Wind Speed: " + response.wind.speed + " MPH");

      lon = response.coord.lon;
      lat = response.coord.lat;

      Generate();
      uvIndex();
      forecast();
    },
    error: function () {
      $("#alert1").removeClass("hide");
    }
  });
}

function uvIndex() {
  var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=imperial&APPID=e23860b213628f5095ed09c8b74d5dce";

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function (response) {
    var uv = response.value;
    $('#uv').html("The UV index is: <span>" + uv + "</span>");
  });
}

function forecast() {
  var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=e23860b213628f5095ed09c8b74d5dce";

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function (response) {

    $("#fiveDays").text("5 Day Forecast:");

    for (var i = 1; i < 6; i++) {

      var j = (i * 8) - 2;
      var newDate = $("<p>").text(moment().add(i, "days").format('l'));
      var newImg = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[j].weather[0].icon + "@2x.png");
      var humidity = $("<p>").text("Humidity: " + response.list[j].main.humidity + "%");
      var temp = $("<p>").text("Temp: " + response.list[j].main.temp.toFixed(1) + " " + String.fromCharCode(176) + "F");

      $("#date" + i).empty();
      $("#date" + i).append(newDate, newImg, temp, humidity);
    }
  });
}

$("#clearBtn").on("click", function () {
  localStorage.clear();
  $("#cityResults").empty();
  $("#clearBtn").addClass("hide");
  cityArr = [];
});

$(document).on("click", ".cityPlaceholder", function (event) {
  city = $(this).text();
  $(this).remove();
  queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=e23860b213628f5095ed09c8b74d5dce";
  apiCall(queryUrl);
});