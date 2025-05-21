async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "8884991cca65fd9f381cb9219c5548f7";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const humidity = data.main.humidity;

  document.getElementById("weatherResult").innerHTML = `
    <p>Temperature: ${temp}°C</p>
    <p>Feels Like: ${feelsLike}°C</p>
    <p>Humidity: ${humidity}%</p>
  `;

  new Chart(document.getElementById("weatherChart"), {
    type: 'bar',
    data: {
      labels: ['Temperature', 'Feels Like', 'Humidity'],
      datasets: [{
        label: `Weather in ${city}`,
        data: [temp, feelsLike, humidity],
        backgroundColor: ['#4dabf7', '#74c0fc', '#a5d8ff']
      }]
    }
  });
}
