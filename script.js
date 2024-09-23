var start_button = document.getElementById('start');
var main_div = document.getElementById('main-game');
var city_temperature = 0
var threshold = 0

function timer(time_per_guess){
  var sec = time_per_guess;
  var timer = setInterval(function(){
    if (sec >= 10){
      document.getElementById('safeTimerDisplay').innerHTML='00:'+sec;
    }
    else{
      document.getElementById('safeTimerDisplay').innerHTML='00:0'+sec;
    }
    sec--;
    if (sec < 0) {
      check_guess(city_temperature)
      clearInterval(timer);
    }
  }, 1000);
}

function make_map(latitude, longitude, city_name){
  var map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var marker = L.marker([latitude, longitude]).addTo(map);
}

function change_map(latitude, longitude, city_name){
  map.flyTo([latitude, longitude])
}

const cities = [
  { city: "Tokyo", country: "Japan" },
  { city: "Delhi", country: "India" },
  { city: "Shanghai", country: "China" },
  { city: "São Paulo", country: "Brazil" },
  { city: "Mumbai", country: "India" },
  { city: "Cairo", country: "Egypt" },
  { city: "Dhaka", country: "Bangladesh" },
  { city: "Mexico City", country: "Mexico" },
  { city: "Beijing", country: "China" },
  { city: "Osaka", country: "Japan" },
  { city: "New York City", country: "USA" },
  { city: "Karachi", country: "Pakistan" },
  { city: "Chongqing", country: "China" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Kolkata", country: "India" },
  { city: "Kinshasa", country: "Democratic Republic of the Congo" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Tianjin", country: "China" },
  { city: "Guangzhou", country: "China" },
  { city: "Chennai", country: "India" },
  { city: "Bogotá", country: "Colombia" },
  { city: "Chennai", country: "India" },
  { city: "Paris", country: "France" },
  { city: "Lima", country: "Peru" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Los Angeles", country: "USA" },
  { city: "Columbus", country: "USA" },
  { city: "Wuhan", country: "China" },
  { city: "Hangzhou", country: "China" },
  { city: "Hyderabad", country: "India" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Berlin", country: "Germany" },
  { city: "Madrid", country: "Spain" },
  { city: "Toronto", country: "Canada" },
  { city: "Santiago", country: "Chile" },
  { city: "Alexandria", country: "Egypt" },
  { city: "Riyadh", country: "Saudi Arabia" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Barcelona", country: "Spain" },
  { city: "Bangalore", country: "India" },
  { city: "Melbourne", country: "Australia" },
  { city: "Athens", country: "Greece" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Virginia Beach", country: "USA" },
  { city: "Medellín", country: "Colombia" },
  { city: "Addis Ababa", country: "Ethiopia" },
  { city: "Belo Horizonte", country: "Brazil" },
  { city: "Cape Town", country: "South Africa" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Abidjan", country: "Ivory Coast" },
  { city: "Algiers", country: "Algeria" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Manila", country: "Philippines" },
  { city: "Pune", country: "India" },
  { city: "San Francisco", country: "USA" },
  { city: "Brisbane", country: "Australia" },
  { city: "Frankfurt", country: "Germany" },
  { city: "Montreal", country: "Canada" },
  { city: "Sofia", country: "Bulgaria" },
  { city: "Düsseldorf", country: "Germany" },
  { city: "Helsinki", country: "Finland" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Vienna", country: "Austria" },
  { city: "Bucharest", country: "Romania" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Bamako", country: "Mali" },
  { city: "Tunis", country: "Tunisia" },
  { city: "Brussels", country: "Belgium" },
  { city: "Vilnius", country: "Lithuania" },
  { city: "Oslo", country: "Norway" },
  { city: "Tallinn", country: "Estonia" },
  { city: "Zagreb", country: "Croatia" },
  { city: "Catania", country: "Italy" },
  { city: "Sofia", country: "Bulgaria" },
  { city: "Sarajevo", country: "Bosnia and Herzegovina" },
  { city: "Podgorica", country: "Montenegro" },
  { city: "Tbilisi", country: "Georgia" },
  { city: "Yerevan", country: "Armenia" },
  { city: "Tashkent", country: "Uzbekistan" },
  { city: "Nassau", country: "Bahamas" },
  { city: "Helsinki", country: "Finland" },
  { city: "Riga", country: "Latvia" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Luxembourg City", country: "Luxembourg" },
  { city: "Chisinau", country: "Moldova" },
  { city: "Kyiv", country: "Ukraine" },
  { city: "Tirana", country: "Albania" },
  { city: "Baku", country: "Azerbaijan" },
  { city: "Lviv", country: "Ukraine" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Budapest", country: "Hungary" },
  { city: "Bratislava", country: "Slovakia" },
  { city: "Vilnius", country: "Lithuania" },
  { city: "Banja Luka", country: "Bosnia and Herzegovina" },
  { city: "Gibraltar", country: "Gibraltar" },
  { city: "Porto", country: "Portugal" },
  { city: "Milan", country: "Italy" },
  { city: "Palermo", country: "Italy" },
  { city: "Naples", country: "Italy" },
  { city: "Florence", country: "Italy" },
  { city: "Geneva", country: "Switzerland" },
  { city: "Lausanne", country: "Switzerland" },
  { city: "Basel", country: "Switzerland" },
  { city: "Zurich", country: "Switzerland" },
  { city: "San Diego", country: "USA" },
  { city: "Seattle", country: "USA" },
  { city: "Dallas", country: "USA" },
  { city: "Atlanta", country: "USA" },
  { city: "Charlotte", country: "USA" },
  { city: "Phoenix", country: "USA" },
  { city: "Jacksonville", country: "USA" },
  { city: "Indianapolis", country: "USA" },
  { city: "San Antonio", country: "USA" },
  { city: "Boston", country: "USA" },
  { city: "Washington, D.C.", country: "USA" },
  { city: "Houston", country: "USA" },
  { city: "Detroit", country: "USA" },
  { city: "Philadelphia", country: "USA" },
  { city: "Baltimore", country: "USA" },
  { city: "Minneapolis", country: "USA" },
  { city: "Orlando", country: "USA" },
  { city: "Tampa", country: "USA" },
  { city: "Miami", country: "USA" },
  { city: "Cleveland", country: "USA" },
  { city: "Cincinnati", country: "USA" },
  { city: "Kansas City", country: "USA" },
  { city: "St. Louis", country: "USA" },
  { city: "Milwaukee", country: "USA" },
  { city: "Portland", country: "USA" },
  { city: "Sacramento", country: "USA" },
  { city: "Columbus", country: "USA" },
  { city: "Virginia Beach", country: "USA" },
  { city: "Las Vegas", country: "USA" },
  { city: "Omaha", country: "USA" },
];

console.log(cities.length)

async function get_data(city_name) {
  const url = `http://api.weatherapi.com/v1/current.json?key=02e95b9779c24136aec181034241909&q=${city_name}&aqi=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json)
    return [json.location.lat, json.location.lon, json.current.temp_f];
  } catch (error) {
    console.error(error.message);
  }
}

async function start_game(time, thres){ //starts the game
  start_button.style.display = 'none';
  main_div.style.display = 'block';
  threshold = thres;
  var city_number = Math.floor(Math.random() * cities.length);
  var city_name = cities[city_number]["city"];
  console.log(city_name);
  city_country = cities[city_number]["country"];
  [city_latitude, city_longitude, city_temperature] = await get_data(city_name);
  make_map(city_latitude, city_longitude, city_name);
  document.getElementById("guess_prompt").innerHTML = `Guess the temperature in ${city_name}, ${city_country}!`
  timer(time)
  document.querySelector('#guess').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      console.log("enter key pressed!")
      check_guess(city_temperature);
      }
    }
)};

function check_guess(city_temperature){
  let guess = document.getElementById('guess').value;
  if (guess == ''){
    document.getElementById("guess_prompt").innerHTML = "You didn't guess in time :("
    return
  }
  document.getElementById("guess").value = "";
  if (Math.abs(parseFloat(guess) - city_temperature) < threshold){
    console.log("correct guess!");
    document.getElementById("guess_prompt").innerHTML = `You win! The exact temperature was ${city_temperature}\u00B0 F`
  }
  if (Math.abs(parseFloat(guess) - city_temperature) >= threshold){
    console.log("correct guess!");
    document.getElementById("guess_prompt").innerHTML = `The correct answer was ${city_temperature}\u00B0 F`
  }
}
