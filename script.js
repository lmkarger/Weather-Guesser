var start_button = document.getElementById('start');
var main_div = document.getElementById('main-game');
var round = document.getElementById('round');
var round_counter
var city_temperature
var threshold
var points = 0
var guess_timer
var map
var guess_time
var marker
var settings_status = 0

function toggleSettings(){
  console.log("Toggled settings")
  const settings = document.getElementById('settings-screen')
  if (settings_status == 0){
    settings.style.display = 'flex'
    settings_status = 1
  }
  else{
    settings.style.display = 'none'
    settings_status = 0
  }
}

//settings icon
const settings_icon = document.querySelector('nav #settings img'); //initializes the settings icon
function addRotate() { //makes the settings icon rotate
  settings_icon.classList.add('rotate');
}

function removeRotate() { //makes the settings icon stop rotating
  settings_icon.classList.remove('rotate'); 
}

settings_icon.addEventListener('mouseover', addRotate); //on mouse over calls the function to make the settings icon rotate
settings_icon.addEventListener('transitionend', removeRotate); //when the rotate animation ends, the rotation property is removed

function timer(time_per_guess){ //starts a timer
  var sec = time_per_guess;
  guess_timer = setInterval(function(){
    if (sec >= 10){
      document.getElementById('safeTimerDisplay').innerHTML='00:'+sec; //displays the time
    }
    else{
      document.getElementById('safeTimerDisplay').innerHTML='00:0'+sec; //displays the time
    }
    sec--;
    if (sec == 0){
      document.getElementById('safeTimerDisplay').innerHTML='00:00' //calls check guess when the timer hits 0
      check_guess(city_temperature)
    }
    if (sec < 0) {
      document.getElementById('safeTimerDisplay').innerHTML="" //clears the timer when the timer is less than 0 
      clearInterval(guess_timer)
    }
  }, 1000); //the delay in ms for the timer to decrement, so it goes down by 1 every second
}

function wait_screen(){ //starts the wait screen
  var sec = 0.5; //the time the waitscreen is on for
  var timer = setInterval(function(){ //creates a timer for the waitscreen
    sec--;
    if (sec <= 0) {
      //show screen
      clearInterval(timer);
      change_round();
    }
  }, 1000);
}

function make_map(latitude, longitude){ //instantiates the map, places a marker on it
  map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  marker = L.marker([latitude, longitude]).addTo(map); //adds a marker to the map
}

async function change_round(){
  var city_number = Math.floor(Math.random() * cities.length); //chooses a random number
  var city_name = cities[city_number]["city"]; //sets the city_name to a random city
  city_country = cities[city_number]["country"]; //finds the country correlated the the chosen city
  [city_latitude, city_longitude, city_temperature] = await get_data(city_name); //gets the weather data for the city
  let location = [city_latitude, city_longitude]; //sets location to the location of the city
  map.flyTo(location); //flies to the cities location
  marker.setLatLng(location); //sets a marker at the new location
  document.getElementById("guess-prompt").innerHTML = `Guess the temperature in ${city_name}, ${city_country}!` //changes the guess prompt to the new city
  timer(guess_time) //starts a new timer for this round of the game
  round_counter += 1; //increments the round counter
  round.innerHTML = `Round: ${round_counter}`
}

