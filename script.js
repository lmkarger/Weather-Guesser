var start_button = document.getElementById('start');
var main_div = document.getElementById('main-game');

function timer(time_per_guess){
  var sec = time_per_guess;
  var timer = setInterval(function(){
      document.getElementById('safeTimerDisplay').innerHTML='00:'+sec;
      sec--;
      if (sec < 0) {
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

const cities = [ //98 cities
  { city: "New York", country: "USA" },
  { city: "Los Angeles", country: "USA" },
  { city: "Chicago", country: "USA" },
  { city: "Houston", country: "USA" },
  { city: "Phoenix", country: "USA" },
  { city: "Philadelphia", country: "USA" },
  { city: "San Antonio", country: "USA" },
  { city: "San Diego", country: "USA" },
  { city: "Dallas", country: "USA" },
  { city: "San Jose", country: "USA" },
  { city: "Toronto", country: "Canada" },
  { city: "Vancouver", country: "Canada" },
  { city: "Montreal", country: "Canada" },
  { city: "Calgary", country: "Canada" },
  { city: "Ottawa", country: "Canada" },
  { city: "Mexico City", country: "Mexico" },
  { city: "Guadalajara", country: "Mexico" },
  { city: "Monterrey", country: "Mexico" },
  { city: "São Paulo", country: "Brazil" },
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Santiago", country: "Chile" },
  { city: "Bogotá", country: "Colombia" },
  { city: "Lima", country: "Peru" },
  { city: "London", country: "UK" },
  { city: "Manchester", country: "UK" },
  { city: "Birmingham", country: "UK" },
  { city: "Glasgow", country: "UK" },
  { city: "Edinburgh", country: "UK" },
  { city: "Paris", country: "France" },
  { city: "Marseille", country: "France" },
  { city: "Lyon", country: "France" },
  { city: "Berlin", country: "Germany" },
  { city: "Munich", country: "Germany" },
  { city: "Hamburg", country: "Germany" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Brussels", country: "Belgium" },
  { city: "Zurich", country: "Switzerland" },
  { city: "Vienna", country: "Austria" },
  { city: "Madrid", country: "Spain" },
  { city: "Barcelona", country: "Spain" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Rome", country: "Italy" },
  { city: "Milan", country: "Italy" },
  { city: "Naples", country: "Italy" },
  { city: "Cairo", country: "Egypt" },
  { city: "Johannesburg", country: "South Africa" },
  { city: "Cape Town", country: "South Africa" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Accra", country: "Ghana" },
  { city: "Dubai", country: "UAE" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Tehran", country: "Iran" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Tokyo", country: "Japan" },
  { city: "Seoul", country: "South Korea" },
  { city: "Beijing", country: "China" },
  { city: "Shanghai", country: "China" },
  { city: "Hong Kong", country: "China" },
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Bangalore", country: "India" },
  { city: "Sydney", country: "Australia" },
  { city: "Melbourne", country: "Australia" },
  { city: "Brisbane", country: "Australia" },
  { city: "Auckland", country: "New Zealand" },
  { city: "Wellington", country: "New Zealand" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Manila", country: "Philippines" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Singapore", country: "Singapore" },
  { city: "Riyadh", country: "Saudi Arabia" },
  { city: "Doha", country: "Qatar" },
  { city: "Muscat", country: "Oman" },
  { city: "Damascus", country: "Syria" },
  { city: "Baghdad", country: "Iraq" },
  { city: "Kabul", country: "Afghanistan" },
  { city: "Helsinki", country: "Finland" },
  { city: "Oslo", country: "Norway" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Reykjavik", country: "Iceland" },
  { city: "Tallinn", country: "Estonia" },
  { city: "Vilnius", country: "Lithuania" },
  { city: "Riga", country: "Latvia" },
  { city: "Bucharest", country: "Romania" },
  { city: "Sofia", country: "Bulgaria" },
  { city: "Budapest", country: "Hungary" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Sarajevo", country: "Bosnia and Herzegovina" },
  { city: "Zagreb", country: "Croatia" },
  { city: "Ljubljana", country: "Slovenia" },
  { city: "Belgrade", country: "Serbia" },
  { city: "Tbilisi", country: "Georgia" },
  { city: "Yerevan", country: "Armenia" },
  { city: "Baku", country: "Azerbaijan" },
  { city: "Nicosia", country: "Cyprus" }
];

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

async function start_game(time){ //starts the game
  start_button.style.display = 'none';
  main_div.style.display = 'block';

  city_number = Math.floor(Math.random() * 98);
  city_name = cities[city_number]["city"];
  console.log(city_name);
  city_country = cities[city_number]["country"];
  var [city_latitude, city_longitude, city_temperature] = await get_data(city_name);
  make_map(city_latitude, city_longitude, city_name);
  document.getElementById("guess_prompt").innerHTML = `Guess the temperature in ${city_name}, ${city_country}!`
  timer(time)
  document.querySelector('#guess').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      console.log("enter key pressed!")
      guess = document.getElementById('guess').innerHTML
      document.getElementById('guess').innerHTML = ""
      if (guess === city_temperature){
        console.log("correct guess!")
      }
      }
    }
)};