const cities = [ //some of the cities with multiple words in them are buggy with the API
  { city: "Cairo", country: "Egypt" },
  { city: "Lagos", country: "Brazil" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Johannesburg", country: "South Africa" },
  { city: "Addis Ababa", country: "Ethiopia" },
  { city: "Dar es Salaam", country: "Tanzania" },
  { city: "Accra", country: "Ghana" },
  { city: "Kinshasa", country: "Democratic Republic of the Congo" },
  { city: "Khartoum", country: "Sudan" },
  { city: "Algiers", country: "Algeria" },
  { city: "Maputo", country: "Mozambique" },
  { city: "Havana", country: "Cuba" },
  { city: "Lusaka", country: "Zambia" },
  { city: "Harare", country: "Zimbabwe" },
  { city: "Casablanca", country: "Morocco" },
  { city: "Tunis", country: "Tunisia" },
  { city: "Douala", country: "Cameroon" },
  { city: "Yaoundé", country: "Cameroon" },
  { city: "Bamako", country: "Mali" },
  { city: "N'Djamena", country: "Chad" },
  { city: "Brazzaville", country: "Republic of the Congo" },
  { city: "Niamey", country: "Niger" },
  { city: "Ouagadougou", country: "Burkina Faso" },
  { city: "Freetown", country: "Sierra Leone" },
  { city: "Kampala", country: "Uganda" },
  { city: "Luanda", country: "Angola" },
  { city: "Gaborone", country: "Botswana" },
  { city: "Victoria", country: "Seychelles" },
  { city: "Malabo", country: "Equatorial Guinea" },
  { city: "Juba", country: "South Sudan" },
  { city: "Bujumbura", country: "Burundi" },
  { city: "Port Louis", country: "Mauritius" },
  { city: "Tanzania", country: "Tanzania" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Antananarivo", country: "Madagascar" },
  { city: "Libreville", country: "Gabon" },
  { city: "Lomé", country: "Togo" },
  { city: "Djibouti", country: "Djibouti" },
  { city: "Banjul", country: "The Gambia" },
  { city: "Mogadishu", country: "Somalia" },
  { city: "Cotonou", country: "Benin" },
  { city: "Tunis", country: "Tunisia" },
  { city: "Blantyre", country: "Malawi" },
  { city: "Maseru", country: "Lesotho" },
  { city: "Mbabane", country: "Eswatini" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Zanzibar City", country: "Tanzania" },
  { city: "Sao Tome", country: "Sao Tome and Principe" },
  { city: "Asmera", country: "Eritrea" },
  { city: "Nassau", country: "Bahamas" },
  { city: "Kigali", country: "Rwanda" },
  { city: "Cairo", country: "Egypt" },
  { city: "Cairo", country: "Egypt" },
  { city: "Mombasa", country: "Kenya" },
  { city: "Kano", country: "Nigeria" },
  { city: "Gitega", country: "Burundi" },
  { city: "Sfax", country: "Tunisia" },
  { city: "Gitega", country: "Burundi" },
  { city: "Maroua", country: "Cameroon" },
  { city: "Kigali", country: "Rwanda" },
  { city: "Agadir", country: "Morocco" },
  { city: "Zagazig", country: "Egypt" },
  { city: "Masaka", country: "Uganda" },
  { city: "Blantyre", country: "Malawi" },
  { city: "Kisumu", country: "Kenya" },
  { city: "Banjul", country: "The Gambia" },
  { city: "Lilongwe", country: "Malawi" },
  { city: "Kampala", country: "Uganda" },
  { city: "Kuwait City", country: "Kuwait" },
  { city: "Krakow", country: "Poland" },
  { city: "Cotonou", country: "Benin" },
  { city: "Victoria", country: "Seychelles" },
  { city: "Eldoret", country: "Kenya" },
  { city: "Kampala", country: "Uganda" },
  { city: "Kabul", country: "Afghanistan" },
  { city: "Salima", country: "Malawi" },
  { city: "Blantyre", country: "Malawi" },
  { city: "Pointe-Noire", country: "Republic of the Congo" },
  { city: "Bujumbura", country: "Burundi" },
  { city: "Maseru", country: "Lesotho" },
  { city: "Gaborone", country: "Botswana" },
  { city: "Banjul", country: "The Gambia" },
  { city: "Tokyo", country: "Japan" },
  { city: "Beijing", country: "China" },
  { city: "Delhi", country: "India" },
  { city: "Bangkok", country: "Thailand" },
  { city: "Seoul", country: "South Korea" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "Shanghai", country: "China" },
  { city: "Hong Kong", country: "China" },
  { city: "Singapore", country: "Singapore" },
  { city: "Jakarta", country: "Indonesia" },
  { city: "Manila", country: "Philippines" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Riyadh", country: "Saudi Arabia" },
  { city: "Karachi", country: "Pakistan" },
  { city: "Tehran", country: "Iran" },
  { city: "Dhaka", country: "Bangladesh" },
  { city: "Baku", country: "Azerbaijan" },
  { city: "Islamabad", country: "Pakistan" },
  { city: "Lahore", country: "Pakistan" },
  { city: "Ho Chi Minh City", country: "Vietnam" },
  { city: "Colombo", country: "Sri Lanka" },
  { city: "Chennai", country: "India" },
  { city: "Bangladesh", country: "Bangladesh" },
  { city: "Tashkent", country: "Uzbekistan" },
  { city: "Yerevan", country: "Armenia" },
  { city: "Astana", country: "Kazakhstan" },
  { city: "Ulaanbaatar", country: "Mongolia" },
  { city: "Naypyidaw", country: "Myanmar" },
  { city: "Thimphu", country: "Bhutan" },
  { city: "Dushanbe", country: "Tajikistan" },
  { city: "Vientiane", country: "Laos" },
  { city: "Kabul", country: "Afghanistan" },
  { city: "Bishkek", country: "Kyrgyzstan" },
  { city: "Malé", country: "Maldives" },
  { city: "Aden", country: "Yemen" },
  { city: "Kuwait City", country: "Kuwait" },
  { city: "Muscat", country: "Oman" },
  { city: "Hanoi", country: "Vietnam" },
  { city: "Manama", country: "Bahrain" },
  { city: "Doha", country: "Qatar" },
  { city: "Jerusalem", country: "Israel" },
  { city: "Amman", country: "Jordan" },
  { city: "Kabul", country: "Afghanistan" },
  { city: "Surabaya", country: "Indonesia" },
  { city: "Bandung", country: "Indonesia" },
  { city: "Nha Trang", country: "Vietnam" },
  { city: "Chengdu", country: "China" },
  { city: "Xi'an", country: "China" },
  { city: "Hangzhou", country: "China" },
  { city: "Shenzhen", country: "China" },
  { city: "Suzhou", country: "China" },
  { city: "Nanjing", country: "China" },
  { city: "Wuhan", country: "China" },
  { city: "Tianjin", country: "China" },
  { city: "Guangzhou", country: "China" },
  { city: "Chennai", country: "India" },
  { city: "Ahmedabad", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "Kolkata", country: "India" },
  { city: "Surat", country: "India" },
  { city: "Vadodara", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Nagpur", country: "India" },
  { city: "Indore", country: "India" },
  { city: "Lucknow", country: "India" },
  { city: "Jaipur", country: "India" },
  { city: "Patna", country: "India" },
  { city: "Kanpur", country: "India" },
  { city: "Nashik", country: "India" },
  { city: "Visakhapatnam", country: "India" },
  { city: "Thane", country: "India" },
  { city: "Gurgaon", country: "India" },
  { city: "Noida", country: "India" },
  { city: "Faridabad", country: "India" },
  { city: "Mysore", country: "India" },
  { city: "Coimbatore", country: "India" },
  { city: "Trivandrum", country: "India" },
  { city: "Vijayawada", country: "India" },
  { city: "Raipur", country: "India" },
  { city: "Kota", country: "India" },
  { city: "Agra", country: "India" },
  { city: "Allahabad", country: "India" },
  { city: "Dehradun", country: "India" },
  { city: "Srinagar", country: "India" },
  { city: "Dharamshala", country: "India" },
  { city: "Shimla", country: "India" },
  { city: "Jodhpur", country: "India" },
  { city: "Udaipur", country: "India" },
  { city: "Ajmer", country: "India" },
  { city: "Ranchi", country: "India" },
  { city: "Jabalpur", country: "India" },
  { city: "Gwalior", country: "India" },
  { city: "Raipur", country: "India" },
  { city: "Chandigarh", country: "India" },
  { city: "Panaji", country: "India" },
  { city: "Port Blair", country: "India" },
  { city: "Dimapur", country: "India" },
  { city: "Imphal", country: "India" },
  { city: "Agartala", country: "India" },
  { city: "Aizawl", country: "India" },
  { city: "London", country: "United Kingdom" },
  { city: "Paris", country: "France" },
  { city: "Berlin", country: "Germany" },
  { city: "Madrid", country: "Spain" },
  { city: "Rome", country: "Italy" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Brussels", country: "Belgium" },
  { city: "Vienna", country: "Austria" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Budapest", country: "Hungary" },
  { city: "Copenhagen", country: "Denmark" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Oslo", country: "Norway" },
  { city: "Dublin", country: "Ireland" },
  { city: "Helsinki", country: "Finland" },
  { city: "Athens", country: "Greece" },
  { city: "Sofia", country: "Bulgaria" },
  { city: "Zagreb", country: "Croatia" },
  { city: "Bratislava", country: "Slovakia" },
  { city: "Tallinn", country: "Estonia" },
  { city: "Riga", country: "Latvia" },
  { city: "Vilnius", country: "Lithuania" },
  { city: "Belgrade", country: "Serbia" },
  { city: "Sarajevo", country: "Bosnia and Herzegovina" },
  { city: "Ljubljana", country: "Slovenia" },
  { city: "Pristina", country: "Kosovo" },
  { city: "Tirana", country: "Albania" },
  { city: "Skopje", country: "North Macedonia" },
  { city: "Chisinau", country: "Moldova" },
  { city: "Kyiv", country: "Ukraine" },
  { city: "Minsk", country: "Belarus" },
  { city: "Moscow", country: "Russia" },
  { city: "Saint Petersburg", country: "Russia" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Frankfurt", country: "Germany" },
  { city: "Munich", country: "Germany" },
  { city: "Cologne", country: "Germany" },
  { city: "Hamburg", country: "Germany" },
  { city: "Geneva", country: "Switzerland" },
  { city: "Zurich", country: "Switzerland" },
  { city: "Catania", country: "Italy" },
  { city: "Naples", country: "Italy" },
  { city: "Palermo", country: "Italy" },
  { city: "Valencia", country: "Spain" },
  { city: "Barcelona", country: "Spain" },
  { city: "Seville", country: "Spain" },
  { city: "Lisbon", country: "Portugal" },
  { city: "Oporto", country: "Portugal" },
  { city: "Düsseldorf", country: "Germany" },
  { city: "Nuremberg", country: "Germany" },
  { city: "Stuttgart", country: "Germany" },
  { city: "Antwerp", country: "Belgium" },
  { city: "Ghent", country: "Belgium" },
  { city: "Bruges", country: "Belgium" },
  { city: "Ghent", country: "Belgium" },
  { city: "Bordeaux", country: "France" },
  { city: "Marseille", country: "France" },
  { city: "Nice", country: "France" },
  { city: "Lille", country: "France" },
  { city: "Toulouse", country: "France" },
  { city: "Lyon", country: "France" },
  { city: "Catania", country: "Italy" },
  { city: "Turin", country: "Italy" },
  { city: "Florence", country: "Italy" },
  { city: "Bologna", country: "Italy" },
  { city: "Hannover", country: "Germany" },
  { city: "Wiesbaden", country: "Germany" },
  { city: "Nantes", country: "France" },
  { city: "Strasbourg", country: "France" },
  { city: "Marseille", country: "France" },
  { city: "Alicante", country: "Spain" },
  { city: "Malaga", country: "Spain" },
  { city: "Granada", country: "Spain" },
  { city: "Valencia", country: "Spain" },
  { city: "Birmingham", country: "United Kingdom" },
  { city: "Glasgow", country: "United Kingdom" },
  { city: "Liverpool", country: "United Kingdom" },
  { city: "Manchester", country: "United Kingdom" },
  { city: "Edinburgh", country: "United Kingdom" },
  { city: "Cardiff", country: "United Kingdom" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Gothenburg", country: "Sweden" },
  { city: "Malmo", country: "Sweden" },
  { city: "Oslo", country: "Norway" },
  { city: "Bergen", country: "Norway" },
  { city: "Stavanger", country: "Norway" },
  { city: "Reykjavik", country: "Iceland" },
  { city: "Zurich", country: "Switzerland" },
  { city: "Bern", country: "Switzerland" },
  { city: "New York", country: "United States" },
  { city: "Los Angeles", country: "United States" },
  { city: "Chicago", country: "United States" },
  { city: "Houston", country: "United States" },
  { city: "Phoenix", country: "United States" },
  { city: "Philadelphia", country: "United States" },
  { city: "San Antonio", country: "United States" },
  { city: "San Diego", country: "United States" },
  { city: "Dallas", country: "United States" },
  { city: "San Jose", country: "United States" },
  { city: "Austin", country: "United States" },
  { city: "Jacksonville", country: "United States" },
  { city: "Fort Worth", country: "United States" },
  { city: "Columbus", country: "United States" },
  { city: "San Francisco", country: "United States" },
  { city: "Charlotte", country: "United States" },
  { city: "Indianapolis", country: "United States" },
  { city: "Seattle", country: "United States" },
  { city: "Denver", country: "United States" },
  { city: "Boston", country: "United States" },
  { city: "El Paso", country: "United States" },
  { city: "Detroit", country: "United States" },
  { city: "Nashville", country: "United States" },
  { city: "Baltimore", country: "United States" },
  { city: "Milwaukee", country: "United States" },
  { city: "Albuquerque", country: "United States" },
  { city: "Tucson", country: "United States" },
  { city: "Fresno", country: "United States" },
  { city: "Sacramento", country: "United States" },
  { city: "Long Beach", country: "United States" },
  { city: "Kansas City", country: "United States" },
  { city: "Mesa", country: "United States" },
  { city: "Virginia Beach", country: "United States" },
  { city: "Atlanta", country: "United States" },
  { city: "Colorado Springs", country: "United States" },
  { city: "Omaha", country: "United States" },
  { city: "Raleigh", country: "United States" },
  { city: "Miami", country: "United States" },
  { city: "Cleveland", country: "United States" },
  { city: "Tulsa", country: "United States" },
  { city: "Oakland", country: "United States" },
  { city: "Minneapolis", country: "United States" },
  { city: "Wichita", country: "United States" },
  { city: "New Orleans", country: "United States" },
  { city: "Arlington", country: "United States" },
  { city: "Bakersfield", country: "United States" },
  { city: "Tampa", country: "United States" },
  { city: "Honolulu", country: "United States" },
  { city: "Anaheim", country: "United States" },
  { city: "Santa Ana", country: "United States" },
  { city: "Corpus Christi", country: "United States" },
  { city: "Riverside", country: "United States" },
  { city: "St. Louis", country: "United States" },
  { city: "Lexington", country: "United States" },
  { city: "Stockton", country: "United States" },
  { city: "Pittsburgh", country: "United States" },
  { city: "Anchorage", country: "United States" },
  { city: "Cincinnati", country: "United States" },
  { city: "Henderson", country: "United States" },
  { city: "Greensboro", country: "United States" },
  { city: "Plano", country: "United States" },
  { city: "Newark", country: "United States" },
  { city: "Chula Vista", country: "United States" },
  { city: "Buffalo", country: "United States" },
  { city: "Fort Wayne", country: "United States" },
  { city: "Jersey City", country: "United States" },
  { city: "St. Petersburg", country: "United States" },
  { city: "Chandler", country: "United States" },
  { city: "Laredo", country: "United States" },
  { city: "Madison", country: "United States" },
  { city: "Gilbert", country: "United States" },
  { city: "Hialeah", country: "United States" },
  { city: "Richmond", country: "United States" },
  { city: "Boise", country: "United States" },
  { city: "Des Moines", country: "United States" },
  { city: "Spokane", country: "United States" },
  { city: "San Bernardino", country: "United States" },
  { city: "Modesto", country: "United States" },
  { city: "Fontana", country: "United States" },
  { city: "Santa Clarita", country: "United States" },
  { city: "Birmingham", country: "United States" },
  { city: "Oxnard", country: "United States" },
  { city: "Fremont", country: "United States" },
  { city: "Moreno Valley", country: "United States" },
  { city: "Glendale", country: "United States" },
  { city: "Huntington Beach", country: "United States" },
  { city: "Salt Lake City", country: "United States" },
  { city: "Grand Rapids", country: "United States" },
  { city: "Huntsville", country: "United States" },
  { city: "Tallahassee", country: "United States" },
  { city: "Cape Coral", country: "United States" },
  { city: "Fort Lauderdale", country: "United States" },
  { city: "Visalia", country: "United States" },
  { city: "El Monte", country: "United States" },
  { city: "Torrance", country: "United States" },
  { city: "Pasadena", country: "United States" },
  { city: "Orange", country: "United States" },
  { city: "Fullerton", country: "United States" },
  { city: "Santa Rosa", country: "United States" },
  { city: "Vallejo", country: "United States" },
  { city: "Pueblo", country: "United States" },
  { city: "Daly City", country: "United States" },
  { city: "Wilmington", country: "United States" },
  { city: "Arvada", country: "United States" },
  { city: "Westminster", country: "United States" },
  { city: "Miami Beach", country: "United States" },
  { city: "Hesperia", country: "United States" },
  { city: "Carlsbad", country: "United States" },
  { city: "Rialto", country: "United States" },
  { city: "Temecula", country: "United States" },
  { city: "Tustin", country: "United States" },
  { city: "São Paulo", country: "Brazil" },
  { city: "Rio de Janeiro", country: "Brazil" },
  { city: "Buenos Aires", country: "Argentina" },
  { city: "Lima", country: "Peru" },
  { city: "Bogotá", country: "Colombia" },
  { city: "Santiago", country: "Chile" },
  { city: "Caracas", country: "Venezuela" },
  { city: "Salvador", country: "Brazil" },
  { city: "Fortaleza", country: "Brazil" },
  { city: "Belo Horizonte", country: "Brazil" },
  { city: "Curitiba", country: "Brazil" },
  { city: "Manaus", country: "Brazil" },
  { city: "Recife", country: "Brazil" },
  { city: "Porto Alegre", country: "Brazil" },
  { city: "Brasília", country: "Brazil" },
  { city: "Guayaquil", country: "Ecuador" },
  { city: "Quito", country: "Ecuador" },
  { city: "Asunción", country: "Paraguay" },
  { city: "La Paz", country: "Bolivia" },
  { city: "Santa Cruz", country: "Bolivia" },
  { city: "Sucre", country: "Bolivia" },
  { city: "Valparaíso", country: "Chile" },
  { city: "Antofagasta", country: "Chile" },
  { city: "Mendoza", country: "Argentina" },
  { city: "Cordoba", country: "Argentina" },
  { city: "Tucumán", country: "Argentina" },
  { city: "Maracaibo", country: "Venezuela" },
  { city: "Barquisimeto", country: "Venezuela" },
  { city: "San Salvador", country: "El Salvador" },
  { city: "Santa Marta", country: "Colombia" },
  { city: "Cali", country: "Colombia" },
  { city: "Medellín", country: "Colombia" },
  { city: "Iquique", country: "Chile" },
  { city: "Arequipa", country: "Peru" },
  { city: "Trujillo", country: "Peru" },
  { city: "Punta Arenas", country: "Chile" },
  { city: "La Serena", country: "Chile" },
  { city: "Lagos", country: "Brazil" },
  { city: "Maceió", country: "Brazil" },
  { city: "Ceará", country: "Brazil" },
  { city: "Niterói", country: "Brazil" },
  { city: "Teresina", country: "Brazil" },
  { city: "São Luís", country: "Brazil" },
  { city: "João Pessoa", country: "Brazil" },
  { city: "Aracaju", country: "Brazil" },
  { city: "Natal", country: "Brazil" },
  { city: "Cochabamba", country: "Bolivia" },
  { city: "La Paz", country: "Bolivia" },
  { city: "San Juan", country: "Argentina" },
  { city: "Posadas", country: "Argentina" },
  { city: "Resistencia", country: "Argentina" },
  { city: "Rio Gallegos", country: "Argentina" },
  { city: "Bahía Blanca", country: "Argentina" },
  { city: "Córdoba", country: "Argentina" },
  { city: "Pereira", country: "Colombia" },
  { city: "Cúcuta", country: "Colombia" },
  { city: "Popayán", country: "Colombia" },
  { city: "Neiva", country: "Colombia" },
  { city: "Manizales", country: "Colombia" },
  { city: "Bucaramanga", country: "Colombia" },
  { city: "Santo Domingo", country: "Dominican Republic" },
  { city: "Valencia", country: "Venezuela" },
  { city: "Maracay", country: "Venezuela" },
  { city: "Cali", country: "Colombia" },
  { city: "Tumbes", country: "Peru" },
  { city: "Piura", country: "Peru" },
  { city: "Cajamarca", country: "Peru" },
  { city: "Tarija", country: "Bolivia" },
  { city: "Potosí", country: "Bolivia" },
  { city: "Punta del Este", country: "Uruguay" },
  { city: "Montevideo", country: "Uruguay" },
  { city: "Salto", country: "Uruguay" },
  { city: "Cerro Largo", country: "Uruguay" },
  { city: "Colonia del Sacramento", country: "Uruguay" },
  { city: "La Paloma", country: "Uruguay" },
  { city: "Tacuarembó", country: "Uruguay" },
  { city: "Maldonado", country: "Uruguay" },
  { city: "Foz do Iguaçu", country: "Brazil" },
  { city: "Curitiba", country: "Brazil" },
  { city: "Iguazu", country: "Argentina" },
  { city: "Puerto Iguazú", country: "Argentina" },
  { city: "Sydney", country: "Australia" },
  { city: "Melbourne", country: "Australia" },
  { city: "Brisbane", country: "Australia" },
  { city: "Perth", country: "Australia" },
  { city: "Adelaide", country: "Australia" },
  { city: "Gold Coast", country: "Australia" },
  { city: "Canberra", country: "Australia" },
  { city: "Hobart", country: "Australia" },
  { city: "Darwin", country: "Australia" },
  { city: "Newcastle", country: "Australia" },
  { city: "Wollongong", country: "Australia" },
  { city: "Central Coast", country: "Australia" },
  { city: "Geelong", country: "Australia" },
  { city: "Cairns", country: "Australia" },
  { city: "Toowoomba", country: "Australia" },
  { city: "Sunshine Coast", country: "Australia" },
  { city: "Ballarat", country: "Australia" },
  { city: "Bendigo", country: "Australia" },
  { city: "Mackay", country: "Australia" },
  { city: "Coffs Harbour", country: "Australia" },
  { city: "Townsville", country: "Australia" },
  { city: "Victoria", country: "Australia" },
  { city: "Halifax", country: "Canada" },
  { city: "Toronto", country: "Canada" },
  { city: "Vancouver", country: "Canada" },
  { city: "Montreal", country: "Canada" },
  { city: "Calgary", country: "Canada" },
  { city: "Ottawa", country: "Canada" },
  { city: "Edmonton", country: "Canada" },
  { city: "Winnipeg", country: "Canada" },
  { city: "Quebec City", country: "Canada" },
  { city: "Victoria", country: "Canada" },
  { city: "Saskatoon", country: "Canada" },
  { city: "Kitchener", country: "Canada" },
  { city: "London", country: "Canada" },
  { city: "Hamilton", country: "Canada" },
  { city: "St. Catharines", country: "Canada" },
  { city: "Halifax", country: "Canada" },
  { city: "Regina", country: "Canada" },
  { city: "Burnaby", country: "Canada" },
  { city: "Mississauga", country: "Canada" },
  { city: "Chilliwack", country: "Canada" },
  { city: "Nanaimo", country: "Canada" },
  { city: "Abbotsford", country: "Canada" },
  { city: "Thunder Bay", country: "Canada" },
  { city: "Kelowna", country: "Canada" },
  { city: "Moncton", country: "Canada" },
  { city: "Saint John", country: "Canada" },
  { city: "Peterborough", country: "Canada" },
  { city: "Lethbridge", country: "Canada" },
  { city: "Fredericton", country: "Canada" },
  { city: "Grande Prairie", country: "Canada" },
  { city: "Red Deer", country: "Canada" },
  { city: "Sherwood Park", country: "Canada" },
  { city: "Langley", country: "Canada" },
  { city: "Pyongyang", country: "North Korea"},
  { city: "Auckland", country: "New Zealand" },
  { city: "Wellington", country: "New Zealand" },
  { city: "Christchurch", country: "New Zealand" },
  { city: "Hamilton", country: "New Zealand" },
  { city: "Tauranga", country: "New Zealand" },
  { city: "Napier", country: "New Zealand" },
  { city: "Dunedin", country: "New Zealand" },
  { city: "Palmerston North", country: "New Zealand" },
  { city: "Nelson", country: "New Zealand" },
  { city: "Rotorua", country: "New Zealand" },
  { city: "New Plymouth", country: "New Zealand" },
  { city: "Whangarei", country: "New Zealand" },
  { city: "Invercargill", country: "New Zealand" },
  { city: "Timaru", country: "New Zealand" },
  { city: "Gisborne", country: "New Zealand" },
  { city: "Masterton", country: "New Zealand" },
  { city: "Taupo", country: "New Zealand" },
  { city: "Oamaru", country: "New Zealand" },
  { city: "Feilding", country: "New Zealand" },
  { city: "Ashburton", country: "New Zealand" },
  { city: "Vladivostok", country: "Russia" },
  { city: "Moscow", country: "Russia" },
  { city: "Saint Petersburg", country: "Russia" },
  { city: "Novosibirsk", country: "Russia" },
  { city: "Yekaterinburg", country: "Russia" },
  { city: "Nizhny Novgorod", country: "Russia" },
  { city: "Kazan", country: "Russia" },
  { city: "Chelyabinsk", country: "Russia" },
  { city: "Omsk", country: "Russia" },
  { city: "Samara", country: "Russia" },
  { city: "Rostov-on-Don", country: "Russia" },
  { city: "Ufa", country: "Russia" },
  { city: "Krasnoyarsk", country: "Russia" },
  { city: "Voronezh", country: "Russia" },
  { city: "Perm", country: "Russia" },
  { city: "Volgograd", country: "Russia" },
  { city: "Saratov", country: "Russia" },
  { city: "Tolyatti", country: "Russia" },
  { city: "Irvine", country: "Russia" },
  { city: "Barnaul", country: "Russia" },
  { city: "Khabarovsk", country: "Russia" },
  { city: "Chita", country: "Russia" },
  { city: "Yakutsk", country: "Russia" },
  { city: "Ulan-Ude", country: "Russia" },
  { city: "Sochi", country: "Russia" },
  { city: "Petrozavodsk", country: "Russia" },
  { city: "Kirov", country: "Russia" },
  { city: "Vologda", country: "Russia" },
  { city: "Tver", country: "Russia" },
  { city: "Surgut", country: "Russia" },
  { city: "Magnitogorsk", country: "Russia" },
  { city: "Murmansk", country: "Russia" },
  { city: "Astrakhan", country: "Russia" },
  { city: "Tula", country: "Russia" },
  { city: "Nuuk", country: "Greenland" },
  { city: "Sisimiut", country: "Greenland" },
  { city: "Ilulissat", country: "Greenland" },
  { city: "Qaqortoq", country: "Greenland" },
  { city: "Aasiaat", country: "Greenland" },
  { city: "Nanortalik", country: "Greenland" },
  { city: "Qasigiannguit", country: "Greenland" },
  { city: "Uummannaq", country: "Greenland" },
  { city: "Tasiilaq", country: "Greenland" },
  { city: "Narsaq", country: "Greenland" },
  { city: "Kangerlussuaq", country: "Greenland" },
  { city: "Ittoqqortoormiit", country: "Greenland" },
  { city: "Paamiut", country: "Greenland" },
  { city: "Qeqertaq", country: "Greenland" },
  { city: "Sarfaq", country: "Greenland" },
  { city: "T Nuuk", country: "Greenland" },
  { city: "Reykjavik", country: "Iceland" },
  { city: "Kopavogur", country: "Iceland" },
  { city: "Hafnarfjordur", country: "Iceland" },
  { city: "Akureyri", country: "Iceland" },
  { city: "Selfoss", country: "Iceland" },
  { city: "Akranes", country: "Iceland" },
  { city: "Vestmannaeyjar", country: "Iceland" },
  { city: "Reykjanesbær", country: "Iceland" },
  { city: "Isafjordur", country: "Iceland" },
  { city: "Seydisfjordur", country: "Iceland" },
  { city: "Vik í Myrdal", country: "Iceland" }
];

async function get_data(city_name) { //gets current weather data from the API
  const url = `http://api.weatherapi.com/v1/current.json?key=02e95b9779c24136aec181034241909&q=${city_name}&aqi=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`); //returns error if the API call doesnt work
    }
    const json = await response.json();
    return [json.location.lat, json.location.lon, json.current.temp_f]; //returns the data we want
  } catch (error) {
    console.error(error.message);
  }
}

async function start_game(time, thres){ //starts the game
  round_counter = 1;
  round.innerHTML = `Round: 1`
  guess_time = time //sets the timer you have to guess to the time chosen in the settings menu
  start_button.style.display = 'none'; //hides the start button
  main_div.style.display = 'block'; //shows the game screen
  threshold = thres; //sets the threshold for points to the threshold chosen in the settings menu
  var city_number = Math.floor(Math.random() * cities.length); //chooses a random number
  var city_name = cities[city_number]["city"]; //chooses a random city using the random number
  var city_country = cities[city_number]["country"]; //stores the country associated with the chosen city
  [city_latitude, city_longitude, city_temperature] = await get_data(city_name); //gets the relevant data for the city
  make_map(city_latitude, city_longitude); //creates the map and goes to the correct location 
  document.getElementById("guess-prompt").innerHTML = `Guess the temperature in ${city_name}, ${city_country}!` //creates the guess prompt
  timer(time) //starts the timer
  document.querySelector('#guess').addEventListener('keypress', function (e) { //adds an event listener in the search bar to check guesses
    if (e.key === 'Enter') {
      //console.log("enter key pressed!")
      check_guess(city_temperature);
      }
    }
)};

function check_guess(city_temperature){ //checks the guess to see if it's close to the threshold
  clearInterval(guess_timer); //clears the timer
  const searchInput = document.getElementById('guess'); //sets searchInput to the HTML search input
  guess = searchInput.value; //gets the guess from searchInput
  if (guess == ''){ //checks if the guess is nothing
    console.log(guess == '')
    document.getElementById("guess-prompt").innerHTML = "You didn't guess in time :("
    return
  }
  searchInput.value = ''; //clears the searchbar
  searchInput.focus(); //refocuses on the searchbar so another guess can be made
  if (Math.abs(parseFloat(guess) - city_temperature) < threshold){ //all the following lines just check if the guess was in the threshold and then evaluates the points you should get
    //console.log("correct guess!");
    let points_awarded = Math.floor(5000/(1 + Math.abs(parseFloat(guess) - city_temperature)))
    points += points_awarded
    document.getElementById("points-tracker").innerHTML = `You have ${points} points!`
    document.getElementById("guess-prompt").innerHTML = `You win! The exact temperature was ${city_temperature}\u00B0 F`
  }
  if (Math.abs(parseFloat(guess) - city_temperature) >= threshold){
    //console.log("correct guess!");
    document.getElementById("guess-prompt").innerHTML = `The correct answer was ${city_temperature}\u00B0 F`
  }
  wait_screen(); //turns on the waitscreen after the guess was made
}
